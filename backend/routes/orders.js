const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Produce = require('../models/Produce');
const auth = require('../middleware/auth');

// Create Pre-Order
router.post('/', auth, async (req, res) => {
  try {
    const { items, farmer, totalPrice, orderType } = req.body;

    for (const item of items) {
      const produce = await Produce.findById(item.produce);
      if (!produce) return res.status(404).json({ message: 'Produce not found' });
      if (produce.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${produce.name}` });
      }
      produce.quantity -= item.quantity;
      await produce.save();
    }

    const order = new Order({ consumer: req.user.id, farmer, items, totalPrice, orderType });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Orders (for consumer or farmer)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'farmer'
      ? { farmer: req.user.id }
      : { consumer: req.user.id };

    const orders = await Order.find(query)
      .populate('consumer', 'name email')
      .populate('farmer', 'name')
      .populate('items.produce', 'name category unit price')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Order Status (Farmer Only)
router.patch('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Only farmers can update order status' });
  }
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      { status: req.body.status },
      { new: true }
    ).populate('items.produce', 'name category unit');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
