const ACCELERATION = 5
const MAX_SPEED = 30
const SCALE_X = 0.001
const SCALE_Y = 0.001
const SCALE_Z = 0.002
const SCALE_TIME = 0.05
const ROTATIONS = 11 

const PARTICLES = 1000

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
const DEPTH = 1000

class Particle {
	constructor(x, y, z, velocity) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.velocity = velocity
	}

	accelerate(x, y, z) {
		this.velocity.add(x, y, z)
		this.velocity.limit(MAX_SPEED)
	}
}

let particles = []

let totalTimeSeconds = 0

function setup() {
	createCanvas(WIDTH, HEIGHT, WEBGL);
	background(0)

	for (let i = 0; i < PARTICLES; ++i) {
		particles.push(new Particle(WIDTH * Math.random() - WIDTH / 2, HEIGHT * Math.random() - HEIGHT / 2, DEPTH * Math.random(), createVector(0, 0, 0)))
	}
}

function draw() {
	// Convert to seconds
	const deltaTimeSeconds = deltaTime * 0.001
	totalTimeSeconds += deltaTimeSeconds

	// background transparency doesn't seem to work at the moment, so use a rectangle instead
	// subtract white with low alpha, effectively creating a black background with lines drawn being removed slowly
	blendMode(SUBTRACT)
	fill('rgba(255, 255, 255, .03)')
	rect(-WIDTH / 2, -HEIGHT / 2, WIDTH * 1.1, HEIGHT * 1.1)

	// Blend lines into background, creating a tail like effect on each particle
	blendMode(BLEND)

	for (let i = 0; i < particles.length; ++i) {
		const particle = particles[i]

		let x = particle.x
		let y = particle.y
		let z = particle.z

		// Move particles out of the field to the other side
		if (z < 0) {
			z = DEPTH
		} else if (z > DEPTH) {
			z = 0
		}

		if (x < -WIDTH / 2) {
			x = WIDTH / 2
		} else if(x > WIDTH / 2) {
			x = -WIDTH / 2
		}

		if (y < -HEIGHT / 2) {
			y = HEIGHT / 2
		} else if(y > HEIGHT / 2) {
			y = -HEIGHT / 2
		}

		// Noise is generated for each pair of dimensions, and then converted to a set of three angles
		const noiseXY = noise(x * SCALE_X, y * SCALE_Y, totalTimeSeconds * SCALE_TIME)
		const noiseYZ = noise(y * SCALE_Y, z * SCALE_Z, totalTimeSeconds * SCALE_TIME)
		const noiseXZ = noise(x * SCALE_X, z * SCALE_Z, totalTimeSeconds * SCALE_TIME)

		const noiseXYAngle = noiseXY * Math.PI * ROTATIONS
		const noiseYZAngle = noiseYZ * Math.PI * ROTATIONS
		const noiseXZAngle = noiseXZ * Math.PI * ROTATIONS

		// Accelerate particle in the direction of the three angles
		const accelX = Math.cos(noiseXYAngle) * ACCELERATION * deltaTimeSeconds + Math.cos(noiseXZAngle) * ACCELERATION * deltaTimeSeconds
		const accelY = Math.sin(noiseXYAngle) * ACCELERATION * deltaTimeSeconds + Math.cos(noiseYZAngle) * ACCELERATION * deltaTimeSeconds
		const accelZ = Math.sin(noiseYZAngle) * ACCELERATION * deltaTimeSeconds + Math.sin(noiseXZAngle) * ACCELERATION * deltaTimeSeconds

		particle.accelerate(accelX, accelY, accelZ)

		const nextX = x + particle.velocity.x * deltaTimeSeconds
		const nextY = y + particle.velocity.y * deltaTimeSeconds
		const nextZ = z + particle.velocity.z * deltaTimeSeconds

		// The amount of red, blue, and green the particle is drawn with corresponds to the to the speed in the x, y, and z direction respectively
		const red = Math.round(map(Math.abs(particle.velocity.x), 0, MAX_SPEED, 0, 255))
		const blue = Math.round(map(Math.abs(particle.velocity.y), 0, MAX_SPEED, 0, 255))
		const green = Math.round(map(Math.abs(particle.velocity.z), 0, MAX_SPEED, 0, 255))

		// Draw a line from the current point of the particle to the next point
		stroke('rgba('+red+','+green+','+blue+',1)');
		beginShape();
		vertex(x,y,z);
		vertex(nextX,nextY,nextZ);
		endShape();

		particle.x = nextX
		particle.y = nextY
		particle.z = nextZ
	}
}