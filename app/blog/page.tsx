import Header from "@/components/header"
import Footer from "@/components/footer"
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
  // Add more blog posts here
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">My Blog</h1>
        <div className="grid gap-8 max-w-2xl mx-auto">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.id}`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
