import { useCallback, useEffect, useState } from 'react'
import Alert from '@/components/Alert';
import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import MediumAPI from '@/utilities/api';
import PostEditor from './PostEditor';
import { BlogType, CreatePostType } from '@/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useFilePreview from '@/hooks/useFilePreview';

export default function PostCreate() {

  const [error, setError] = useState<string | null>(null)
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const [selectedBlog, setSelectedBlog] = useState("");
  const [textareaContent, setTextAreaContent] = useState<string | null>(null)

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreatePostType>({
    defaultValues: {
      blog_id: "",
      title: "",
      slug: "",
      content: "",
      status: "DRAFT"
    },
  })

  const tempFile = watch(["featuredImage"]);

  const [filePreview] = useFilePreview(tempFile[0]);


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
   * Create a new Blog Post
   * @param data
   */
  const createPost: SubmitHandler<CreatePostType> = async (data) => {

    if (!textareaContent) {
      setError("Post content is required!")
      return false;
    }

    if (textareaContent) {
      data.content = textareaContent;
    }

    if (data.featuredImage) {
      data.featuredImage = data.featuredImage[0]
    }

    try {

      const { data: response } = await MediumAPI.post(`/posts`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success(response?.message)

      navigate(`/posts/${response?.data?.id}/edit`)

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


  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);


  useEffect(() => {

    fetchBlogs();

    return () => {
      setBlogs([])
    }
  }, [])

  return (

    <div className="p-2 w-full">

      <h2 className="block text-center text-4xl font-semibold mb-4">Create a new Post</h2>

      <form encType="multipart/form-data" onSubmit={handleSubmit(createPost)} className="block space-y-4 w-full p-4 border shadow-md rounded-md">

        <div className="flex justify-between gap-4">
          <div className="post-form w-full grow">
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
              <Input
                placeholder="Title"
                className="mb-4"
                {...register("title")}
              />
              {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : undefined}
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="font-semibold">Slug:</label>
              <Input
                placeholder="Slug"
                className="mb-4"
                {...register("slug")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="font-semibold">Description:</label>

              <PostEditor handleEditorChange={handleEditorChange} />

              {errors.content ? <p className="text-sm text-red-500">{errors.content.message}</p> : undefined}
            </div>
          </div>

          <div className="w-80 space-y-4">
            <div className="space-y-2">
              <label htmlFor="featuredImage" className="font-semibold">Featured Image:</label>

              <Input
                type="file"
                placeholder="Featured Image"
                accept="image/*"
                className="mb-4"
                {...register("featuredImage")}
              />

              {filePreview ? <img src={filePreview} /> : ""}

              {errors.featuredImage ? <p className="text-sm text-red-500">{errors.featuredImage.message}</p> : undefined}
            </div>
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="status" className="font-semibold">Status</label>

              <select
                id="status"
                className="px-4 py-2 appearance-none"
                {...register("status")}
              >
                <option value={"DRAFT"} disabled>DRAFT</option>
                <option value={"PUBLISH"}>PUBLISH</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit">Create Post</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
