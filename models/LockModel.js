import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('lock', schema);