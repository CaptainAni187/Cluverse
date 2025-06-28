import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event:    { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: String,
  members:  [{ name: String, collegeId: String }],
  qr:       String,
  checkedIn:{ type: Boolean, default: false },
  status:   { type: String, enum: ['registered', 'checked-in', 'cancelled'], default: 'registered' }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
