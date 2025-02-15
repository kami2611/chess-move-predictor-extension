const express = require('express');
const pgnParser = require('pgn-parser');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/chessLikelyMoveExtensionDb').then(() => {
    console.log("Mongoose Server Started!");
}).catch((err) => {
    console.log("Err mongoose!");
});
let everyGameFirstTwoMoves = []; // Global storage
function getBlacksMostPlayedMoveAgainst(data, move) {
    let moveCounts = {};

    data.forEach(game => {
        if (game.firstMoveWhite === move) {
            moveCounts[game.firstMoveBlack] = (moveCounts[game.firstMoveBlack] || 0) + 1;
        }
    });

    let mostPlayedMove = null;
    let maxCount = 0;

    for (let move in moveCounts) {
        if (moveCounts[move] > maxCount) {
            mostPlayedMove = move;
            maxCount = moveCounts[move];
        }
    }

    return { move: mostPlayedMove, count: maxCount };
}


const app  = express();
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
let latestOpponentName = "";
app.get('/home', (req, res)=>{
    res.send('hello');
});

app.post('/api/opponent', async(req, res) => {
    const { opponentName } = req.body;
    if (!opponentName) {
        return res.status(400).json({ error: 'No opponent name provided' });
    }
    latestOpponentName = opponentName;
    console.log('Received Opponent Name:', latestOpponentName);
    try {
        // Fetch player information from Chess.com API
        const response = await fetch(`https://api.chess.com/pub/player/${latestOpponentName}/games/live/900/10`) ;
        if (!response.ok) {
            return res.status(response.status).json({ error: 'Error fetching player data from Chess.com' });
        }
        const playerData = await response.json();
        console.log('........................player data.................');
        console.log('Player Data:', playerData);
        const filteredGames = playerData.games.filter(game =>game.time_control=== "900+10" && game.black.username.toLowerCase() === latestOpponentName.toLowerCase());
        // const top100Games = filteredGames.slice(-100);
        console.log('..............................Filtered games.........................');

        console.log(filteredGames);
        everyGameFirstTwoMoves = [];
        filteredGames.forEach(eachGame => {
            const [resultofpgnparse] = pgnParser.parse(eachGame.pgn);
            let eachGameFirstTwoMoves = {
                firstMoveWhite: resultofpgnparse.moves[0].move,
                firstMoveBlack: resultofpgnparse.moves[1].move
            };
            everyGameFirstTwoMoves.push(eachGameFirstTwoMoves);
        });
        console.log('......................every game moves.......................');
        console.log(everyGameFirstTwoMoves);
        res.json({ success: true, filteredGames });
        // Send the player data back in the response
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
app.post('/sendMove', (req, res)=>{
    const {yourMove} = req.body;
    console.log(yourMove);
    console.log(getBlacksMostPlayedMoveAgainst(everyGameFirstTwoMoves, yourMove));
    res.json({ success: true, message: 'Move received' });
});
app.listen(3000, ()=>{
    console.log("ON PORT 3000!");
})