const Qwirkle = require('../game/qwirkle');
const qwirkleGame = require('../game/qwirkle');
const game = new qwirkleGame('player1');
let playerHands = [];
describe('board after initailization', ()=>{
    test('game board is empty', (done)=>{
        expect(game.board).toEqual([]);
        expect(game.board.length).toBe(0);
        expect(game.board.length).not.toBe(1);
        game.addPlayer('player2');    
        game.addPlayer('player3');
        game.addPlayer('player4');
        expect(game.players.length).toBe(4);
        expect(game.players[0]).toBe('player1');
        expect(game.players[1]).toBe('player2');
        expect(game.players[2]).toBe('player3');
        expect(game.players[3]).toBe('player4');
        done();
    })    
})

describe('deck and board after game started', ()=>{
    test('start game', (done)=>{
        game.startGame(); 
        expect(game.turn).toBe(0); 
        //deal each player a starting hand
        for (let i = 0; i< game.players.length; i++){
            playerHands.push([]);
            for(let j = 0; j < 6; j++){
                playerHands[i].push(game.dealTile());
            }
        }
        //test each player at start of game
        for(let i =0; i<game.players.length;i++){
            expect(game.score[i]).toBe(0);
            expect(game.endGameArray[i]).toBe(false);
        }

        expect(game.board).not.toEqual([]);
        expect(game.board.length).toBe(31);
        expect(game.board.length).not.toBe(1);
        expect(game.board[0]).toEqual([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
        expect(game.deck.length).not.toBe(109);
        expect(game.deck.length).not.toBe(107);

        expect(game.deck.length).toBe(108 - (game.players.length * 6));
        done();
    })
    
    test('deal tile',(done)=>{
        let tile = game.dealTile();
        expect(typeof tile).toBe('number');
        expect(tile).toBeGreaterThan(-1);
        expect(game.deck.length).not.toBe(108 - (game.players.length * 6));
        let totalTilesInPlayerHands = 0;
        for (let i = 0; i < playerHands.length; i++){
            totalTilesInPlayerHands += playerHands[i].length;
        }
        expect(game.deck.length).toBe(108 - totalTilesInPlayerHands - 1);
        done();
    })

    test('place first tile on grid', (done)=>{
        //invalid play
        let played = game.playFirstTile(55,15,16);
        expect(game.board[15][16]).toBe(-1);
        expect(played).toBe(false);
        //valid play
        played = game.playFirstTile(55,15,15);
        expect(game.board[15][15]).toBe(55);
        expect(played).toBe(true);
        //call again
        played = game.playFirstTile(54,15,15);
        expect(game.board[15][15]).toBe(55);
        expect(played).toBe(false);
        done();
    })

    test('continue to play tiles', (done)=>{
        let played = game.playNormalTile(54,15,16);
        expect(game.board[15][15]).toBe(55);
        //play valid tile next door
        expect(game.board[15][16]).toBe(54);
        expect(played).toBe(true);
        //play tile on coordinate already used
        played = game.playNormalTile(52,15,16);
        expect(game.board[15][16]).toBe(54);
        expect(played).toBe(false);
        //play invalid tile next door (tile already played)
        played = game.playNormalTile(54,15,14);
        expect(game.board[15][14]).toBe(-1);
        expect(played).toBe(false);
        done();
    })

    test('passing user turn', (done)=>{
        game.endTurn();
        expect(game.turn).toBe(1);
        game.endTurn();
        expect(game.turn).toBe(2);
        game.endTurn();
        expect(game.turn).toBe(3);
        game.endTurn();
        expect(game.turn).toBe(0);
        done();
    })

    test('get a qwirkle',(done)=>{
        let newGame = new Qwirkle('player1');
        newGame.startGame();
        //get 3 points 
        let played = newGame.playFirstTile(55,15,15);
        played = newGame.playTile(54,14,15);
        played = newGame.playTile(53,13,15);
        newGame.endTurn();
        //get a qwirkle add 12 to inital score
        expect(newGame.score[0]).toBe(3);
        played = newGame.playTile(52,12,15);
        played = newGame.playTile(51,11,15);
        played = newGame.playTile(50,10,15);
        newGame.endTurn();
        //get 9 points and add to score 
        expect(newGame.score[0]).toBe(15);
        played = newGame.playTile(42,12,14);
        played = newGame.playTile(41,11,14);
        played = newGame.playTile(40,10,14);
        newGame.endTurn();
        expect(newGame.score[0]).toBe(24);
        done();
    })
})
