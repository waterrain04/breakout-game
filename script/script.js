const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const start =document.getElementById("start");
const pause = document.getElementById("pause");
const restart = document.getElementById("restart");
const hard = document.getElementById("hard")
const gameOver = document.querySelector('.gameover')
const controls =document.querySelector('.control')
console.log(gameOver)
const blockWidth = 200
const blockHeight = 40
const boardWidth = 1120
const boardHeight = 600
const ballDiameter = 40

const userStart = [460, 20];
let currentPosition = userStart

const ballStart = [540, 80]
let ballCurrentPosition = ballStart

let time=30;
let xDirection = 4;
let yDirection = 4;
let timerId
let score = 0


//my blocka
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}
const blocks = [
  new Block(20, 540),
  new Block(240, 540),
  new Block(460, 540),
  new Block(680, 540),
  new Block(900, 540),
  new Block(20, 480),
  new Block(240, 480),
  new Block(460, 480),
  new Block(680, 480),
  new Block(900, 480),
  new Block(20, 420),
  new Block(240, 420),
  new Block(460, 420),
  new Block(680, 420),
  new Block(900, 420),
]
//draw my blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
 
    const block = document.createElement('div')
      if(i <5 ){
      block.classList.add('block')
      block.style.backgroundColor ="blue"
      }

      if(i>=5 && i<10 ){
        block.classList.add('block')
        block.style.backgroundColor="red";
        }
      if(i>=10 && i<15){
        block.classList.add('block')
        block.style.backgroundColor="green";

      }

    block.style.left = blocks[i].bottomLeft[0] + 'px'  
    block.style.bottom = blocks[i].bottomLeft[1] + 'px'  
    grid.appendChild(block)
  }
}
addBlocks()

const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()


//draw User
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}


//move user
function moveUser(e) {
  switch(e.key){
    case 'a':
      case "A":
        if (currentPosition[0] > 0) {
          currentPosition[0] -= 20
          drawUser()   
        }
        break
      case 'd':
      case 'D':
        if (currentPosition[0] < (boardWidth - blockWidth)) {
          currentPosition[0] += 20
          drawUser()   
        }
        break
  }
}

//add ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()


//draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
  console.log("X "+xDirection + " y "+yDirection)

}

//move ball
function moveBall() {
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions()
}


//check for collisions
function checkForCollisions() {
 // check for wall hits
  if (ballCurrentPosition[0] >= 1080 || ballCurrentPosition[0] <= 0 || ballCurrentPosition[1] >=560)
  {
    document.getElementById("wall").play()
    changeDirection()
  }

  //check for user collision
  if
  (
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight ) 
  )
  {
    document.getElementById("platform").play();
    changeDirection()
  }
    //check for block collision
    for (let i = 0; i < blocks.length; i++){
      if
      (
        (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
        ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
      )
        {
        document.getElementById("enemy").play();
        const allBlocks = Array.from(document.querySelectorAll('.block'))
        allBlocks[i].classList.remove('block')
        blocks.splice(i,1)
        changeDirection()   
        score++
        scoreDisplay.innerHTML = score
        if (blocks.length == 0) {
          scoreDisplay.innerHTML = 'YOU WIN!'
          gameOver.innerText="YOU WIN!"
          gameOver.style.display ="block"
          clearInterval(timerId)
          document.removeEventListener('keydown', moveUser)
        }
      }
    }

      //game over
  if (ballCurrentPosition[1] <= 0) {
    document.getElementById("dead").play();
    gameOver.style.display ="block"
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'YOU LOSE!'
    pause.disabled=true;
    start.disabled=true;    
    document.removeEventListener('keydown', moveUser)
  }

}

function changeDirection() {
  if (xDirection === 4 && yDirection === 4) {
    yDirection = -4
    return
  }
  if (xDirection === 4 && yDirection === -4) {
    xDirection = -4
    return
  }
  if (xDirection === -4 && yDirection === -4) {
    yDirection = 4
    return
  }
  if (xDirection === -4 && yDirection === 4) {
    xDirection = 4
    return
  }
}

start.addEventListener('click',()=>{
timerId = setInterval(moveBall, time)
document.addEventListener('keydown', moveUser);
start.disabled=true;
pause.disabled=false;
hard.disabled=true;
start.style.opacity ="0.3"
pause.style.opacity = "1"
controls.style.display="none"

})

pause.addEventListener('click',()=>{
  clearInterval(timerId)
  document.removeEventListener('keydown', moveUser)
  start.disabled=false;
  pause.disabled=true;
  pause.style.opacity = "0.3"
  start.style.opacity ="1"


})

restart.onclick=()=>{
  window.location.reload();
}

hard.onclick =()=>{
  time = 10 
  if(hard.disabled == true){
    hard.disabled = false
  }
  if(hard.disabled == false){
    hard.disabled = true
  }
  hard.style.opacity="0.3"
}
