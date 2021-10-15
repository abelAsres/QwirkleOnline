const Player = {
    playerName:String,
    playerScore: Number,
    get playerName () {
        return this.playerName.toUpperCase();
    },
    set playerScore (points) {
        this.playerScore+=points;
    },
    get playerScore(){
        return this.playerScore;
    }
}