const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Fetch two random fox images using native fetch
        const [fox1Response, fox2Response] = await Promise.all([
            fetch('https://randomfox.ca/floof/'),
            fetch('https://randomfox.ca/floof/')
        ]);

        const fox1Data = await fox1Response.json();
        const fox2Data = await fox2Response.json();

        const fox1 = fox1Data.image;
        const fox2 = fox2Data.image;
        
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