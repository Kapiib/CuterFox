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

// Leaderboard page
router.get('/leaderboard', async (req, res) => {
    try {
        // Set up pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Get total count for pagination
        const totalFoxes = await FoxVote.countDocuments();
        
        // Get foxes with pagination
        const foxes = await FoxVote.find()
            .sort({ votes: -1 })
            .skip(skip)
            .limit(limit);
        
        const totalPages = Math.ceil(totalFoxes / limit);
        
        res.render('leaderboard', {
            title: 'Rev Rangering',
            foxes,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            limit
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).render('leaderboard', {
            title: 'Feil',
            error: 'Kunne ikke hente rangeringen. Vennligst prøv igjen.'
        });
    }
});

module.exports = router;