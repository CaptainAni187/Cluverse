import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email:    { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt:{ type: Number, required: true }, // UNIX ms timestamp
  createdAt:{ type: Date, default: Date.now }
});

export default mongoose.model('Otp', otpSchema);
