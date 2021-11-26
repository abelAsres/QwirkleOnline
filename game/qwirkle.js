const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
const shapes = ['Circle','Cross','Diamond','Square','Star','Triangle'];

const Grid = require("./grid");

class Qwirkle {
    constructor(userName){
        this.players = [];
        this.board = []; //= [[],[]]
        this.deck = [];
        this.start = false;
        this.fistTilePlayed = false;
        this.players.push(userName);
        this.width = 9;
    }

    startGame(){
        // Create a new gameboard
        for (let i = 0; i < 10; i++){
            this.board.push(new Array);
            for (let j = 0; j < 10; j++){
                this.board[i].push(-1);
            }
        }

        // Create new deck
        for (let i = 0; i < 56; i++){
            if (i % 10 < 6){
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

    endTurn(){
        console.log("Switching Player Turn");
        if (this.turn + 1 < this.players.length){ this.turn++; console.log(`It is ${this.players[this.turn]}'s turn'`);}
        else {this.turn = 0; console.log(`It is ${this.players[this.turn]}'s turn'`);};
    }

    dealTile(){
        let i = Math.floor(Math.random() * this.deck.length);
        let ret = this.deck[i];
        //console.log("Dealt index: " + i + ", holding value: " + this.deck[i]);
        this.deck.splice(i, 1);
        
        return ret;
    }

    playFirstTile(tile, x, y){
        let ret = false; 

        if (x == 4 & y == 4){
            this.board[x][y] = tile;
            this.firstTilePlayed = true;
            ret = true;
        }
        return ret;
    }

    addPlayer(username){
        this.players.push(username);
    }

    printBoard(){
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

    playNormalTile(tile, x, y){
        console.log("Determining if Play is Valid");
        // If this space is empty find the non empty neighbours. 
        if (this.board[x][y] == -1) {
            let neighbour = [];
            let neighbourHelper = [[0,1], [1,0], [0,-1], [-1,0]];
            let neighbourHelper2 = [];
            let score = 0;

            for (let i = 0; i < 4; i++){
                let nX = x + neighbourHelper[i][0];
                let nY = y + neighbourHelper[i][1];

                if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width){
                    if (this.board[nX][nY] != -1){
                        neighbour.push([nX, nY]);
                        neighbourHelper2.push([neighbourHelper[i][0],neighbourHelper[i][1]]);
                    }
                }
            }
            //console.log(neighbour);
            
            if (neighbour.length == 0){
                return false; // Special case for no neighbours at all 
            }

            for (let i = 0; i < neighbour.length; i++){
                let nX = x + neighbourHelper2[i][0];
                let nY = y + neighbourHelper2[i][1];
                let exit = false;

                for (let j = 0; j < 6 && !exit; j++){
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width){
                        console.log("0: ???? - Border Case. !!! Playing Tile");
                        exit = true;
                    }
                    //console.log(`Tile ${tile} at ${nX}, ${nY}`);
                    if (this.board[nX][nY] == tile){
                        console.log("1: False - Same tile exists");
                        return false;
                    }
                    else if (this.board[nX][nY] % 10 == tile % 10){
                        score++;
                        console.log("1: Continue - Same Shape");
                    }
                    else if (Math.floor(this.board[nX][nY] / 10) == Math.floor(tile / 10)) {
                        score++;
                        console.log("2: Continue - Same Color");
                    }
                    else if (this.board[nX][nY] == -1){
                        console.log("3: Exit - Empty Spot");
                        exit = true;
                    }
                    else {
                        console.log("4: False - No matching color/shape or empty spot");
                        return false;
                    }
                    nX+= neighbourHelper2[i][0];
                    nY+= neighbourHelper2[i][1];
                }
            }

            console.log("5: Score of " + score + " !!! Playing Tile !!!");
            console.log("");
            this.board[x][y] = tile;
            this.printBoard();
            return true;
        }
        console.log("6: ????");
        return false;
    }
    
    playTile(tile, x, y){
        if (!this.firstTilePlayed){
            if (this.playFirstTile(tile, x, y)){
                this.firstTilePlayed = true;
                this.printBoard();
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

    checkAxis(tile, x, y){
        // If we run into the edge of board or an empty grid without seeing an invalid tile return true. 
        if (this.board[x][y] == -1){
            return true;
        }

    }

}


function dealTile(){

    return 0;
}

module.exports = Qwirkle;