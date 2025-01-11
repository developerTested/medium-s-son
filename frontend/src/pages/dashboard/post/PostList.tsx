import { useEffect, useState } from 'react'
import { PostType } from '@/types';
import MediumAPI from '@/utilities/api';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setPosts } from '@/redux/slices/postSlice';
import PostItemCard from '@/components/cards/PostItemCard';

export default function PostList() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const dispatch = useAppDispatch();

    const { posts } = useAppSelector((state) => state.post);

    const fetchPostList = async () => {
        try {
            const { data: response } = await MediumAPI.get("/posts");

            dispatch(setPosts(response.data));
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
        <div className="w-full space-y-4">
            <h2 className="w-full block text-4xl text-center my-4">
                Posts List
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 my-4">
                {posts.length > 0 ?
                    posts.map((post: PostType) => <PostItemCard post={post} />)
                    : <div className="text-4xl font-bold">No Posts found!</div>}
            </div>
        </div>
    )
}
