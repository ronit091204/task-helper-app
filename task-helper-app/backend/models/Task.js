const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  status: { type: String, enum: ['pending', 'accepted', 'completed'], default: 'pending' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  helper: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

taskSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Task', taskSchema);
