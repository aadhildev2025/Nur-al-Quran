const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookmarks', require('./routes/bookmarks'));

app.get('/', (req, res) => {
    res.json({
        message: 'Nur al-Quran API is running...',
        status: 'healthy',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Database Connection
if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined in .env file');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qurandb')
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        // If DB connection fails, we still start the server for other routes (optional)
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (without MongoDB)`);
        });
    });
