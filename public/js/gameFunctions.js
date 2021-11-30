let playerStatus = false; 

function updatePlayerStatus() {
  console.log(playerStatus);
  return  playerStatus = !playerStatus;  
}

function tileENUM2(shape, color){
    let ret;

    if (color == 'Yellow') ret = 0;
    else if (color == 'Blue') ret = 10;
    else if (color == 'Red') ret = 20;
    else if (color == 'Orange') ret = 30; 
    else if (color == 'Purple') ret = 40;
    else if (color == 'Green') ret = 50;

    if (shape == 'Circle') ret += 0;
    else if (shape == 'Cross') ret += 1;
    else if (shape == 'Diamond') ret += 2;
    else if (shape == 'Square') ret += 3;
    else if (shape == 'Star') ret += 4;
    else if (shape == 'Triangle') ret += 5;

    return ret;
}

module.exports = {
    tileENUM2,
    updatePlayerStatus
}