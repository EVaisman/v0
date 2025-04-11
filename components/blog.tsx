import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "My First Blog Post",
    excerpt: "This is a short excerpt from my first blog post...",
    date: "2023-04-15",
  },
  {
    id: "2",
    title: "Reflections on Web Development",
    excerpt: "Thoughts on the ever-changing landscape of web development...",
    date: "2023-04-22",
  },
  {
    id: "3",
    title: "The Importance of Continuous Learning",
    excerpt: "Why it's crucial to keep learning in the tech industry...",
    date: "2023-04-29",
  },
]

export default function Blog() {
  return (
    <section id="blog" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
        <div className="grid gap-8 max-w-2xl mx-auto">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.id}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  )
}
