class Grid {

    constructor(x, y){
        this.x = x;
        this.y = y;
        this.tile = "  ";
    }

    setTile(tile){
        this.tile = tile;
    }  

    getTile(){
        return this.tile;
    }
    
}

module.exports = Grid;