const qwirkleGame = require('../game/qwirkle');
const game = new qwirkleGame();

describe('board after initailization', ()=>{
    test('game board is empty', (done)=>{
        expect(game.board).toEqual([]);
        expect(game.board.length).toBe(0);
        expect(game.board.length).not.toBe(1);
        done();
    })    
})

describe('deck and board after game started', ()=>{
    test('start game', (done)=>{
        game.startGame();    
        expect(game.board).not.toEqual([]);
        expect(game.board.length).toBe(10);
        expect(game.board.length).not.toBe(1);
        expect(game.board[0]).toEqual([-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);
        expect(game.deck.length).not.toBe(109);
        expect(game.deck.length).not.toBe(107);
        //expect(game.deck.length).toBe(108 - (game.players.length * 6));
        done();
    })
    
    test('deal tile',(done)=>{
        let tile = game.dealTile();
        expect(typeof tile).toBe('number');
        expect(tile).toBeGreaterThan(0);
        //expect(game.deck.length).not.toBe(108 - (game.players.length * 6));
        //expect(game.deck.length).toBe(108 - (game.players.length * 6) - 1);
        done();
    })

    test('place first tile on grid', (done)=>{
        //invalid play
        let played = game.playFirstTile(55,4,5);
        expect(game.board[4][4]).toBe(-1);
        expect(played).toBe(false);
        //valid play
        played = game.playFirstTile(55,4,4);
        expect(game.board[4][4]).toBe(55);
        expect(played).toBe(true);
        //call again
        played = game.playFirstTile(54,4,4);
        expect(game.board[4][4]).toBe(55);
        expect(played).toBe(false);
        done();
    })

    test('continue to play tiles', (done)=>{
        let played = game.playNormalTile(54,4,5);
        expect(game.board[4][4]).toBe(55);
        //play valid tile next door
        expect(game.board[4][5]).toBe(54);
        expect(played).toBe(true);
        //play tile on coordinate already used
        played = game.playNormalTile(52,4,5);
        expect(game.board[4][5]).toBe(54);
        expect(played).toBe(false);
        //play invalid tile next door
        played = game.playNormalTile(54,4,3);
        expect(game.board[4][3]).toBe(-1);
        expect(played).toBe(false);
        done();
    })
})
