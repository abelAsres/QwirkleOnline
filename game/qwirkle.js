const colors = ['Yellow','Blue','Red','Orange','Purple','Green'];
const shapes = ['Circle','Cross','Diamond','Square','Star','Triangle'];

const Grid = require("./grid");

class Qwirkle {
    constructor(userName){
        this.players = [];
        this.board = []; //= [[],[]]
        this.deck = [];
        
        this.players.push(userName);
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
    }

    dealTile(){
        let i = Math.floor(Math.random() * this.deck.length);
        let ret = this.deck[i];
        console.log("Dealt index: " + i + ", holding value: " + this.deck[i]);
        this.deck.splice(i, 1);
        
        return ret;
    }

}


function dealTile(){

    return 0;
}

module.exports = Qwirkle;