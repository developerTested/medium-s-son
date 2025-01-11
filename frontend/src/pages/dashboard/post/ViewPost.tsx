import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import MediumAPI from '@/utilities/api';
import DOMPurify from 'dompurify';
import { formatDate } from '@/utilities/helper';
import Avatar from '@/components/Avatar';
import { PiHandsClappingThin } from "react-icons/pi";
import { FaComment } from "react-icons/fa6"
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { FiShare } from "react-icons/fi";
import Button from '@/components/forms/Button';
import CommentCard from '@/components/cards/CommentCard';
import Alert from '@/components/Alert';
import { toast } from 'react-toastify';
import NewCommentForm from '@/components/forms/NewCommentForm';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { resetComments, resetPost, setComments, setPost } from '@/redux/slices/postSlice';

export default function ViewPost() {
  const [error, setError] = useState<string | null>(null)
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const { slug } = useParams();
  const dispatch = useAppDispatch()
  const { post, comments } = useAppSelector((state) => state.post)

  /**
   * Fetch Post by ID
   */
  const fetchPost = async () => {
    try {
      const { data: response } = await MediumAPI.get(`/posts/${slug}`);

      const fetchedPost = response.data;

      const { data: hasLikedResponse } = await MediumAPI.get(`/posts/${fetchedPost.id}/like`);

      dispatch(setPost(fetchedPost));
      setLikeCount(response.data._count.likes || 0)
      setHasLiked(hasLikedResponse.data.hasLiked);

      dispatch(setComments(response.data.comments));

    } catch (error: any) {
      setError(error?.message)
    }
  }

  /**
   * Handle Like Post
   */
  const handleLike = async () => {
    try {

      const response = await MediumAPI.post(`/posts/${post?.id}/like`);

      const res = response.data;

      setLikeCount(res.data.likes);

      setHasLiked(res.data.hasLiked)

      toast.success(res?.message || "You've liked the post");

    } catch (err: any) {
      setError(err?.message);
    }
  }

  /**
   * Gat data when post slug change
   */
  useEffect(() => {

    fetchPost();

    return () => {
      dispatch(resetPost());
      dispatch(resetComments());
      setLikeCount(0);
      setHasLiked(false);
    }

  }, [slug, dispatch])

  if (!post) {
    return <div>Loading...</div>
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="w-full lg:max-w-2xl block mx-auto mt-14 space-y-4">
      {error ? <Alert variant="danger">
        {error}
      </Alert> : undefined}
      <div className="flex flex-col bg-white rounded">
        {post?.featuredImage ?
          <div className="poster relative w-full h-60">
            <figure className="absolute size-full object-cover">
              <img src={post.featuredImage} alt={post.title} className="size-full object-cover" />
            </figure>
          </div> : undefined}

        <section className="px-4 py-2 shadow">
          <h1 className="text-4xl font-semibold">{post.title}</h1>

          <div className="profile-card flex items-center gap-4 my-4">
            <Avatar alt={post.author.display_name} size="normal" />
            <div className='profile-info space-y-1'>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">{post.author.display_name}</h2>
                <span className='text-slate-100'>·</span>

                <Button type="button" size="sm">
                  Follow
                </Button>
              </div>
              {post.blog_id ?
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  Published in {post.blog.title}
                  <span className=''>·</span>
                  {formatDate(post.createdAt)}
                </p> :
                <p className="text-gray-500 text-sm">
                  Published on {formatDate(post.createdAt)}
                </p>}
            </div>
          </div>

          <div className="post-actions flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-4">
                <div onClick={handleLike} className={`p-2 cursor-pointer flex items-center justify-center border ${hasLiked ? "border-black" : ""} rounded-full`}>
                  {hasLiked ? <PiHandsClappingThin className="w-6 h-6" />
                    :
                    <PiHandsClappingThin className="w-6 h-6" />}
                </div>

                {likeCount}
              </div>

              <div className="flex items-center gap-4">
                <FaComment className="w-6 h-6" />
                {post?._count?.comments || 0}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MdOutlineBookmarkAdd className="w-6 h-6" />

              <FiShare className="w-6 h-6" />
            </div>

          </div>

          <section className="my-4">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
          </section>
        </section>
      </div>

      <div className="block bg-white border rounded shadow px-4 py-2 space-y-4">
        <h3 className="font-semibold text-2xl border-b ">Comments</h3>

        <NewCommentForm postId={post.id} />

        <div className="block p-2 space-y-4">
          {comments.length > 0 ? comments.map((comment, i) => <CommentCard key={i} comment={comment} />) :
            <Alert>
              No Comments!
            </Alert>
          }
        </div>
      </div>
    </div>
  );
}
