import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in-progress', 'completed'],
    default: 'pending'
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

taskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Task', taskSchema);
