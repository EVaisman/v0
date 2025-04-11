export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
        <div className="max-w-md mx-auto">
          <p className="text-center text-gray-700 mb-6">
            I'm always open to new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="text-center">
            <a href="mailto:your.email@example.com" className="text-blue-600 hover:underline">
              your.email@example.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
