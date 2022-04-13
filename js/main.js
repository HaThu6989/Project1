
let carGame = document.querySelector('.carGame');
let startBtn = document.querySelector('.startBtn');
startBtn.addEventListener('click', start);

let score = document.querySelector('.score');
let gameLevel = document.querySelector('.gameLevel');

let coinBoard = document.querySelector('.coinBoard');

let gameArea = document.querySelector('.gameArea');

let carPlayer = { speed: 0, score: 0, coinScore: 0 }


/*** Arrow keys ***/
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(event) {
  keys[event.key] = true;
};

function keyUp(event) {
  keys[event.key] = false;
};



/*** Start game ***/
function start() {

  startBtn.classList.add('hide');
  score.classList.remove('hide');
  coinBoard.classList.remove('hide');
  gameLevel.classList.remove('hide');
  gameArea.classList.remove('hide');

  carPlayer.start = true;
  carPlayer.score = 0;
  carPlayer.coinScore = 0;
  window.requestAnimationFrame(runCars);
  // window.setInterval(runCars, 1000 / 60)

  /*** Create 5 coins in road ***/
  for (k = 0; k < 5; k++) {
    let coin = document.createElement('div');
    coin.setAttribute('class', 'coin');
    coin.y = (k * 150);
    coin.style.top = coin.y + 'px';
    gameArea.appendChild(coin);
  }

  /*** Create 5 lines in road ***/
  for (j = 0; j < 5; j++) {
    let roadLine = document.createElement('div');
    roadLine.setAttribute('class', 'roadLine');
    roadLine.y = (j * 150);
    roadLine.style.top = roadLine.y + 'px';
    gameArea.appendChild(roadLine);
  }

  /*** Locate carPlayer ***/
  let car = document.createElement('div');
  car.setAttribute('class', 'car');
  gameArea.appendChild(car);
  carPlayer.x = car.offsetLeft; //0
  carPlayer.y = car.offsetTop; //546 because 746-(80+120)


  /*** Create 3 rival cars ***/
  for (i = 0; i < 3; i++) {
    let rivalCar = document.createElement('div');
    rivalCar.setAttribute('class', 'rivalCars');
    gameArea.appendChild(rivalCar);
    rivalCar.y = (i * 350) // 0 350 700
    rivalCar.style.top = rivalCar.y + 'px';
  }
}



/*** Run cars ***/
function runCars() {
  let carPlayerElm = document.querySelector('.car');
  let sizeGameArea = gameArea.getBoundingClientRect();
  // DOMRect {x: 220, y: 0, left: 220, width: 400, height: 745.6000366210938, top: 0, bottom: 745.6000366210938, width: 400...}

  if (carPlayer.start) {
    linesMoving();
    coinsMoving(carPlayerElm);
    rivalCarsMoving(carPlayerElm);

    if (keys.ArrowUp && carPlayer.y > sizeGameArea.top) { carPlayer.y -= carPlayer.speed };
    if (keys.ArrowDown && carPlayer.y < (sizeGameArea.bottom - 80)) { carPlayer.y += carPlayer.speed }; //class="car": height = 80
    if (keys.ArrowLeft && carPlayer.x > sizeGameArea.y) { carPlayer.x -= carPlayer.speed };
    if (keys.ArrowRight && carPlayer.x < (sizeGameArea.width - 50)) { carPlayer.x += carPlayer.speed }; //class="car": width = 50

    //carPlayer : <div class="car" style = "left: 0px; top: 546px"></div> 
    carPlayerElm.style.left = carPlayer.x + 'px';
    carPlayerElm.style.top = carPlayer.y + 'px';

    carPlayer.score++;

    level();

    score.innerHTML = `Score : ${carPlayer.score}`;
    // coinBoardElm.innerHTML = `Coin : ${carPlayer.coin}`;

    window.requestAnimationFrame(runCars);
  }
}



/*** Make rival cars moving ***/
//rivalCars : <div class="rivalCars" style = "left: ...px; top: ...px"></div>
function rivalCarsMoving(carPlayerElm) {
  let rivalCarElm = document.querySelectorAll('.rivalCars');
  rivalCarElm.forEach(item => {
    if (detectCollision(carPlayerElm, item)) {
      endGame();
    };

    if (item.y > 700) {
      item.y = -300; //to reappear rivalCars
      item.style.left = Math.floor(Math.random() * 350) + 'px';
    }
    item.y += carPlayer.speed;
    item.style.top = item.y + 'px';
    // console.log(item.style.top);
  })
}


/*** Lines moving ***/
function linesMoving() {
  let roadLineElm = document.querySelectorAll('.roadLine');
  roadLineElm.forEach(item => {
    if (item.y >= 700) {
      item.y = item.y - 750;
    }

    item.y += carPlayer.speed;
    item.style.top = item.y + 'px';
  })
}


/*** Make coins moving ***/
function coinsMoving(carPlayerElm) {
  let coinElm = document.querySelectorAll('.coin');
  let coinBoardElm = document.querySelector('.coinBoard');

  coinBoardElm.innerHTML = `Coin : ${carPlayer.coinScore}`;
  coinElm.forEach(item => {
    if (detectCollision(carPlayerElm, item)) {
      carPlayer.coinScore++;
      item.classList.add('hide');
      coinBoardElm.innerHTML = `Coin : ${carPlayer.coinScore}`;
    };

    if (item.y > 700) {
      item.y = -300; //to reappear rivalCars
      item.style.left = Math.floor(Math.random() * 350) + 'px';
    };

    item.y += carPlayer.speed;
    item.style.top = item.y + 'px';
    // console.log(item.style.top);
  })
}


/*** Collision ***/
function detectCollision(player, obstacle) {
  playerRect = player.getBoundingClientRect();
  obstacleRect = obstacle.getBoundingClientRect();
  return (playerRect.x < obstacleRect.x + obstacleRect.width &&
    playerRect.x + playerRect.width > obstacleRect.x &&
    playerRect.y < obstacleRect.y + obstacleRect.height &&
    playerRect.height + playerRect.y > obstacleRect.y)
}



/*** Level ***/
function level() {
  if (carPlayer.score >= 0 && carPlayer.score <= 200) {
    carPlayer.speed = 9;
    gameLevel.innerHTML = 'Level : 1';

  } else if (carPlayer.score > 200 && carPlayer.score <= 500) {
    carPlayer.speed = 10;
    gameLevel.innerHTML = 'Level : 2';

  } else if (carPlayer.score > 500 && carPlayer.score <= 700) {
    carPlayer.speed = 11;
    gameLevel.innerHTML = 'Level : 3';

  } else if (carPlayer.score > 700 && carPlayer.score <= 900) {
    carPlayer.speed = 12;
    gameLevel.innerHTML = 'Level : 4';

  } else if (carPlayer.score > 900 && carPlayer.score <= 1200) {
    carPlayer.speed = 13;
    gameLevel.innerHTML = 'Level : 5';

  } else if (carPlayer.score > 1200) {
    carPlayer.speed = 14;
    gameLevel.innerHTML = 'Level : 6';

  }
}


/*** Game Over ***/
function endGame() {
  carPlayer.start = false;
  console.log('Game over');
  startBtn.classList.remove('hide');

  gameArea.classList.add('hide');
  gameArea.innerHTML = '';

  score.classList.add('hide');
  gameLevel.classList.add('hide');
  coinBoard.classList.add('hide');

  startBtn.innerHTML = ` Game Over <br> Your score : ${carPlayer.score} <br> Your coin : ${carPlayer.coinScore} <br> Click here to Restart`;
}


