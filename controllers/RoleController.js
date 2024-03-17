// Importing the RoleModel using ES module syntax
import roleModel from "../models/RoleModel.js";

// Exporting the functions as named exports
export const getAllRoles = async (req, res) => {
  try {
    // Using await with find() to get all roles
    let data = await roleModel.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const postRole = async (req, res) => {
  try {
    let data = roleModel(req.body);
    let result = await data.save();
    res.status(201).json({ msg: "Role created successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};