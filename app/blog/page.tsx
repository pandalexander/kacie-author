// app/blog/page.tsx
import Link from "next/link";
import contentfulClient from "@/lib/contentfulClient"; // Adjust path if needed
import { type Asset, type EntrySkeletonType, type Entry } from "contentful";

// Define the shape of our Blog Post entry
interface BlogPostEntry extends EntrySkeletonType {
  fields: {
    title: string;
    slug: string;
    publicationDate: string; // Stored as ISO string
    coverImage?: Asset; // Optional cover image
  };
}

// Function to fetch blog posts from Contentful
async function getBlogPosts(): Promise<Entry<BlogPostEntry>[]> {
  try {
    const entries = await contentfulClient.getEntries<BlogPostEntry>({
      content_type: "blogPost", // Matches the API ID in Contentful
      order: ["-fields.publicationDate"], // Order by date, newest first
      select: ["fields.title", "fields.slug", "fields.publicationDate"], // Select only needed fields
    });
    return entries.items;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return []; // Return empty array on error
  }
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <nav className="mb-8">
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

      <div className="grid gap-6 max-w-4xl w-full">
        {posts.length === 0 && <p>No blog posts found.</p>}

        {posts.map((post) => (
          <article
            key={post.sys.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">
              <Link
                href={`/blog/${post.fields.slug}`}
                className="text-blue-600 hover:underline"
              >
                {post.fields.title}
              </Link>
            </h2>
            <p className="text-gray-600 text-sm">
              Published on:{" "}
              {new Date(post.fields.publicationDate).toLocaleDateString()}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

// Optional: Revalidate data periodically or on-demand
export const revalidate = 60; // Revalidate data at most every 60 seconds
