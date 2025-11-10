import SanityClient from "@/sanity/client"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const BlogSlugViewPage = () => {
    const [setslugPost, setSetslugPost] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { slug } = useParams<{ slug: string }>()

    useEffect(()=> {
        SanityClient.fetch(
            `*[slug.current == "${slug}"]{
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
        ).then((data) => {
           setSetslugPost(data[0])
        }).catch(console.error)
    },[slug])

  return (
    <>
    {isLoading ? <div>Loading...</div> :
    <div className="mt-20
    ">BlogSlugViewPage</div>
}
    </>
  )
}

export default BlogSlugViewPage