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
        this.turn++;
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

    playNormalTile(tile, x, y){
        
        // If this space is empty find the non empty neighbours. 
        if (this.board[x][y] == -1) {
            let neighbour = [];
            let neighbourHelper = [[0,1], [1,0], [0,-1], [-1,0]];
            let neighbourHelper2 = [];

            for (let i = 0; i < 4; i++){
                let nX = x + neighbourHelper[i][0];
                let nY = y + neighbourHelper[i][1];
                //console.log(`Check ${nX}, ${nY}`);
                if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width){
                    if (this.board[nX][nY] != -1){
                        neighbour.push([nX, nY]);
                        neighbourHelper2.push([neighbourHelper[i][0],neighbourHelper[i][1]]);
                    }
                }
            }
            console.log(neighbour);
            
            if (neighbour.length == 0){
                console.log("500");
                return false; // Special case for no neighbours at all 
            }
            for (let i = 0; i < neighbour.length; i++){
                let nX = x + neighbourHelper2[i][0];
                let nY = y + neighbourHelper2[i][1];
                let exit = false;
                //console.log("LOOP: " + i);
                
                for (let j = 0; j < 6 && !exit; j++){
                    if (nX < 0 || nX > this.width || nY < 0 || nY > this.width){
                        console.log("WHY");
                        this.board[x][y] = tile;
                    }
                    console.log(`Tile ${tile} at ${nX}, ${nY}`);
                    if (this.board[nX][nY] == tile){
                        console.log("0");
                        return false;
                    }
                    else if (this.board[nX][nY] % 10 == tile % 10){
                        console.log("1");
                    }
                    else if (Math.floor(this.board[nX][nY] / 10) == Math.floor(tile / 10)) {
                        console.log("2");
                    }
                    else if (this.board[nX][nY] == -1){
                        console.log("3");
                        this.board[x][y] = tile;
                        exit = true;
                    }
                    else {
                        console.log("4");
                        return false;
                    }
                    nX+= neighbourHelper2[i][0];
                    nY+= neighbourHelper2[i][1];
                }
            }

            console.log("5");
            return true;
        }
        //return false;
    }
    
    playTile(tile, x, y){
        if (!this.firstTilePlayed){
            if (this.playFirstTile(tile, x, y)){
                this.firstTilePlayed = true;
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

        /*
            let rowCheck = [];

            for (let i = 0; i < neighbour.length; i++){
                let nX = neighbour[i][0];
                let nY = neighbour[i][1];
                let validNeighbour = false;
                let count = 0;

                if (this.board[nX][nY] == tile);
                else if (this.board[neighbour[i][0]][neighbour[i][1]] % 10 == tile % 10){
                    validNeighbour = true;
                }
                else if (Math.floor(this.board[neighbour[i][0]][neighbour[i][1]] / 10) == Math.floor(tile / 10)) {
                    validNeighbour = true;
                }

            }


                /*
                while (validNeighbour && count < 5){
                    let nX = x + neighbourHelper2[i][0];
                    let nY = y + neighbourHelper2[i][0];
                    
                    if (nX >= 0 && nX <= this.width && nY >= 0 && nY <= this.width) {
                        ret = true;
                    }
                    else if (this.board[nX][nY] == tile){
                        validNeighbour = false;
                    }
                    else if (this.board[nX][nY] % 10 == tile % 10) {

                    }
                    else if (Math.floor(this.board[nX][nY] / 10) == Math.floor(tile / 10)){

                    }
                    else {
                        validNeighbour = false;
                        ret = true;
                    }
                    count++;
                }*/
            
        
        
        //return ret; 
        /*
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
                    //console.log(nX + "," + nY);
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
            
            //console.log(neighbour);
            
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
    /*
    tilePlacementCheck(tile, x, y, xMod, yMod, counter){
        //console.log(`Check ${tile} at ${x}, ${y}`);
        if (x >= 0 && x <= this.width && y >= 0 && y <= this.width){
            return true;
        }
        else if (this.board[x][y] == - 1 || counter == 6){
            return true;
        }
        else if (this.board[x][y] == tile){
            return false;
        }
        else if (this.board[x][y] % 10 == tile % 10 || Math.floor(this.board[x][y] / 10) == Math.floor(tile / 10)){
            this.tilePlacementCheck(tile, x + xMod, y + yMod, counter++);
        }
        else {
            return false;
        }
    }
    */


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

}


function dealTile(){

    return 0;
}

module.exports = Qwirkle;