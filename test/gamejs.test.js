const game  = require('../public/js/gameFunctions');


describe('test tile create', ()=>{
    //Yellow Tiles
    test('Yellow Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Yellow');
        expect(tileENum).toBe(0);
        done();
    })

    test('Yellow Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Yellow');
        expect(tileENum).toBe(1);
        done();
    })

    test('Yellow Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Yellow');
        expect(tileENum).toBe(2);
        done();
    })
    test('Yellow Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Yellow');
        expect(tileENum).toBe(3);
        done();
    })
    test('Yellow Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Yellow');
        expect(tileENum).toBe(4);
        done();
    })
    test('Yellow Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Yellow');
        expect(tileENum).toBe(5);
        done();
    })

    //Blue Tiles
    test('Blue Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Blue');
        expect(tileENum).toBe(10);
        done();
    })

    test('Blue Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Blue');
        expect(tileENum).toBe(11);
        done();
    })

    test('Blue Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Blue');
        expect(tileENum).toBe(12);
        done();
    })
    test('Blue Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Blue');
        expect(tileENum).toBe(13);
        done();
    })
    test('Blue Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Blue');
        expect(tileENum).toBe(14);
        done();
    })
    test('Blue Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Blue');
        expect(tileENum).toBe(15);
        done();
    })

    //Red Tiles
    test('Red Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Red');
        expect(tileENum).toBe(20);
        done();
    })

    test('Red Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Red');
        expect(tileENum).toBe(21);
        done();
    })

    test('Red Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Red');
        expect(tileENum).toBe(22);
        done();
    })
    test('Red Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Red');
        expect(tileENum).toBe(23);
        done();
    })
    test('Red Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Red');
        expect(tileENum).toBe(24);
        done();
    })
    test('Red Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Red');
        expect(tileENum).toBe(25);
        done();
    })

    //Orange Tiles
    test('Orange Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Orange');
        expect(tileENum).toBe(30);
        done();
    })

    test('Orange Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Orange');
        expect(tileENum).toBe(31);
        done();
    })

    test('Orange Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Orange');
        expect(tileENum).toBe(32);
        done();
    })
    test('Orange Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Orange');
        expect(tileENum).toBe(33);
        done();
    })
    test('Orange Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Orange');
        expect(tileENum).toBe(34);
        done();
    })
    test('Orange Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Orange');
        expect(tileENum).toBe(35);
        done();
    })

    //Purple TIle
    test('Purple Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Purple');
        expect(tileENum).toBe(40);
        done();
    })

    test('Purple Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Purple');
        expect(tileENum).toBe(41);
        done();
    })

    test('Purple Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Purple');
        expect(tileENum).toBe(42);
        done();
    })
    test('Purple Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Purple');
        expect(tileENum).toBe(43);
        done();
    })
    test('Purple Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Purple');
        expect(tileENum).toBe(44);
        done();
    })
    test('Purple Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Purple');
        expect(tileENum).toBe(45);
        done();
    })

    //Green Tile
    test('Green Cirle', (done)=>{
        const tileENum = game.tileENUM2('Circle','Green');
        expect(tileENum).toBe(50);
        done();
    })

    test('Green Cross', (done)=>{
        const tileENum = game.tileENUM2('Cross','Green');
        expect(tileENum).toBe(51);
        done();
    })

    test('Green Diamond', (done)=>{
        const tileENum = game.tileENUM2('Diamond','Green');
        expect(tileENum).toBe(52);
        done();
    })
    test('Green Square', (done)=>{
        const tileENum = game.tileENUM2('Square','Green');
        expect(tileENum).toBe(53);
        done();
    })
    test('Green Star', (done)=>{
        const tileENum = game.tileENUM2('Star','Green');
        expect(tileENum).toBe(54);
        done();
    })
    test('Green Triangle', (done)=>{
        const tileENum = game.tileENUM2('Triangle','Green');
        expect(tileENum).toBe(55);
        done();
    })
})


describe('test player ready state', ()=>{
    test('player is ready', (done)=>{
        let playerStatus = game.updatePlayerStatus();
        expect(playerStatus).toBe(true);
        done();
    })
})