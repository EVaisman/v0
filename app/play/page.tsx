import Header from "@/components/header"
import Footer from "@/components/footer"
import AsteroidsGame from "@/components/asteroids-game"

export default function PlayPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Asteroids Game</h1>
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden" style={{ height: "70vh" }}>
            <AsteroidsGame />
          </div>
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold mb-2">How to Play</h2>
            <ul className="text-gray-700 list-disc list-inside">
              <li>
                <strong>Click anywhere on the game</strong> to start
              </li>
              <li>
                Use <strong>Arrow Keys</strong> to control your ship:
                <ul className="ml-6 list-disc list-inside">
                  <li>↑ (Up Arrow) for thrust</li>
                  <li>← → (Left/Right Arrows) to rotate</li>
                </ul>
              </li>
              <li>
                Press <strong>Space</strong> to shoot asteroids
              </li>
              <li>Destroy all asteroids to advance to the next level</li>
              <li>Avoid collisions with asteroids</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
