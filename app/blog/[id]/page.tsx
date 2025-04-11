import Header from "@/components/header"
import Footer from "@/components/footer"
import { notFound } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "My First Blog Post",
    content: "This is the full content of my first blog post...",
    date: "2023-04-15",
  },
  {
    id: "2",
    title: "Reflections on Web Development",
    content: "Here's a detailed look at the ever-changing landscape of web development...",
    date: "2023-04-22",
  },
  {
    id: "3",
    title: "The Importance of Continuous Learning",
    content: "In this post, we explore why it's crucial to keep learning in the tech industry...",
    date: "2023-04-29",
  },
  // Add more blog posts here
]

export default function BlogPost({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <article className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-6">{post.date}</p>
          <div className="prose">{post.content}</div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
