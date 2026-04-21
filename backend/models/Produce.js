const mongoose = require('mongoose');

const produceSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Vegetables', 'Fruits', 'Grains', 'Others'], required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, enum: ['kg', 'g', 'dozen', 'piece'], default: 'kg' },
  harvestDate: { type: Date, required: true },
  status: { type: String, enum: ['available', 'sold out', 'pre-order'], default: 'available' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produce', produceSchema);
