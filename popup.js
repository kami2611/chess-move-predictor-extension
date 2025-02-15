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
