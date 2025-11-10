import SanityClient from "@/sanity/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SanityImageAsset {
  _id: string;
  url: string;
}

interface SanityMainImage {
  asset: SanityImageAsset;
  alt?: string;
}

interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  body?: Array<{
    children?: Array<{
      text?: string;
    }>;
  }>;
  publishedAt: string;
  mainImage?: SanityMainImage;
}

const Blogs = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    SanityClient.fetch(
      `*[_type== "post"] {
       _id,
       title,
       slug,
       body,
       publishedAt,
       mainImage{
        asset->{
         _id,
         url
       },
       alt
     },
       }`
    )
      .then((data: Post[]) => setPosts(data))
      .catch(console.error);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mt-20 text-4xl font-bold text-gray-900 text-center mb-4">Blogs</h1>
        <h2 className="text-lg text-gray-600 text-center mb-12">
          You are viewing {posts.length} posts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.mainImage && (
                <img 
                  src={post.mainImage.asset.url} 
                  alt={post.mainImage.alt || post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="text-gray-600 mb-4 line-clamp-3">
                  {post.body && post.body[0]?.children?.[0]?.text 
                    ? `${post.body[0].children[0].text.substring(0, 150)}...`
                    : 'No content available'
                  }
                </div>
                <Link to={`/blog/${post.slug.current}`}>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;