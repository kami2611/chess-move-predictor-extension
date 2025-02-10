console.log('Content JS is running on this page!');

const observer = new MutationObserver(() => {
    const opponentNamediv = document.querySelector('.user-tagline-component');
    if (opponentNamediv) {
        const opponentsName = opponentNamediv.querySelector("a");
        if (opponentsName && opponentsName.innerText.trim() !== 'Opponent' && opponentsName.innerText.trim() !== 'kami2611') {
            const name = opponentsName.innerText.trim();
            console.log("Opponent's Name:", name);
            
            // ✅ Send data to your MERN server
            fetch('http://localhost:3000/api/opponent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ opponentName: name })
            })
            .then(response => response.json())
            .then(data => console.log('Server Response:', data))
            .catch(error => console.error('Error sending opponent name:', error));

            observer.disconnect(); // Stop observing once the name is found
        }
    }
});
// Observe changes in the body (or a more specific parent container)
observer.observe(document.body, { childList: true, subtree: true });
