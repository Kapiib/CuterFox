const express = require('express');
const router = express.Router();
const FoxVote = require('../models/foxVote');

router.post('/', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Manglende bilde-URL' });
        }

        // Find and update or create new document
        let foxVote = await FoxVote.findOne({ imageUrl });
        
        if (foxVote) {
            foxVote.votes += 1;
            await foxVote.save();
        } else {
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

// Add this new route to get statistics
router.get('/stats', async (req, res) => {
    try {
        // Get top 5 foxes
        const topFoxes = await FoxVote.find()
            .sort({ votes: -1 })
            .limit(5);
        
        // Get the fox with most votes (leader)
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