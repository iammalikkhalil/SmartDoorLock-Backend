import requestModel from "../models/RequestModel.js";
import fingerprintModel from "../models/FingerprintModel.js";

// Function to update status to 'timeout' after 5 minutes
const updateStatusToTimeout = async (requestId) => {
  const request = await requestModel.findById(requestId);
  if (request && request.status === 'pending') {
    request.status = 'timeout';
    await request.save();
    console.log(`Request ${requestId} status updated to 'timeout' after 5 minutes.`);
  }
};

// Exporting the functions as named exports
export const getAllRequests = async (req, res) => {
  try {
    // Using await with find() to get all requests
    let data = await requestModel.find();
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const postRequest = async (req, res) => {
  try {
    let data = requestModel(req.body);
    let result = await data.save();

    // Schedule the job to update status to 'timeout' after 5 minutes
    setTimeout(() => updateStatusToTimeout(result._id), 5 * 60 * 1000);

    res.status(201).json({ msg: "Request created successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status, _id } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updatedRequest = await requestModel.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request status updated successfully', user: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const postRequestById = async (id) => {
  const fingerprint = await fingerprintModel.findOne({ fingerprintId: id })
    .populate({
      path: 'user', populate: { path: 'role' },
    });

  let data = requestModel({ user: fingerprint.user._id });
  let result = await data.save();

  //populating the user object
  result.user = fingerprint.user;

  // Schedule the job to update status to 'timeout' after 5 minutes
  setTimeout(() => updateStatusToTimeout(result._id), 5 * 60 * 1000);

  return data;
};

export const updateRequestById = async (_id, admin, status) => {
  console.log(_id, admin, status);
  try {
    // const foundRequest = await Request.findById(_id);
    // console.log(foundRequest);
    let request = await requestModel.findByIdAndUpdate(
      _id,
      { status, admin },
      { new: true }
    );
    console.log(request);
  } catch (error) {
    console.log("error in updating request", error);
  }
};