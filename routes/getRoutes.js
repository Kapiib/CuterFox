const express = require('express');
const router = express.Router();
const FoxVote = require('../models/foxVote');

// Main page showing fox voting
router.get('/', async (req, res) => {
    try {
        // Fetch two random fox images that aren't identical
        let fox1, fox2;
        let attempts = 0;
        const maxAttempts = 5;
        
        do {
            // Fetch first random fox
            const fox1Response = await fetch('https://randomfox.ca/floof/');
            const fox1Data = await fox1Response.json();
            fox1 = fox1Data.image;
            
            // Fetch second random fox
            const fox2Response = await fetch('https://randomfox.ca/floof/');
            const fox2Data = await fox2Response.json();
            fox2 = fox2Data.image;
            
            attempts++;
        } while (fox1 === fox2 && attempts < maxAttempts);
        
        res.render('index', { 
            title: 'Søteste Reven',
            fox1,
            fox2,
            activePage: 'home'
        });
    } catch (error) {
        console.error('Error fetching fox images:', error);
        res.status(500).render('index', { 
            title: 'Feil',
            error: 'Kunne ikke hente revebilder. Vennligst prøv igjen.'
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
            limit,
            activePage: 'leaderboard'
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).render('leaderboard', {
            title: 'Feil',
            error: 'Kunne ikke hente rangeringen. Vennligst prøv igjen.'
        });
    }
});

// User guide page
router.get('/guide', (req, res) => {
    res.render('guide', { 
        title: 'Brukerveiledning - Rev Avstemning',
        activePage: 'guide'
    });
});

module.exports = router;