import userModel from "../models/UserModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  try {
    let data = await userModel.find().populate("role");
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    let data = await userModel.findOne({ username: req.body.username }).populate("role");
    if (data != null) {
      if (data.password == req.body.password) {
        const token = jwt.sign({ data: data }, process.env.JWT_SECRETKEY);
        res.send({
          responseCode: 200,
          msg: "Login Successfully",
          data: data,
          token: `Bearer ${token}`,
        });
      } else {
        res.send({ responseCode: 400, msg: "Invalid Username or Password" });
      }
    } else res.send({ responseCode: 404, msg: "No User Found!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOtp = async (req, res) => {
  try {
    let otp = Math.floor(Math.random() * 1000000);

    console.log("otp is:", otp);

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "tia.kemmer@ethereal.email",
        pass: "bwcVbsWZP4242EpcSv",
      },
    });

    const mailOptions = {
      from: '"Sajid" <tia.kemmer@ethereal.email>',
      to: "mk0180770@gmail.com",
      subject: "Test Email from Nodemailer",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.send({
      otp: otp,
      msg: "Message sent successfully",
      responseCode: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postUser = async (req, res) => {
  try {
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
      status: req.body.status,
      role: req.body.role,
    });

    const result = await data.save();
    res.status(201).json({ msg: "User created successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user status controller
export const updateStatus = async (req, res) => {
  try {
    const { status, _id } = req.body;

    // Validate the status
    if (!['active', 'inactive'].includes(status)) {
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
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
