import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash:{ type: String },

  // OAuth support
  googleId:    { type: String },
  profilePic:  { type: String },

  role:        { type: String, enum: ['student', 'admin', 'boss'], required: true },
  approved:    { type: Boolean, default: function () { return this.role === 'student'; } },

  // Student fields
  branch:      { type: String, trim: true },
  yearOfJoin:  { type: Number, min: 1900, max: 2100 },
  yearOfStudy: { type: Number, min: 1, max: 10 },
  phone:       { type: String, trim: true },

  // Club admin fields
  clubName:    { type: String, trim: true },
  category:    { type: String, trim: true },
  contacts: {
    president: { type: String, trim: true, default: '' },
    vice:      { type: String, trim: true, default: '' }
  },

  // Gamification
  badges:      { type: [String], default: [] },
  points:      { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
