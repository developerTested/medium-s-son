import { useEffect, useState } from 'react'
import { PostType } from '@/types';
import MediumAPI from '@/utilities/api';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setPosts } from '@/redux/slices/postSlice';
import PostItemCard from '@/components/cards/PostItemCard'

export default function HomePage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const dispatch = useAppDispatch();

    const { posts } = useAppSelector((state) => state.post);

    const fetchPostList = async () => {
        setLoading(true);
        try {
            const { data: response } = await MediumAPI.get("/posts");

            dispatch(setPosts(response.data));

            setLoading(false);
        } catch (error: any) {
            setError(error?.message)
        }
    }

    useEffect(() => {
        fetchPostList();

        return () => {
            dispatch(setPosts([]));
        }
    }, [dispatch])

    return (
        <div className="flex gap-4 mt-4">

            {loading ?
                <div className="w-full space-y-4">
                    {Array.from(new Array(20)).map((_, i) => <PostItemCard key={i} />)}
                </div>
                :
                <div className="w-full space-y-4">
                    {
                        posts.length > 0 ?
                            posts.map((post: PostType) => <PostItemCard key={post.id} post={post} />) :
                            undefined
                    }
                </div>}
            <div className="hidden lg:block lg:w-500">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Sidebar</h2>
                    <p className="text-gray-600">This is a sidebar</p>
                </div>
            </div>
        </div>
    )
}
