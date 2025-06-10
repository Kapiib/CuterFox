const express = require('express');
const router = express.Router();

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
        });
    } catch (error) {
        console.error('Error fetching fox images:', error);
        res.status(500).render('index', { 
            title: 'Feil',
            error: 'Kunne ikke hente revebilder. Vennligst prøv igjen.'
        });
    }
});

module.exports = router;