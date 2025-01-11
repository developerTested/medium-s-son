import Alert from '@/components/Alert';
import { BlogType } from '@/types';
import MediumAPI from '@/utilities/api';
import React, { useEffect, useState } from 'react'

export default function BlogList() {


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blogs, setBlogs] = useState<BlogType[]>([]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {

            const { data: response } = await MediumAPI.get("/blogs");

            setBlogs(response.data);

            setLoading(false);

        } catch (error: any) {
            setLoading(false);
            setError(error.message)
        }
    }

    useEffect(() => {

        fetchBlogs()

        return () => {
            setError(null);
            setBlogs([]);
        }
    }, [])

    return (
        <div className="p-4">
            <h1>Blog List</h1>

            {error ? <Alert variant="danger">
                {error}
            </Alert> : undefined}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {loading ? Array.from(new Array(5)).map((_, i) => <div key={i} className="">
                    Blog {i}
                </div>) :
                    blogs.length > 0 ? blogs.map((blog) => <div className="">
                        {blog.title}
                    </div>) : <Alert variant="info" className="grid-cols-full">
                        No Blogs found!
                    </Alert>
                }
            </div>
        </div>
    )
}
