const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Create
router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read All
// Updated Read All with search and pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 5 } = req.query;
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Item.countDocuments(query);

    res.json({
      items,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Read One
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
