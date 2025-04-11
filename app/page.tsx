import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Blog from "@/components/blog"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <Hero />
      <About />
      <Blog />
      <Contact />
      <Footer />
    </main>
  )
}
