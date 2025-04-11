export default function Hero() {
  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to My Personal Website</h1>
        <p className="text-xl mb-8">I'm a [Your Profession] passionate about [Your Interests]</p>
        <a
          href="#contact"
          className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300"
        >
          Get in Touch
        </a>
      </div>
    </section>
  )
}
