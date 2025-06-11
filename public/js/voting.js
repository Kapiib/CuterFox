document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements we'll need to interact with
    const voteButtons = document.querySelectorAll('.vote-button');
    const feedbackElement = document.getElementById('feedback');
    const statisticsElement = document.getElementById('statistics');
    const topFoxesContainer = document.getElementById('top-foxes');
    const toastElement = document.getElementById('toast');
    
    /**
     * Display a temporary toast notification to the user
     * @param {string} message - The message to display
     * @param {number} duration - How long to show the message in milliseconds
     */
    function showToast(message, duration = 5000) {
        toastElement.textContent = message;
        toastElement.classList.add('show');
        
        setTimeout(function() {
            toastElement.classList.remove('show');
        }, duration);
    }
    
    /**
     * Fetch and display statistics about the most popular foxes
     * Updates the UI with the top 5 foxes and shows which fox is in the lead
     */
    async function updateStatistics() {
        try {
            const response = await fetch('/api/vote/stats');
            const data = await response.json();
            
            if (data.success && data.topFoxes.length > 0) {
                // Show statistics section
                statisticsElement.style.display = 'block';
                
                // Clear previous foxes
                topFoxesContainer.innerHTML = '';
                
                // Add top foxes to the container
                data.topFoxes.forEach((fox, index) => {
                    const foxElement = document.createElement('div');
                    foxElement.className = 'top-fox';
                    
                    foxElement.innerHTML = `
                        <img src="${fox.imageUrl}" alt="Rev ${index + 1}">
                        <div class="votes">${fox.votes} stemmer</div>
                    `;
                    
                    topFoxesContainer.appendChild(foxElement);
                });
                
                // Show toast about the leader
                if (data.leader) {
                    const leaderImageUrl = data.leader.imageUrl;
                    const leaderVotes = data.leader.votes;
                    // Extract fox number from image URL (e.g. "57" from ".../images/57.jpg")
                    const foxNumber = leaderImageUrl.match(/\/images\/(\d+)\.jpg/);
                    const foxId = foxNumber ? foxNumber[1] : 'Ukjent';
                    
                    showToast(`Rev ${foxId} er søtest akkurat nå med ${leaderVotes} stemmer!`);
                }
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }
    
    // Set up click handlers for vote buttons
    voteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Disable all buttons to prevent multiple votes
            voteButtons.forEach(btn => btn.disabled = true);
            
            const imageUrl = this.getAttribute('data-image');
            
            try {
                // Send the vote to the server
                const response = await fetch('/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ imageUrl })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show feedback message
                    feedbackElement.style.display = 'block';
                    
                    // Update statistics immediately after voting
                    await updateStatistics();
                    
                    // Scroll to feedback
                    feedbackElement.scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert('Det oppstod en feil. Prøv igjen senere.');
                    // Re-enable buttons on error
                    voteButtons.forEach(btn => btn.disabled = false);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Det oppstod en feil. Prøv igjen senere.');
                // Re-enable buttons on error
                voteButtons.forEach(btn => btn.disabled = false);
            }
        });
    });
    
    // Fetch statistics on page load - only once
    updateStatistics();
});