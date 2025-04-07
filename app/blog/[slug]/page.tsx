// app/blog/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { notFound } from "next/navigation";
import contentfulClient from "@/lib/contentfulClient"; // Adjust path if needed
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import type { Entry, Asset, EntrySkeletonType } from "contentful";

// Define the full shape of our Blog Post entry for this page
interface BlogPostPageEntry extends EntrySkeletonType {
  fields: {
    title: string;
    slug: string;
    publicationDate: string;
    content: Document; // Rich Text field type
    coverImage?: Asset; // Optional cover image
  };
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Function to fetch a single blog post by slug
async function getBlogPost(
  slug: string
): Promise<Entry<BlogPostPageEntry> | null> {
  try {
    const queryOptions = {
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1, // We only expect one entry for a unique slug
      include: 2, // Include linked assets (like cover image) up to 2 levels deep
    };
    const queryResult = await contentfulClient.getEntries<BlogPostPageEntry>(
      queryOptions
    );

    if (queryResult.items.length > 0) {
      return queryResult.items[0];
    }
    return null; // Not found
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

// --- Rich Text Renderer Options ---
// Customize how different Rich Text elements are rendered
const renderOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-4xl font-bold mb-4 mt-6">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-3xl font-bold mb-3 mt-5">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-2xl font-bold mb-2 mt-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-4 pl-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-4 pl-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any, children: React.ReactNode) => {
      // Ensure asset is linked and has file details
      if (node.data?.target?.fields?.file?.url) {
        const asset = node.data.target;
        const { url, details } = asset.fields.file;
        const { width, height } = details.image || {
          width: undefined,
          height: undefined,
        };
        const alt = asset.fields.title || "Blog post image";

        // Prepend https: if URL starts with //
        const imageUrl = url.startsWith("//") ? `https:${url}` : url;

        return (
          <div className="my-6">
            {" "}
            {/* Add margin around the image */}
            <Image
              src={imageUrl}
              alt={alt}
              width={width}
              height={height}
              className="max-w-full h-auto rounded-lg shadow" // Style the image
            />
            {asset.fields.description && (
              <p className="text-sm text-gray-600 mt-1 text-center italic">
                {asset.fields.description}
              </p>
            )}
          </div>
        );
      }
      return null; // Don't render if asset data is incomplete
    },
    // Add more renderers for other blocks/inlines/marks as needed
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => (
      <strong className="font-bold">{text}</strong>
    ),
    [MARKS.ITALIC]: (text: React.ReactNode) => (
      <em className="italic">{text}</em>
    ),
    [MARKS.UNDERLINE]: (text: React.ReactNode) => (
      <u className="underline">{text}</u>
    ),
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 text-red-600 p-1 rounded text-sm font-mono">
        {text}
      </code>
    ),
  },
};
// --- End Rich Text Renderer Options ---

// Generate static paths for all blog posts at build time
export async function generateStaticParams() {
  try {
    const queryResult = await contentfulClient.getEntries<BlogPostPageEntry>({
      content_type: "blogPost",
      select: ["fields.slug"], // Only fetch slugs
    });

    return queryResult.items.map((item) => ({
      slug: item.fields.slug,
    }));
  } catch (error) {
    console.error("Error fetching slugs for static generation:", error);
    return [];
  }
}

// The Page component
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const post = await getBlogPost(slug);

  // If post is not found, render the 404 page
  if (!post) {
    notFound();
  }

  const { title, publicationDate, content, coverImage } = post.fields;
  const coverImageUrl = coverImage?.fields?.file?.url;
  const coverImageAlt = coverImage?.fields?.title || title; // Use post title as fallback alt text
  const formattedImageUrl =
    coverImageUrl && coverImageUrl.startsWith("//")
      ? `https:${coverImageUrl}`
      : coverImageUrl;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24">
      <nav className="mb-8 self-start">
        <Link href="/blog" className="text-blue-500 hover:underline">
          &larr; Back to Blog
        </Link>
      </nav>

      <article className="prose lg:prose-xl max-w-4xl w-full">
        {" "}
        {/* Using Tailwind prose for nice typography */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 text-md mb-6">
          Published on: {new Date(publicationDate).toLocaleDateString()}
        </p>
        {/* Render Cover Image if it exists */}
        {formattedImageUrl && (
          <div className="mb-8">
            <Image
              src={formattedImageUrl}
              alt={coverImageAlt}
              width={coverImage.fields.file.details.image?.width || 800} // Provide width/height
              height={coverImage.fields.file.details.image?.height || 400}
              priority // Prioritize loading the main image
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {coverImage.fields.description && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {coverImage.fields.description}
              </p>
            )}
          </div>
        )}
        {/* Render Rich Text Content */}
        <div>{documentToReactComponents(content, renderOptions)}</div>
      </article>
    </main>
  );
}

// Optional: Revalidate individual posts less frequently or use on-demand revalidation
export const revalidate = 300; // Revalidate every 5 minutes
