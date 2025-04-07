// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
      <p className="mb-4">This is the homepage. Check out the blog!</p>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-blue-500 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-blue-500 hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/blog" className="text-blue-500 hover:underline">
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
