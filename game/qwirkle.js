const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
const shapes = ['Circle','Cross','Diamond','Square','Star','Triangle'];

const Grid = require("./grid");

class Qwirkle {
    constructor(userName){
        this.players = [];
        this.board = []; //= [[],[]]
        this.deck = [];
        this.start = false;
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
        console.log("Deck has " + this.deck.length + " tiles.");
        this.start = true;
        this.turn = this.players[0];
    }

    dealTile(){
        let i = Math.floor(Math.random() * this.deck.length);
        let ret = this.deck[i];
        console.log("Dealt index: " + i + ", holding value: " + this.deck[i]);
        this.deck.splice(i, 1);
        
        return ret;
    }

    playTile(tile, x, y){
        // Location must be empty. Must be next to a tile. Must meet adjacency requirements. 
        // Check if empty

        if (this.board[x][y] == -1) {
            let play = true;
            let neighbour = [];
            let neighbourHelper = [[0,1], [1,0], [0,-1], [-1,0]];

            for (let i = 0; i < 4; i++){
                let nX = x + neighbourHelper[i][0];
                let nY = y + neighbourHelper[i][1];
                let invalid = true;
                if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width)
                    neighbour.push([nX, nY]);
                while (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width && play && invalid){
                    console.log(nX + "," + nY);
                    let boardTile = this.board[nX][nY];
                    if (boardTile == -1) invalid = false;
                    else if (Math.floor(boardTile / 10) == Math.floor(tile/10) || boardTile % 10 == tile % 10){
                        nX = nX + neighbourHelper[i][0];
                        nY = nY + neighbourHelper[i][1];
                    }
                    else play = false;
                }

                /*
                if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width){
                    neighbour.push([nX, nY]);

                    // Start checking
                    while (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width && play)
                    if (this.board[nX][nY] == -1){

                    }
                    else if (this.board[nX][nY] == 0){
                        
                    }
                    else {
                        nX = nX + neighbourHelper[i][0];
                        nY = nY + neighbourHelper[i][1];                    }
                }
                */
            }
            console.log(neighbour);
            
            for (let i = 0; i < neighbour.length; i++){


            }

            /*
            // Check neighbours for tiles: First corner cases, edge cases then normal case
            if ((x == 0 && y == 0) || (x == this.width && y == 0) || (x == 0 && y == this.width) || (x == this.width && y == this.width)){
                console.log("Corner");

            }

            else if (x == 0 || x == this.width || y == 0 || y == this.width){
                console.log("Edge");
            }

            else {
                console.log("Normal");
            }
            */
        }

    }

    checkAxis(tile, x, y){
        // If we run into the edge of board or an empty grid without seeing an invalid tile return true. 
        if (this.board[x][y] == -1){
            return true;
        }
        /*
        else if (this.board[x][y]);
        else {

        }
        */
    }

    getColorIndex(color){
        console.log(`getting color index for ${color}`);
        return colors.indexOf(color);
    }
    
    getShapeIndex(shape){
        console.log(`getting shape index for ${shape}`);
        return shapes.indexOf(shape);
    }
}


function dealTile(){

    return 0;
}

module.exports = Qwirkle;