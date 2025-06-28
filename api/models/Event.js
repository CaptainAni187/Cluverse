import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dateTime: { type: Date, required: true },
  venue: String,
  location: String,
  price: { type: Number, default: 0 },
  capacity: Number,
  imageUrl: String,
  tags: [String], // e.g. ['workshop', 'tech']
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'changes_requested'],
    default: 'pending_approval'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // alias for clarity

  // Additional fields for event request and approval workflow
  mode: { type: String, enum: ['online', 'offline'], default: 'online' },
  roomNeeded: { type: Boolean, default: false },
  roomType: {
    type: String,
    enum: [
      'Auditorium (MV Seminar Hall)',
      'Auditorium (KF Center Hall)',
      'AB3 Labs',
      'AB4 Labs',
      'AB5 Classrooms',
      ''
    ],
    default: ''
  },
  participants: { type: Number, default: 0 },
  fundingNeeded: { type: Boolean, default: false },
  fundingAmount: { type: Number, default: 0 },
  mentorApproved: { type: Boolean, default: false },
  subEvents: { type: Number, default: 0 },
  contactName: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  teamStrength: { type: String, default: '' },
  feedback: { type: String, default: '' }, // feedback from CWO on rejection or changes
}, { timestamps: true });

// Virtual for computed status based on dateTime
eventSchema.virtual('computedStatus').get(function() {
  const now = new Date();
  if (this.dateTime > now) return 'upcoming';
  if (this.dateTime <= now && (!this.capacity || this.capacity > 0)) return 'live';
  return 'past';
});

export default mongoose.model('Event', eventSchema);
