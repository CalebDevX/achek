// src/pages/BlogSingle.tsx
import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { blogPosts } from "@/pages/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/seo";

// AdSense component
const AdSenseAd = ({
  slot,
  format = "auto",
  layout,
  position,
}: {
  slot: string;
  format?: string;
  layout?: string;
  position: string;
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.log("Adsbygoogle error", e);
    }
  }, []);

  return (
    <div className="my-6 w-full text-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: layout ? "center" : "initial" }}
        data-ad-client="ca-pub-5807971758805138"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        data-ad-layout={layout}
      ></ins>
    </div>
  );
};

export default function BlogSingle() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">404 - Post Not Found</h1>
          <p className="text-muted-foreground">
            The article you’re looking for doesn’t exist or may have been moved.
          </p>
          <Link href="/blog">
            <a className="text-blue-600 hover:underline mt-4 inline-block">
              ← Back to Blog
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = "https://achek.com.ng";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const postImage = post.imageUrl || `${baseUrl}/achek-logo.png`;

  // SEO meta tags
  const seo = {
    title: `${post.title} | Achek Digital Solutions Blog`,
    description: post.excerpt,
    canonical: postUrl,
    keywords: `${post.category}, Achek blog, web development, digital marketing, Nigeria`,
    ogImage: postImage,
    ogType: "article",
    ogTitle: post.title,
    ogDescription: post.excerpt,
    twitterCard: "summary_large_image",
    twitterTitle: post.title,
    twitterDescription: post.excerpt,
    twitterImage: postImage,
    author: post.author,
    robots: "index, follow",
    language: "en",
  };

  // Structured data
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: postImage,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Achek Digital Solutions",
      logo: { "@type": "ImageObject", url: `${baseUrl}/achek-logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <div className="pt-28 max-w-6xl mx-auto px-4 lg:flex gap-10">
      <SEO {...seo} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Main Content */}
      <article className="lg:w-2/3">
        <AdSenseAd slot="5947626241" position="Blog Top" />

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          <span>{new Date(post.date).toLocaleDateString("en-US")}</span> • <span>{post.author}</span>
          <Badge>{post.category}</Badge>
        </div>

        <img
          src={postImage}
          alt={post.title}
          className={`rounded-xl object-cover object-center mb-6
            ${post.imageUrl === "https://i.ibb.co/N6c9yZ7W/caleb1.jpg" ? "w-[400px] h-[550px] mx-auto" : "w-full h-80"}
          `}
        />

        <div className="prose dark:prose-invert max-w-none">
          {post.content.map((paragraph, index) => (
            <div key={index}>
              <p className="mb-4">{paragraph}</p>
              {index === 1 && <AdSenseAd slot="1469379080" format="fluid" layout="in-article" position="In-Article #1" />}
              {index === 3 && <AdSenseAd slot="7519233378" format="fluid" layout="in-article" position="In-Article #2" />}
            </div>
          ))}
        </div>

        <AdSenseAd slot="6530134072" position="Blog Bottom" />
      </article>

      {/* Sidebar */}
      <aside className="lg:w-1/3 lg:sticky lg:top-28 mt-10 lg:mt-0 space-y-6">
        <AdSenseAd slot="4893070033" position="Sidebar Top" />

        <div className="p-4 border rounded-lg shadow-sm bg-card dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-3">Related Posts</h2>
          <ul className="space-y-2 text-primary">
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 5)
              .map((related) => (
                <li key={related.slug}>
                  <Link href={`/blog/${related.slug}`}>
                    <a className="hover:underline text-sm">{related.title}</a>
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <AdSenseAd slot="8382217895" position="Sidebar Bottom" />
      </aside>
    </div>
  );
}
