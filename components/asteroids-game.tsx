"use client"

import { useEffect, useRef, useState } from "react"

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)

  // Game objects
  const shipRef = useRef({
    x: 0,
    y: 0,
    radius: 15,
    angle: 0,
    rotation: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
    exploding: false,
    explodeTime: 0,
  })

  const asteroidsRef = useRef<
    Array<{
      x: number
      y: number
      radius: number
      speed: number
      angle: number
      vertices: number
      jaggedness: number
      offsets: number[]
    }>
  >([])

  const bulletsRef = useRef<
    Array<{
      x: number
      y: number
      radius: number
      speed: number
      angle: number
      lifetime: number
    }>
  >([])

  const keysRef = useRef({
    ArrowUp: false,
    ArrowLeft: false,
    ArrowRight: false,
    " ": false,
  })

  const requestRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const canvasWidthRef = useRef(0)
  const canvasHeightRef = useRef(0)

  // Constants
  const FPS = 60
  const SHIP_SIZE = 30
  const TURN_SPEED = 360 // degrees per second
  const SHIP_THRUST = 5 // acceleration in pixels per second per second
  const FRICTION = 0.7 // friction coefficient (0 = no friction, 1 = full friction)
  const ASTEROID_NUM = 3 // starting number of asteroids
  const ASTEROID_SIZE = 100 // starting size of asteroids in pixels
  const ASTEROID_SPEED = 50 // max starting speed of asteroids in pixels per second
  const ASTEROID_VERTICES = 10 // average number of vertices on each asteroid
  const ASTEROID_JAGGEDNESS = 0.4 // jaggedness of the asteroids (0 = none, 1 = lots)
  const BULLET_SPEED = 500 // speed of bullets in pixels per second
  const BULLET_LIFETIME = 2 // seconds bullets last for
  const BULLET_MAX = 10 // maximum number of bullets on screen at once
  const BULLET_DELAY = 0.25 // seconds between bullet firing

  // Initialize game
  const initGame = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvasWidthRef.current = canvas.width
    canvasHeightRef.current = canvas.height

    // Reset game state
    setScore(0)
    setLives(3)
    setGameOver(false)

    // Initialize ship
    const ship = shipRef.current
    ship.x = canvas.width / 2
    ship.y = canvas.height / 2
    ship.angle = (90 / 180) * Math.PI // pointing up
    ship.rotation = 0
    ship.thrusting = false
    ship.thrust = { x: 0, y: 0 }
    ship.exploding = false

    // Initialize asteroids
    createAsteroidBelt()

    // Clear bullets
    bulletsRef.current = []

    // Start game loop
    lastTimeRef.current = performance.now()
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
    requestRef.current = requestAnimationFrame(gameLoop)
    setGameStarted(true)
  }

  // Create asteroid belt
  const createAsteroidBelt = () => {
    asteroidsRef.current = []
    let x, y

    for (let i = 0; i < ASTEROID_NUM; i++) {
      // Random position (not too close to the ship)
      do {
        x = Math.random() * canvasWidthRef.current
        y = Math.random() * canvasHeightRef.current
      } while (distBetweenPoints(shipRef.current.x, shipRef.current.y, x, y) < ASTEROID_SIZE * 2 + SHIP_SIZE)

      // Create asteroid
      asteroidsRef.current.push(createAsteroid(x, y, ASTEROID_SIZE))
    }
  }

  // Create a single asteroid
  const createAsteroid = (x: number, y: number, size: number) => {
    const asteroid = {
      x,
      y,
      radius: size / 2,
      speed: (Math.random() * ASTEROID_SPEED) / FPS,
      angle: Math.random() * Math.PI * 2,
      vertices: Math.floor(Math.random() * (ASTEROID_VERTICES + 1) + ASTEROID_VERTICES / 2),
      jaggedness: ASTEROID_JAGGEDNESS,
      offsets: [] as number[],
    }

    // Create the vertex offsets array
    for (let i = 0; i < asteroid.vertices; i++) {
      asteroid.offsets.push(Math.random() * asteroid.jaggedness * 2 + 1 - asteroid.jaggedness)
    }

    return asteroid
  }

  // Calculate distance between two points
  const distBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Game loop
  const gameLoop = (timestamp: number) => {
    const deltaTime = (timestamp - lastTimeRef.current) / 1000 // convert to seconds
    lastTimeRef.current = timestamp

    // Update game state
    update(deltaTime)

    // Render game
    draw()

    // Continue loop
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  // Update game state
  const update = (deltaTime: number) => {
    if (gameOver) return

    const ship = shipRef.current
    const bullets = bulletsRef.current
    const asteroids = asteroidsRef.current
    const keys = keysRef.current

    // Rotate ship
    if (keys.ArrowLeft) {
      ship.rotation = ((TURN_SPEED / 180) * Math.PI) / FPS // radians per frame
    } else if (keys.ArrowRight) {
      ship.rotation = ((-TURN_SPEED / 180) * Math.PI) / FPS // radians per frame
    } else {
      ship.rotation = 0
    }

    // Update ship angle
    ship.angle += ship.rotation

    // Thrust ship
    ship.thrusting = keys.ArrowUp

    if (ship.thrusting && !ship.exploding) {
      ship.thrust.x += (SHIP_THRUST * Math.cos(ship.angle)) / FPS
      ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.angle)) / FPS
    } else {
      // Apply friction
      ship.thrust.x *= FRICTION
      ship.thrust.y *= FRICTION
    }

    // Update ship position
    ship.x += ship.thrust.x
    ship.y += ship.thrust.y

    // Handle edge of screen
    if (ship.x < 0) {
      ship.x = canvasWidthRef.current
    } else if (ship.x > canvasWidthRef.current) {
      ship.x = 0
    }

    if (ship.y < 0) {
      ship.y = canvasHeightRef.current
    } else if (ship.y > canvasHeightRef.current) {
      ship.y = 0
    }

    // Fire bullets
    if (keys[" "] && !ship.exploding && bullets.length < BULLET_MAX) {
      bullets.push({
        x: ship.x + (4 / 3) * ship.radius * Math.cos(ship.angle),
        y: ship.y - (4 / 3) * ship.radius * Math.sin(ship.angle),
        radius: 2,
        speed: BULLET_SPEED / FPS,
        angle: ship.angle,
        lifetime: BULLET_LIFETIME * FPS,
      })
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      // Move bullets
      bullets[i].x += bullets[i].speed * Math.cos(bullets[i].angle)
      bullets[i].y -= bullets[i].speed * Math.sin(bullets[i].angle)

      // Handle edge of screen
      if (bullets[i].x < 0) {
        bullets[i].x = canvasWidthRef.current
      } else if (bullets[i].x > canvasWidthRef.current) {
        bullets[i].x = 0
      }

      if (bullets[i].y < 0) {
        bullets[i].y = canvasHeightRef.current
      } else if (bullets[i].y > canvasHeightRef.current) {
        bullets[i].y = 0
      }

      // Reduce lifetime
      bullets[i].lifetime--

      // Remove dead bullets
      if (bullets[i].lifetime <= 0) {
        bullets.splice(i, 1)
      }
    }

    // Update asteroids
    for (let i = 0; i < asteroids.length; i++) {
      // Move asteroids
      asteroids[i].x += asteroids[i].speed * Math.cos(asteroids[i].angle)
      asteroids[i].y += asteroids[i].speed * Math.sin(asteroids[i].angle)

      // Handle edge of screen
      if (asteroids[i].x < 0 - asteroids[i].radius) {
        asteroids[i].x = canvasWidthRef.current + asteroids[i].radius
      } else if (asteroids[i].x > canvasWidthRef.current + asteroids[i].radius) {
        asteroids[i].x = 0 - asteroids[i].radius
      }

      if (asteroids[i].y < 0 - asteroids[i].radius) {
        asteroids[i].y = canvasHeightRef.current + asteroids[i].radius
      } else if (asteroids[i].y > canvasHeightRef.current + asteroids[i].radius) {
        asteroids[i].y = 0 - asteroids[i].radius
      }
    }

    // Check for asteroid collisions (with ship)
    if (!ship.exploding) {
      for (let i = 0; i < asteroids.length; i++) {
        if (distBetweenPoints(ship.x, ship.y, asteroids[i].x, asteroids[i].y) < ship.radius + asteroids[i].radius) {
          // Ship hit asteroid
          setLives((prev) => {
            const newLives = prev - 1

            if (newLives <= 0) {
              setGameOver(true)
              return 0
            }

            // Reset ship
            ship.x = canvasWidthRef.current / 2
            ship.y = canvasHeightRef.current / 2
            ship.angle = (90 / 180) * Math.PI
            ship.thrust = { x: 0, y: 0 }

            return newLives
          })
          break
        }
      }
    }

    // Check for bullet collisions with asteroids
    for (let i = bullets.length - 1; i >= 0; i--) {
      for (let j = asteroids.length - 1; j >= 0; j--) {
        if (
          distBetweenPoints(bullets[i].x, bullets[i].y, asteroids[j].x, asteroids[j].y) <
          bullets[i].radius + asteroids[j].radius
        ) {
          // Remove the bullet
          bullets.splice(i, 1)

          // Split the asteroid
          const x = asteroids[j].x
          const y = asteroids[j].y
          const radius = asteroids[j].radius

          // Remove the asteroid
          asteroids.splice(j, 1)

          // Add score
          setScore((prev) => prev + Math.ceil(100 / radius))

          // Split asteroid if large enough
          if (radius > 20) {
            asteroids.push(createAsteroid(x, y, radius * 0.6))
            asteroids.push(createAsteroid(x, y, radius * 0.6))
          }

          // Break out of the loop since the bullet is gone
          break
        }
      }
    }

    // Check if all asteroids are gone
    if (asteroids.length === 0) {
      // Create a new level with more asteroids
      createAsteroidBelt()
    }
  }

  // Draw game
  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const ship = shipRef.current
    const bullets = bulletsRef.current
    const asteroids = asteroidsRef.current

    // Draw ship
    if (!ship.exploding) {
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(
        // nose of the ship
        ship.x + (4 / 3) * ship.radius * Math.cos(ship.angle),
        ship.y - (4 / 3) * ship.radius * Math.sin(ship.angle),
      )
      ctx.lineTo(
        // rear left
        ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) + Math.sin(ship.angle)),
        ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) - Math.cos(ship.angle)),
      )
      ctx.lineTo(
        // rear right
        ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) - Math.sin(ship.angle)),
        ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) + Math.cos(ship.angle)),
      )
      ctx.closePath()
      ctx.stroke()

      // Draw thruster
      if (ship.thrusting) {
        ctx.strokeStyle = "yellow"
        ctx.beginPath()
        ctx.moveTo(
          // rear center
          ship.x - ((ship.radius * 2) / 3) * Math.cos(ship.angle),
          ship.y + ((ship.radius * 2) / 3) * Math.sin(ship.angle),
        )
        ctx.lineTo(
          // rear left
          ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) + 0.5 * Math.sin(ship.angle)),
          ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) - 0.5 * Math.cos(ship.angle)),
        )
        ctx.lineTo(
          // flame tip
          ship.x - ((ship.radius * 5) / 3) * Math.cos(ship.angle),
          ship.y + ((ship.radius * 5) / 3) * Math.sin(ship.angle),
        )
        ctx.lineTo(
          // rear right
          ship.x - ship.radius * ((2 / 3) * Math.cos(ship.angle) - 0.5 * Math.sin(ship.angle)),
          ship.y + ship.radius * ((2 / 3) * Math.sin(ship.angle) + 0.5 * Math.cos(ship.angle)),
        )
        ctx.closePath()
        ctx.stroke()
      }
    }

    // Draw bullets
    ctx.fillStyle = "white"
    for (let i = 0; i < bullets.length; i++) {
      ctx.beginPath()
      ctx.arc(bullets[i].x, bullets[i].y, bullets[i].radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw asteroids
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    for (let i = 0; i < asteroids.length; i++) {
      ctx.beginPath()

      // Draw a path for the asteroid
      const asteroid = asteroids[i]
      const radius = asteroid.radius

      // Draw the asteroid
      for (let j = 0; j < asteroid.vertices; j++) {
        const angle = (j * Math.PI * 2) / asteroid.vertices
        const offset = asteroid.offsets[j]
        const x = asteroid.x + offset * radius * Math.cos(angle)
        const y = asteroid.y + offset * radius * Math.sin(angle)

        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.closePath()
      ctx.stroke()
    }

    // Draw game info
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${score}`, 20, 30)
    ctx.textAlign = "right"
    ctx.fillText(`Lives: ${lives}`, canvas.width - 20, 30)

    // Draw game over
    if (gameOver) {
      ctx.textAlign = "center"
      ctx.font = "50px Arial"
      ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
      ctx.font = "25px Arial"
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40)
      ctx.fillText("Click to Play Again", canvas.width / 2, canvas.height / 2 + 80)
    }

    // Draw start screen
    if (!gameStarted) {
      ctx.textAlign = "center"
      ctx.font = "50px Arial"
      ctx.fillText("ASTEROIDS", canvas.width / 2, canvas.height / 2 - 40)
      ctx.font = "25px Arial"
      ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2 + 40)
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keysRef.current) {
        e.preventDefault()
        keysRef.current[e.key as keyof typeof keysRef.current] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keysRef.current) {
        e.preventDefault()
        keysRef.current[e.key as keyof typeof keysRef.current] = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // Handle canvas resize and initialization
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight

      canvasWidthRef.current = canvas.width
      canvasHeightRef.current = canvas.height

      // Redraw if game not started
      if (!gameStarted) {
        draw()
      }
    }

    window.addEventListener("resize", handleResize)

    // Initial setup
    handleResize()
    draw()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [gameStarted])

  // Handle canvas click
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      initGame()
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-xl font-bold">Asteroids</h2>
        <p className="text-sm">Use arrow keys to move, space to shoot. Click to start.</p>
      </div>
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full bg-black"
          onClick={handleCanvasClick}
          tabIndex={0}
        />
      </div>
    </div>
  )
}
