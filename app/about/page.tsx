// app/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">About Me</h1>
      <p className="mb-4 max-w-prose text-center">
        This is where you can write something about yourself or the purpose of
        this website. It's currently a static page within the Next.js project.
      </p>
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
