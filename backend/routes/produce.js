const express = require('express');
const router = express.Router();
const Produce = require('../models/Produce');
const auth = require('../middleware/auth');

// Create Listing (Farmer Only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Forbidden: Only farmers can list produce' });
  }

  try {
    const produce = new Produce({ ...req.body, farmer: req.user.id });
    await produce.save();
    res.status(201).json(produce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Listings (Local/Hyperlocal)
router.get('/', async (req, res) => {
  try {
    const { category, longitude, latitude, radius = 50 } = req.query; // radius in km
    const query = {};
    if (category) query.category = category;

    // Geo filtering if coordinates are provided
    if (longitude && latitude) {
      query.location = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const produce = await Produce.find(query).populate('farmer', 'name');
    res.json(produce);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Listing
router.patch('/:id', auth, async (req, res) => {
  try {
    const produce = await Produce.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      req.body,
      { new: true }
    );
    if (!produce) return res.status(404).json({ message: 'Produce not found' });
    res.json(produce);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Listing (Farmer Only — own listings)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Forbidden: Only farmers can delete listings' });
  }
  try {
    const produce = await Produce.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
    if (!produce) return res.status(404).json({ message: 'Produce not found or not yours' });
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
