const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    lastRead: {
        surahId: Number,
        ayahNumber: Number,
        timestamp: { type: Date, default: Date.now }
    },
    bookmarks: [
        {
            surahId: { type: Number, required: true },
            ayahNumber: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
