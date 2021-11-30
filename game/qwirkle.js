const colors = ['Yellow', 'Blue', 'Red', 'Orange', 'Purple', 'Green'];
const shapes = ['Circle', 'Cross', 'Diamond', 'Square', 'Star', 'Triangle'];

const Grid = require("./grid");

class Qwirkle {
    constructor(userName) {
        this.players = [];
        this.score = [];
        this.endGameArray = [];
        this.board = []; //= [[],[]]
        this.deck = [];
        this.deckEmpty = false;
        this.start = false;
        this.fistTilePlayed = false;
        this.players.push(userName);
        this.width = 31;
        this.neighbourHelper = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        this.tileQ = [];
        this.turnScore = 0;
        this.turnAxis;
        this.endgameReset = -1;
    }

    noMorePlaySignal(){
        //console.log("NPM CALLED");
        if (this.endGameReset == this.turn){
            for (let i = 0; i < this.endGameArray.length; i++){
                this.endGameArray[this.turn] = false;
            }
            this.endGameReset = -1;
        }

        this.endGameArray[this.turn] = true;
        this.endGameReset = this.turn;
    }

    endGameCheck(handEmpty){
        // If one player has an empty hand and no more tiles are available. 
        if (this.deckEmpty && handEmpty) return true;
        if (this.deckLength == 0) this.deckEmpty = true;

        //console.log("End Game Check PT 2");
        // If all players select no more play. 
        for (let i = 0; i < this.endGameArray.length; i++){
            if (!this.endGameArray[i]) return false;
        }
        //console.log("End Game Condition Met");
        return true;
    }

    startGame() {
        // Create a new gameboard
        for (let i = 0; i < this.width; i++) {
            this.board.push(new Array);
            for (let j = 0; j < this.width; j++) 
                this.board[i].push(-1);
        }
        // Create new deck
        for (let i = 0; i < 56; i++) {
            if (i % 10 < 6) {
                this.deck.push(i);
                this.deck.push(i);
                this.deck.push(i);
            }
        }
        for (let i = 0; i < this.players.length; i++){
            this.score[i] = 0;
            this.endGameArray[i] = false;
        }
        this.start = true;
        this.turn = 0;
    }

    endTurn() {
        if (this.tileQ.length > 0)
            this.endTurnScore();

        this.score[this.turn] += this.turnScore;
        let ret = this.score[this.turn];
        this.tileQ = [];
        this.turnScore = 0;
        
        if (this.turn + 1 < this.players.length) this.turn++;
        else this.turn = 0;

        return ret;
    }

    dealTile() {
        let ret = -1;
        if (this.deck.length > 0){
            let i = Math.floor(Math.random() * this.deck.length);
            ret = this.deck[i];

            this.deck.splice(i, 1);

        } 
        return ret;
    }

    playFirstTile(tile, x, y) {
        let ret = false;

        if (x == 15 & y == 15 && this.board[x][y] == -1){
            console.log("Push Tile Q");
            this.tileQ.push({tile, x, y});
            this.board[x][y] = tile;
            this.firstTilePlayed = true;
            ret = true;
        }
        return ret;
    }

    addPlayer(username) {
        this.players.push(username);
    }

    printBoard() {
        var s0 = this.board[0].join(' ');
        var s1 = this.board[1].join(' ');
        var s2 = this.board[2].join(' ');
        var s3 = this.board[3].join(' ');
        var s4 = this.board[4].join(' ');
        var s5 = this.board[5].join(' ');
        var s6 = this.board[6].join(' ');
        var s7 = this.board[7].join(' ');
        var s8 = this.board[8].join(' ');
        var s9 = this.board[9].join(' ');

        console.log(s0);
        console.log(s1);
        console.log(s2);
        console.log(s3);
        console.log(s4);
        console.log(s5);
        console.log(s6);
        console.log(s7);
        console.log(s8);
        console.log(s9);
    }

