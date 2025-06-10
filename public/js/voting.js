document.addEventListener('DOMContentLoaded', function() {
    const voteButtons = document.querySelectorAll('.vote-button');
    const feedbackElement = document.getElementById('feedback');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Disable all buttons to prevent multiple votes
            voteButtons.forEach(btn => btn.disabled = true);
            
            const imageUrl = this.getAttribute('data-image');
            
            try {
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
});