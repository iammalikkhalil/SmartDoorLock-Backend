// Importing the FingerprintModel using ES module syntax
import fingerprintModel from "../models/FingerprintModel.js";

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
  try {
    let data = fingerprintModel(req.body);
    let result = await data.save();
    res.status(201).json({ msg: "Fingerprint added successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};