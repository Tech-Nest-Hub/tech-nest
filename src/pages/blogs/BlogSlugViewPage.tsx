import SanityClient from "@/sanity/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface SanityImageAsset {
  _id: string;
  url: string;
}

interface SanityMainImage {
  asset: SanityImageAsset;
  alt?: string;
}

interface SlugPost {
  _id?: string;
  title: string;
  slug: {
    current: string;
  };
  body?: Array<{
    children?: Array<{
      text?: string;
    }>;
  }>;
  mainImage?: SanityMainImage;
  authorName?: string;
}

const BlogSlugViewPage = () => {
  const [slugPost, setSlugPost] = useState<SlugPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    if (!slug) return;

    setIsLoading(true);
    SanityClient.fetch(
      `*[slug.current == "${slug}"]{
        _id,
        title,
        slug,
        body,
        mainImage{
          asset->{
            _id,
            url
          },
          alt
        },
        "authorName": author->name,
      }`
    )
      .then((data: SlugPost[]) => {
        setSlugPost(data[0] || null);
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!slugPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {slugPost.mainImage && (
            <img 
              src={slugPost.mainImage.asset.url} 
              alt={slugPost.mainImage.alt || slugPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {slugPost.title}
            </h1>
            
            {slugPost.authorName && (
              <p className="text-gray-600 mb-6">
                By {slugPost.authorName}
              </p>
            )}

            <div className="prose max-w-none text-gray-700">
              {slugPost.body?.map((block, index) => (
                <div key={index}>
                  {block.children?.map((child, childIndex) => (
                    <p key={childIndex} className="mb-4 leading-relaxed">
                      {child.text}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogSlugViewPage;