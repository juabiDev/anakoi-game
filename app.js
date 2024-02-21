const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const $sprite = document.querySelector("#sprite")
const $bricks = document.querySelector("#bricks")

canvas.width = 448
canvas.height = 400

// Variables de nuestro juego
let counter = 0

// Variables de la pelota
const ballRadius = 3;
// posicion de la pelota
let x = canvas.width / 2
let y = canvas.height - 30
// velocidad de la pelota
let dx = 2
let dy = -2

/* VARIABLES DE LA PALETA */
const paddleHeight = 10;
const paddleWidth = 50;
const PADDLE_SENSITIVE = 5

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeight - 10

let rightPressed = false
let leftPressed = false

/* VARIABLES DE LOS LADRILLOS */
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeigh = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = []

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}

for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [] // inicializamos con un array vacio
    for(let r = 0; r < brickRowCount; r++) {
        // calculamos la posicion del ladrillo en la pantalla
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeigh + brickPadding) + brickOffsetTop
        // asignar un color aleatorio a cada ladrillo
        const random = Math.floor(Math.random() * 7) + 1
        // Guardamos la informacion de cada ladrillo
        bricks[c][r] = { 
            x: brickX, 
            y: brickY, 
            status: BRICK_STATUS.ACTIVE, 
            color: random 
        }

    }
}

function drawBall () {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2) // dibujar un arco
    // ctx.arc(ejeX, ejeY, radio, anguloInicial, anguloFinal)
    ctx.fillStyle = "#fff" // color de relleno
    ctx.fill() // rellenar el arco
    ctx.closePath() // cerrar el arco

}

function drawPaddle () {
    ctx.drawImage(
        $sprite, // imagen
        29, // clipX: coordenadas de recorte
        174, // clipY: coordenadas de recorte
        paddleWidth, // el tamaño del recorte
        paddleHeight, // el tamaño del recorte
        paddleX, // posicion X del dibujo
        paddleY, // posicion Y del dibujo
        paddleWidth, // ancho del dibujo
        paddleHeight // alto del dibujo
    )
}


function drawBricks () {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;
            const clipX = currentBrick.color * 32
            
            ctx.drawImage(
                $bricks,
                clipX,
                0,
                brickWidth,
                brickHeigh,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeigh
            )

        }
    }
}

function collisionDetection () {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const currentBrick = bricks[c][r]
            if(currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            const isBallSameXAsBrick =
                x > currentBrick.x &&
                x < currentBrick.x + brickWidth

            const isBallSameYAsBrick =
                y > currentBrick.y &&
                y < currentBrick.y + brickHeigh

            
            if(isBallSameXAsBrick && isBallSameYAsBrick) {
                dy = -dy
                currentBrick.status = BRICK_STATUS.DESTROYED
            }
        }
    }
}

function ballMovement () {
    // rebotar las pelotas en las laterales
    if (
        x + dx > canvas.width - ballRadius || // pared derecha
        x + dx < ballRadius // pared izquierda
    ) {
        dx = -dx
    }

    // rebotar las pelotas en la parte superior
    if(y + dy < ballRadius) {
        dy = -dy
    }

    // rebotar la pelota en la paleta
    const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth

    const isBallTouchingPaddle = y + dy > paddleY

    if(isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy
    } else if( y + dy > canvas.height - ballRadius) { // toca el suelo
        document.location.reload()
    }

    // mover la pelota
    x += dx
    y += dy
}

function paddleMovement () {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVE
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVE
    }
}

function cleanCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.clearRect(ejeX, ejeY, ancho, alto)
}

function initEvents () {
    // eventos del teclado
    // keydown -> cuando se presiona una tecla
    // keyup -> cuando se suelta una tecla
    document.addEventListener("keydown", keyDownHandler)
    document.addEventListener("keyup", keyUpHandler)

    function keyDownHandler (event) {
        const { key } = event

        if (key === "Right" || key === "ArrowRight") {
            rightPressed = true
        } 
        
        if (key === "Left" || key === "ArrowLeft") {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event

        if (key === "Right" || key === "ArrowRight") {
            rightPressed = false
        } 
        
        if (key === "Left" || key === "ArrowLeft") {
            leftPressed = false
        }
    }

}

function draw () {

    console.log({ rightPressed, leftPressed })
    cleanCanvas()
    // hay que dibujar los elementos
    drawBall()
    drawPaddle()
    drawBricks()
    // drawScore()

    // colisiones y movimientos
    collisionDetection()
    ballMovement()
    paddleMovement()

    // loop del juego
    window.requestAnimationFrame(draw)
}

draw()
initEvents()