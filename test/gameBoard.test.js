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
})
