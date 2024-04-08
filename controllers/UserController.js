import userModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { generateOtp } from "../utils/GenerateOtp.js";
import sendEmail from "../utils/EmailSender.js";

export const getAllUsers = async (req, res) => {
  try {
    let data = await userModel.find().populate("role");
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res, next) => {
  try {
    let user = await userModel.findOne({ username: req.body.username }).populate("role");

    if (user != null) {
      // Check if account is verified
      if (user.status == "unverified") {
        const otp = generateOtp(6);
        await sendEmail(user.email, " ", otp); // Assuming you have a function sendEmail for sending emails
        // Update user document with new OTP
        await userModel.updateOne({ username: req.body.username }, { otp: otp });
        return res.status(400).json({ message: 'OTP sent. Please verify your email.' });
      }

      // Check if account is inactive
      if (user.status === "inactive") {
        // Inform user and prompt to create a new account
        return res.send({ responseCode: 400, msg: "Your account is inactive. Please create a new account." });
      }

      // Proceed with login if verified and active
      if (user.password === req.body.password) {
        const token = jwt.sign({ data: user }, process.env.JWT_SECRETKEY);
        return res.send({
          responseCode: 200,
          msg: "Login Successfully",
          data: user,
          token: `Bearer ${token}`,
        });
      } else {
        return res.send({ responseCode: 400, msg: "Invalid Username or Password" });
      }
    } else {
      return res.send({ responseCode: 404, msg: "No User Found!" });
    }
  } catch (error) {
    return next(error);
  }
};

export const getOtp = async (req, res) => {
  try {
    const otp = generateOtp(6)
    const emailResp = await sendEmail(req.body.email, " ", otp);
    if (!emailResp.success) {
      throw new Error(emailResp.message);
    }
    await userModel.updateOne({ username }, { otp: otp });
    res.send(emailResp)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOtp = async (req, res, next) => {

  try {
    const { username, otp } = req.body;

    // Find the user by username
    const user = await userModel.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if OTP timeout has occurred (assuming timeout after 2 minutes)
    const otpUpdatedAt = new Date(user.updatedAt); // Convert createdAt to Date object
    const currentTime = new Date();
    const timeDifference = (currentTime - otpUpdatedAt) / (1000 * 60); // Convert milliseconds to minutes

    if (timeDifference > 1) {
      const otp = generateOtp(6)
      await sendEmail(user.email, " ", otp);
      // Update user document with new OTP
      await userModel.updateOne({ username }, { otp: otp });
      return res.status(400).json({ message: 'OTP timeout. New OTP sent' });
    }

    // Check if the OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the status of the user to "active"
    await userModel.updateOne({ username }, { status: 'active' });

    // Send success response
    res.status(200).json({ message: 'OTP verified!' });
  } catch (error) {
    next(error);
  }
};

export const postUser = async (req, res, next) => {
  try {
    const otp = generateOtp(6);
    const data = userModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      avatar: req.file.filename,
      cnic: req.body.cnic,
      cell1: req.body.cell1,
      cell2: req.body.cell2,
      address: req.body.address,
      role: req.body.role,
      otp: otp,
    });
    await data.save();

    // Send email with OTP
    const emailResp = await sendEmail(req.body.email, " ", otp, next);

    // Send success response
    res.status(200).json({ responseCode: 200, msg: "Registered Successfully!" });
  } catch (error) {
    next(error);
  }
};





// Update user status controller
export const updateStatus = async (req, res) => {
  try {
    const { status, _id } = req.body;

    // Validate the status
    if (!['active', 'inactive', 'unverified'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Update user status
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};
