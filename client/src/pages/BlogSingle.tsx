// src/pages/BlogSingle.tsx
import { useEffect } from "react";
import { useParams } from "wouter";
import { blogPosts } from "@/pages/data/blogPosts";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/seo";
import { Link } from "wouter";

export default function BlogSingle() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog">
            <a className="text-blue-600 hover:underline">← Back to Blog</a>
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = "https://achek.com.ng";
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const postImage = post.imageUrl || `${baseUrl}/achek-logo.png`;

  // SEO configuration for individual blog post
  const seo = {
    title: `${post.title} | Achek Digital Solutions Blog`,
    description: post.excerpt,
    canonical: postUrl,
    keywords: `${post.category}, ${post.title}, Achek blog, Nigeria tech blog, ${post.author}`,
    ogImage: postImage,
    ogType: "article",
    author: post.author,
  };

  // Structured data for BlogPosting
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: postImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Achek Digital Solutions",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/achek-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <SEO {...seo} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/">
            <a className="hover:text-primary">Home</a>
          </Link>
          {" / "}
          <Link href="/blog">
            <a className="hover:text-primary">Blog</a>
          </Link>
          {" / "}
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* Category Badge */}
        <Badge className="mb-4">{post.category}</Badge>

        {/* Post Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Post Meta */}
        <div className="flex items-center gap-4 mb-8 text-muted-foreground">
          <span>By {post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        {/* Featured Image */}
        <img
          src={postImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          loading="eager"
        />

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share Section */}
        <div className="border-t border-b py-6 my-8">
          <p className="text-sm font-semibold mb-3">Share this post:</p>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Facebook
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + " " + postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-12">
          <Link href="/blog">
            <a className="inline-flex items-center text-primary hover:underline">
              ← Back to all posts
            </a>
          </Link>
        </div>
      </article>
    </div>
  );
}nt
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
        </div>
      </div>
    );
  }

  // Dynamic SEO meta tags for each blog post
  const seo = {
    title: `${post.title} | Achek Digital Solutions Blog`,
    description: post.excerpt,
    canonical: `https://achek.com.ng/blog/${post.slug}`,
    keywords: `${post.category}, Achek blog, web development, digital marketing, Nigeria, Africa`,
    ogImage: post.imageUrl,
    ogType: "article",
    ogTitle: post.title,
    ogDescription: post.excerpt,
    twitterCard: "summary_large_image",
    twitterTitle: post.title,
    twitterDescription: post.excerpt,
    twitterImage: post.imageUrl,
    author: post.author,
    robots: "index, follow",
    language: "en",
  };

  return (
    <div className="pt-28 max-w-6xl mx-auto px-4 lg:flex gap-10">
      <SEO {...seo} />

      {/* Main Content */}
      <article className="lg:w-2/3">
        {/* Blog Top Ad */}
        <AdSenseAd slot="5947626241" position="Blog Top" />

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          <span>{post.date}</span>•<span>{post.author}</span>
          <Badge>{post.category}</Badge>
        </div>

        {/* ✅ Conditional portrait image */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className={`rounded-xl object-cover object-center mb-6
            ${post.imageUrl === "https://i.ibb.co/N6c9yZ7W/caleb1.jpg" 
              ? "w-[400px] h-[550px] mx-auto"  // ✅ more balanced portrait size
              : "w-full h-80"}                 // normal landscape
          `}
        />


        {/* ✅ Dark mode compatible typography */}
        <div className="prose dark:prose-invert max-w-none">
          {post.content.map((paragraph, index) => (
            <div key={index}>
              <p className="mb-4">{paragraph}</p>
              {index === 1 && (
                <AdSenseAd
                  slot="1469379080"
                  format="fluid"
                  layout="in-article"
                  position="In-Article #1"
                />
              )}
              {index === 3 && (
                <AdSenseAd
                  slot="7519233378"
                  format="fluid"
                  layout="in-article"
                  position="In-Article #2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Blog Bottom Ad */}
        <AdSenseAd slot="6530134072" position="Blog Bottom" />
      </article>

      {/* Sidebar */}
      <aside className="lg:w-1/3 lg:sticky lg:top-28 mt-10 lg:mt-0 space-y-6">
        {/* Sidebar Top Ad */}
        <AdSenseAd slot="4893070033" position="Sidebar Top" />

        <div className="p-4 border rounded-lg shadow-sm bg-card dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-3">Related Posts</h2>
          <ul className="space-y-2 text-primary">
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 5)
              .map((related) => (
                <li key={related.slug}>
                  <a
                    href={`/blog/${related.slug}`}
                    className="hover:underline text-sm"
                  >
                    {related.title}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        {/* Sidebar Bottom Ad */}
        <AdSenseAd slot="8382217895" position="Sidebar Bottom" />
      </aside>
    </div>
  );
}
