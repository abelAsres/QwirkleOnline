const colors = ['Yellow', 'Blue', 'Red', 'Orange', 'Purple', 'Green'];
const shapes = ['Circle', 'Cross', 'Diamond', 'Square', 'Star', 'Triangle'];

const Grid = require("./grid");

class Qwirkle {
    constructor(userName) {
        this.players = [];
        this.board = []; //= [[],[]]
        this.deck = [];
        this.start = false;
        this.fistTilePlayed = false;
        this.players.push(userName);
        this.width = 31;
        this.neighbourHelper = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        this.tileQ = [];
        this.turnScore = 0;
        this.turnAxis;
    }

    startGame() {
        // Create a new gameboard
        for (let i = 0; i < this.width; i++) {
            this.board.push(new Array);
            for (let j = 0; j < this.width; j++) {
                this.board[i].push(-1);
            }
        }

        // Create new deck
        for (let i = 0; i < 56; i++) {
            if (i % 10 < 6) {
                this.deck.push(i);
                this.deck.push(i);
                this.deck.push(i);
            }
        }
        //console.log("Deck has " + this.deck.length + " tiles.");
        this.start = true;
        this.turn = 0;
        //console.log(this.board);
    }

    endTurn() {
        console.log("End Turn: Score Calculation & Change Player Turn");

        if(this.tileQ.length >0)
            this.endTurnScore();
    
        this.tileQ = [];
        this.turnScore = 0;
        
        if (this.turn + 1 < this.players.length) { this.turn++; console.log(`It is ${this.players[this.turn]}'s turn'`); }
        else { this.turn = 0; console.log(`It is ${this.players[this.turn]}'s turn'`); };
    }

    dealTile() {
        let i = Math.floor(Math.random() * this.deck.length);
        let ret = this.deck[i];
        //console.log("Dealt index: " + i + ", holding value: " + this.deck[i]);
        this.deck.splice(i, 1);

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
            let score = 0;
            console.log(this.tileQ.length);

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
            console.log(`neighbourHelper: ${neighbourHelper}, neighbour ${neighbour}`);
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
            for (let i = 0; i < neighbour.length; i++) {
                let nX = x + neighbourHelper[i][0];
                let nY = y + neighbourHelper[i][1];
                let exit = false;

                for (let j = 0; j < 6 && !exit; j++) {
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) {
                        //console.log("0: ???? - Border Case. !!! Playing Tile");
                        exit = true;
                    }
                    //console.log(`Tile ${tile} at ${nX}, ${nY}`);
                    if (this.board[nX][nY] == tile) {
                        //console.log("1: False - Same tile exists");
                        return false;
                    }
                    else if (this.board[nX][nY] % 10 == tile % 10) {
                        //console.log("1: Continue - Same Shape");
                    }
                    else if (Math.floor(this.board[nX][nY] / 10) == Math.floor(tile / 10)) {
                        //console.log("2: Continue - Same Color");
                    }
                    else if (this.board[nX][nY] == -1) {
                        //console.log("3: Exit - Empty Spot");
                        exit = true;
                    }
                    else {
                        //console.log("4: False - No matching color/shape or empty spot");
                        return false;
                    }
                    nX += neighbourHelper[i][0];
                    nY += neighbourHelper[i][1];
                }
            }

            this.tileQ.push({tile, x, y});
            this.board[x][y] = tile;
            //this.printBoard();
            return true;
        }
        console.log("6: ????");
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
        console.log(`*********** Turn AXIS IS ${this.turnAxis}`);
        if (this.tileQ.length == 1){
            this.scoreHelper();
        } else if (this.turnAxis == 'X'){
            this.scoreHelper1([[1, 0], [-1, 0]]);
            this.scoreHelper2([[0, 1], [0, -1]]);
        } else {
            this.scoreHelper1([[0, 1], [0, -1]]);
            this.scoreHelper2([[1, 0], [-1, 0]]);

            neighbourHelper = [[0, 1], [0, -1]];
        }
        console.log(`******* Total Turn Score is ${this.turnScore}`);
    }
    
    // Special Case for when only a single tile is played in a turn.
    scoreHelper(){
        console.log("Scoring for one tile");
        for (let i = 0; i < this.neighbourHelper.length; i++){
            let exit = false;
            let score = 0;
            let nX = this.tileQ[0].x + this.neighbourHelper[i][0];
            let nY = this.tileQ[0].y + this.neighbourHelper[i][1];

            for (let j = 0; j < 5 && !exit; j++){
                if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) {exit = true;}
                else if (this.board[nX][nY] != -1) score++;
                else if (this.board[nX][nY] == -1) exit = true;

                nX += this.neighbourHelper[i][0];
                nY += this.neighbourHelper[i][1];
            }
            this.turnScore += score;
        }
        this.turnScore++;
    }

    scoreHelper1(neighbourHelper){
        for (let h = 0; h < this.tileQ.length; h++){
            let scoreTrigger = false;

            for (let i = 0; i < neighbourHelper.length; i++){
                let exit = false;
                let nX = this.tileQ[h].x + neighbourHelper[i][0];
                let nY = this.tileQ[h].y + neighbourHelper[i][1];
                let score = 0;

                for (let j = 0; j < 5 && !exit; j++){
                    //console.log(`Check ${nX}, ${nY}. Tile is ${this.board[nX][nY]}`);
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) {exit = true;}
                    else if (this.board[nX][nY] != -1){
                        scoreTrigger = true;
                        score++;
                    } 
                    else if (this.board[nX][nY] == -1) exit = true;

                    nX += neighbourHelper[i][0];
                    nY += neighbourHelper[i][1];
                }
                this.turnScore += score;
                //console.log(`Tile ${this.tileQ[h].tile}. Total Turn Score is ${score}`);
            }
            if (scoreTrigger) this.turnScore++;
        }
    }

    scoreHelper2(neighbourHelper){
        let scoreTrigger = false;
        for (let i = 0; i < neighbourHelper.length; i++){
            let score = 0;
            let exit = false;
            let nX = this.tileQ[0].x + neighbourHelper[i][0];
            let nY = this.tileQ[0].y + neighbourHelper[i][1];

            for (let j = 0; j < 5 && !exit; j++){
                console.log(`Check ${nX}, ${nY}: ${this.board[nX][nY]}`);

                if (nX < 0 || nX > this.width || nY < 0 || nY > this.width) exit = true;
                else if (this.board[nX][nY] != -1) {
                    score++;
                    scoreTrigger = true;
                }
                else if (this.board[nX][nY] == -1) exit = true;

                nX += neighbourHelper[i][0];
                nY += neighbourHelper[i][1];
            }
            this.turnScore += score;
        }
        if (scoreTrigger) this.turnScore++;
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