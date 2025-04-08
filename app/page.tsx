// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Typewriter from "../public/typewriter.jpg";

export default function Home() {
  return (
    <div className="w-full ">
      <main
        className={` bg-[url('../public/typewriter.jpg')] bg-cover flex min-h-screen flex-col items-center p-24`}
      >
        <h1 className="text-4xl font-bold mb-8 text-white">
          Welcome to My Blog
        </h1>
        <p className="mb-4 text-white">
          This is the homepage. Check out the blog!
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
      <div>More content!</div>
    </div>
  );
}
