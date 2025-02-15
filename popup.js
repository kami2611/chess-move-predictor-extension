document.addEventListener("DOMContentLoaded", () => {
    // Fetch the opponent's name initially when the popup opens
    chrome.storage.local.get("opponentName", function(result) {
        if (result.opponentName) {  
            document.getElementById('opponent_name').innerText = result.opponentName;
        }
    });

    // Listen for changes in storage and update UI dynamically
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local" && changes.opponentName) {
            document.getElementById('opponent_name').innerText =changes.opponentName.newValue;
            console.log("Opponent name updated dynamically:", changes.opponentName.newValue);
        }
    });
});


document.getElementById('moveForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const move = document.getElementById('yourMove').value;
    try {
        const response = await fetch('http://localhost:3000/sendMove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ yourMove: move })
        });
        const data = await response.json();
        console.log('Server Response:', data);
    } catch (error) {
        console.error('Error sending move:', error);
    }
});
