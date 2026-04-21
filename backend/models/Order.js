const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      produce: { type: mongoose.Schema.Types.ObjectId, ref: 'Produce', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['packed', 'ready', 'shipped', 'delivered', 'cancelled'], default: 'packed' },
  orderType: { type: String, enum: ['pre-order', 'immediate'], default: 'immediate' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  deliveryDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
