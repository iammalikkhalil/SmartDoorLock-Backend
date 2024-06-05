// Importing the FingerprintModel using ES module syntax
import mongoose from "mongoose";
import fingerprintModel from "../models/FingerprintModel.js";
import UserModel from "../models/UserModel.js";

// Exporting the functions as named exports
export const getAllFingerprints = async (req, res) => {
  try {
    let data = await fingerprintModel.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


export const postFingerprint = async (req, res) => {
  console.log("body: ", req.body);
  try {
    const { username, fingerprintId } = req.body;

    console.log(username, fingerprintId);
    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new fingerprint entry linked to the user
    const newFingerprint = new fingerprintModel({
      user: user._id,
      fingerprintId,
    });

    // Save the new fingerprint entry to the database
    const result = await newFingerprint.save();

    res.status(200).json({ message: "Fingerprint added successfully", data: result });
  } catch (error) {
    console.error(error);

    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ error: "Duplicate fingerprintId. This fingerprintId is already in use." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

