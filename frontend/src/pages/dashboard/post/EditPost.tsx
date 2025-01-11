import { useCallback, useEffect, useState } from 'react'
import Alert from '@/components/Alert';
import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import PostEditor from './PostEditor';
import MediumAPI from '@/utilities/api';
import { BlogType, CreatePostType, PostType } from '@/types';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPost() {

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const [post, setPost] = useState<PostType | null>(null)
  const [selectedBlog, setSelectedBlog] = useState("");
  const [textareaContent, setTextAreaContent] = useState<string | null>(post?.content || null)

  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePostType>()

  /**
   * Fetch Blog List by User
   */
  const fetchBlogs = async () => {
    try {
      const { data: response } = await MediumAPI.get("/blogs/users");

      setBlogs(response.data);
    } catch (error: any) {
      setError(error?.message)
    }
  }

  /**
   * Fetch Blog List by User
   */
  const fetchPost = async () => {

    setLoading(true);

    try {
      const { data: response } = await MediumAPI.get(`/posts/${postId}`);

      setPost(response.data);

      setLoading(false);
    } catch (error: any) {
      setError(error?.message)
      setLoading(false);
    }
  }

  /**
   * Create a new Blog Post
   * @param data
   */
  const updatePost: SubmitHandler<CreatePostType> = async (data) => {

    setError(null);

    if (!selectedBlog) {
      toast.error("Please select a Blog to continue")
      setError("Please select a Blog to continue");
      return false;
    }

    if (textareaContent) {
      data.content = textareaContent;
    } else {
      data.content = post?.content || "";
    }

    try {

      const { data: response } = await MediumAPI.put(`/posts/${postId}`, data);

      toast.success(response?.message)

    } catch (error: any) {
      console.log(error);
      setError(error?.message)
      toast.error(error?.message)
    }
  }

  /**
   * Get Editor Content
   * @param content 
   */
  function handleEditorChange(content: string) {
    setTextAreaContent(content);
  }

  /**
   * Slugify
   */
  const slugTransform = useCallback((value: any) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);


  /**
   * Fetch Blogs List
   */
  useEffect(() => {

    fetchBlogs();

    return () => {
      setBlogs([])
    }
  }, [])


  /**
   * Slugify url
   */
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);


  /**
   * Fetch Post Data
   */
  useEffect(() => {

    fetchPost();

    return () => {
      setPost(null)
    }
  }, [postId])

  return (

    <div className="p-2 w-full">

      <h2 className="block text-center text-4xl font-semibold mb-4">Update Post</h2>

      {!post ? <h1>Loading...</h1> :

        <form encType="multipart/form-data" onSubmit={handleSubmit(updatePost)} className="block space-y-4 w-full p-4 border shadow-md rounded-md">
          {
            error ?
              <Alert variant="danger">
                {error}
              </Alert> :
              undefined
          }

          <div className="space-y-2">
            <label htmlFor="title" className="font-semibold">Select Blog:</label>

            <div className="relative w-full flex items-center justify-between rounded bg-slate-100">
              <select
                className="block w-full px-4 py-2 appearance-none rounded"
                {...register("blog_id", {
                  required: true,
                })}
                defaultValue={selectedBlog}
                onChange={(e) => setSelectedBlog(e.target.value)}
              >
                <option value={0}>Select a Blog</option>

                {blogs.length > 0 ? blogs.map((blog) => <option key={blog.id} value={blog.id}>{blog.title}</option>) : undefined}
              </select>
              <div className="absolute right-4 top-auto bottom-auto">
                <FaChevronDown />
              </div>
            </div>
            {errors.blog_id ? <p className="text-sm text-red-500">{errors.blog_id.message}</p> : undefined}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="font-semibold">Title:</label>
            <Controller
              name="title"
              defaultValue={post.title}
              control={control}
              render={({ field }) => <Input
                  {...field}
                  placeholder="Title"
                  className="mb-4"
                />
              }
            />
            {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : undefined}
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="font-semibold">Slug:</label>
            <Controller
              name="slug"
              defaultValue={post.slug}
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  placeholder="Slug"
                  className="mb-4"
                />
              }
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="font-semibold">Description:</label>

            <PostEditor content={post.content} handleEditorChange={handleEditorChange} />

            {errors.content ? <p className="text-sm text-red-500">{errors.content.message}</p> : undefined}
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">Update Post</Button>

            <Button variant="secondary" type="reset">Reset</Button>
          </div>
        </form>}
    </div>
  )
}
