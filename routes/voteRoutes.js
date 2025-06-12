const express = require('express');
const router = express.Router();
const FoxVote = require('../models/foxVote');
const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const voteRateLimiter = rateLimit({
    windowMs: 10 * 1000,  // 10 seconds window
    max: 3, // limit each IP to 3 votes in 10 seconds
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
        success: false, 
        message: 'For mange avstemninger. Vennligst vent litt før du stemmer igjen.' 
    },
    skipSuccessfulRequests: false
});

/**
 * POST route to register a vote for a fox image
 * Accepts imageUrl in the request body
 * Creates a new record if the image hasn't been voted on before
 * Otherwise increments the existing vote count
 */
router.post('/', voteRateLimiter, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        // Validate that imageUrl is provided
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Manglende bilde-URL' });
        }

        // Find if this image already has votes
        let foxVote = await FoxVote.findOne({ imageUrl });
        
        if (foxVote) {
            // Increment vote count for existing image
            foxVote.votes += 1;
            await foxVote.save();
        } else {
            // Create new entry for this image
            foxVote = new FoxVote({
                imageUrl,
                votes: 1
            });
            await foxVote.save();
        }

        return res.json({ success: true, message: 'Stemme registrert!' });
    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ success: false, message: 'Kunne ikke registrere stemme' });
    }
});

/**
 * GET route to retrieve vote statistics
 * Returns the top 5 most voted foxes and the current leader
 */
router.get('/stats', async (req, res) => {
    try {
        // Get top 5 foxes sorted by vote count
        const topFoxes = await FoxVote.find()
            .sort({ votes: -1 })
            .limit(5);
        
        // Determine the current leader (fox with most votes)
        const leader = topFoxes.length > 0 ? topFoxes[0] : null;
        
        return res.json({
            success: true,
            topFoxes,
            leader
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Kunne ikke hente statistikk' 
        });
    }
});

module.exports = router;