    playNormalTile(tile, x, y) {
        console.log("Determining if Play is Valid");
        // If this space is empty find the non empty neighbours. 
        if (this.board[x][y] == -1) {
            let neighbourHelper = [];
            let neighbour = [];
            let connection = (this.tileQ.length > 0)? false : true;

            // Get Neighbour tiles that are not empty
            for (let i = 0; i < 4; i++) {
                let nX = x + this.neighbourHelper[i][0];
                let nY = y + this.neighbourHelper[i][1];

                if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width) {
                    if (this.board[nX][nY] != -1) {
                        neighbour.push([nX, nY]);
                        neighbourHelper.push([this.neighbourHelper[i][0], this.neighbourHelper[i][1]]);
                    }
                }
            }

            // If there are no neighbours play is invalid
            if (neighbour.length == 0) {
                return false; // Special case for no neighbours at all 
            }
            // Check that all tiles played are along same X or Y axis
            for (let i = 0; i < neighbour.length; i++) {
                for (let j = 0; j < this.tileQ.length; j++) {
                    if (this.tileQ.length == 1){
                        if (this.tileQ[j].x == x) this.turnAxis = 'X';
                        else this.turnAxis = 'Y';
                    }
                    if (this.tileQ[j].x != x && this.turnAxis == 'X'){
                        return false;
                    }
                    else if (this.tileQ[j].y != y && this.turnAxis == 'Y'){
                        return false;
                    }
                }
            }
            // Check that there are no invalid plays along X and Y axis. 
            for (let i = 0; i < neighbour.length; i++) {
                let nX = x + neighbourHelper[i][0];
                let nY = y + neighbourHelper[i][1];
                let exit = false;
                // Check up to the next 6 tiles in the row/column for an invalid tile: Check: out of bounds -> same tile -> same color/shape -> else false
                for (let j = 0; j < 5 && !exit; j++) {
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) exit = true;
                    if (this.board[nX][nY] == tile) return false;
                    else if (this.board[nX][nY] % 10 == tile % 10);
                    else if (Math.floor(this.board[nX][nY] / 10) == Math.floor(tile / 10));
                    else if (this.board[nX][nY] == -1) exit = true;
                    else return false;
                    
                    // Check that tile is connected to another tile played this turn.
                    for (let k = 0; k < this.tileQ.length; k++){
                        if (this.tileQ[k].x == nX && this.tileQ[k].y == nY) connection = true;
                    }

                    nX += neighbourHelper[i][0];
                    nY += neighbourHelper[i][1];
                }
            }
            // If tile isn't connected return false.
            if (!connection) return false;

            this.tileQ.push({tile, x, y});
            this.board[x][y] = tile;
            return true;
        }
        // Attempting to play on non-empty space
        return false;
    }

    playTile(tile, x, y) {
        if (!this.firstTilePlayed) {
            if (this.playFirstTile(tile, x, y)) {
                this.firstTilePlayed = true;
                //this.printBoard();
                return true;
            }
            else return false;
        }
        // Location must be empty. Must be next to a tile. Must meet adjacency requirements. 
        // Check if empty
        else {
            return this.playNormalTile(tile, x, y);
        }
    }

    endTurnScore(){
        let neighbourHelper;
        if (this.tileQ.length == 1){
            this.scoreHelper2([[0, 1], [0, -1]]);
            this.scoreHelper2([[1, 0], [-1, 0]]);
            if (this.turnScore == 0) this.turnScore = 1;
        } else if (this.turnAxis == 'X'){
            this.scoreHelper1([[1, 0], [-1, 0]]);
            this.scoreHelper2([[0, 1], [0, -1]]);
        } else {
            this.scoreHelper1([[0, 1], [0, -1]]);
            this.scoreHelper2([[1, 0], [-1, 0]]);

            neighbourHelper = [[0, 1], [0, -1]];
        }
        console.log(`*********** Total Turn Score is ${this.turnScore}`);
    }

    scoreHelper1(neighbourHelper){
        for (let h = 0; h < this.tileQ.length; h++){
            let score = 0;

            for (let i = 0; i < neighbourHelper.length; i++){
                let exit = false;
                let nX = this.tileQ[h].x + neighbourHelper[i][0];
                let nY = this.tileQ[h].y + neighbourHelper[i][1];

                for (let j = 0; j < 5 && !exit; j++){
                    //console.log(`Check ${nX}, ${nY}. Tile is ${this.board[nX][nY]}`);
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) {exit = true;}
                    else if (this.board[nX][nY] != -1){
                        score++;
                    } 
                    else if (this.board[nX][nY] == -1) exit = true;

                    nX += neighbourHelper[i][0];
                    nY += neighbourHelper[i][1];
                }
                //console.log(`Tile ${this.tileQ[h].tile}. Total Turn Score is ${score}`);
            }
            if (score > 0) score++;
            if (score == 6) score = 12;
            this.turnScore += score;
        }
    }

    scoreHelper2(neighbourHelper){
        let score = 0;
        for (let i = 0; i < neighbourHelper.length; i++){
            let exit = false;
            let nX = this.tileQ[0].x + neighbourHelper[i][0];
            let nY = this.tileQ[0].y + neighbourHelper[i][1];

            for (let j = 0; j < 5 && !exit; j++){
                console.log(`Check ${nX}, ${nY}: ${this.board[nX][nY]}`);

                if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) exit = true;
                else if (this.board[nX][nY] != -1) {
                    score++;
                }
                else if (this.board[nX][nY] == -1) exit = true;

                nX += neighbourHelper[i][0];
                nY += neighbourHelper[i][1];
            }
        }
        if (score > 0) score++;
        if (score == 6) score = 12;
        this.turnScore += score;
    }

    endTurnPlayTile() {

    }

    checkAxis(tile, x, y) {
        // If we run into the edge of board or an empty grid without seeing an invalid tile return true. 
        if (this.board[x][y] == -1) {
            return true;
        }

    }

}


function dealTile() {

    return 0;
}

module.exports = Qwirkle;