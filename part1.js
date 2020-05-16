const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const STEP = 50

const ROTATIONS = 4

const NOISE_SCALE = 0.001

function setup() {
  createCanvas(WIDTH, HEIGHT);
}

let totalTime = 0

function draw() {
  background(0);
  totalTime += deltaTime
  
  for (let x = 0; x < WIDTH; x += STEP) {
    for (let y = 0; y < HEIGHT; y += STEP) {
      const n = noise(x * NOISE_SCALE, y * NOISE_SCALE)
      const angle = n * PI * ROTATIONS
      
      const endX = x + cos(angle) * STEP/2
      const endY = y + sin(angle) * STEP/2
      
      stroke(255)
      line(x, y, endX, endY)
    }
  }
}