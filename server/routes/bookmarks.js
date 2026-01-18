const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all bookmarks
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle bookmark
router.post('/toggle', auth, async (req, res) => {
    try {
        const { surahId, ayahNumber } = req.body;
        const user = await User.findById(req.user.userId);

        const bookmarkIndex = user.bookmarks.findIndex(
            b => b.surahId === surahId && b.ayahNumber === ayahNumber
        );

        if (bookmarkIndex > -1) {
            // Remove it
            user.bookmarks.splice(bookmarkIndex, 1);
        } else {
            // Add it
            user.bookmarks.push({ surahId, ayahNumber });
        }

        await user.save();
        res.json(user.bookmarks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
