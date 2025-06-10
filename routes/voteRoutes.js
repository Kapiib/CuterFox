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

module.exports = router;