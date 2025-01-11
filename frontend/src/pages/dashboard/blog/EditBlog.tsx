import { useEffect, useState } from 'react';
import Button from '@/components/forms/Button';
import Input from '@/components/forms/Input';
import Alert from '@/components/Alert';
import MediumAPI from '@/utilities/api';
import { createBlogSchema, createBlogType } from '@/schema/blogSchema';
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-toastify';
import { BlogType, CreateBlogType } from '@/types';
import Spinner from '@/components/Spinner';
import { useParams } from 'react-router-dom';

export default function EditBlog() {

    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null)
    const [blog, setBlog] = useState<BlogType | null>(null)
    const { register, formState: { errors }, handleSubmit } = useForm<createBlogType>({
        defaultValues: {
            title: "",
            description: "",
        },
        resolver: zodResolver(createBlogSchema)
    });

    const { blogId } = useParams();

    /**
     * Fetch Blog
     */
    const fetchBlog = async () => {
        try {
            const { data: response } = await MediumAPI.get(`/blogs/${blogId}`)

            setBlog(response.data);
        } catch (error: any) {
            setFormError(error.message)
        }
    }

    /**
     * Send Request to create a Blog
     * @param data 
     */
    const handleBlogCreate: SubmitHandler<CreateBlogType> = async (data) => {

        setLoading(true)

        try {
            const { data: response } = await MediumAPI.post(`/blogs/${blogId}`, data);

            toast.success(response.message)

            setLoading(false)

        } catch (error: any) {
            setFormError(error.message)
            toast.error(error.message);

            setLoading(false)
        }

    }


    useEffect(() => {

        fetchBlog();

        return () => {
            setLoading(false);
            setFormError(null);
        }
    }, [blogId])

    return (
        <div className="w-full min-h-screen flex items-center justify-center">

            <div className="w-full lg:w-500 space-y-4">
                {formError ? <Alert variant="danger">
                    {formError}
                </Alert> : undefined}

                {loading ? <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="text-4xl font-bold">
                        Please wait...
                    </div>
                    <Spinner size="xl" />
                </div> :

                    <form onSubmit={handleSubmit(handleBlogCreate)} className='space-y-4'>
                        <div className="space-y-2">
                            <label htmlFor="title" className="font-semibold">Title:</label>
                            <Input
                                placeholder="Title"
                                className="mb-4"
                                defaultValue={blog?.title}
                                {...register("title")}
                            />
                            {errors.title ? <p className="text-sm text-red-500">{errors.title.message}</p> : undefined}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="font-semibold">Description:</label>

                            <textarea
                                defaultValue={blog?.description}
                                className="w-full px-4 py-2 outline-none border rounded shadow"
                                rows={5}
                                {...register("description")}
                            />

                            {errors.description ? <p className="text-sm text-red-500">{errors.description.message}</p> : undefined}
                        </div>
                        <Button>
                            Create a new Blog
                        </Button>
                    </form>}
            </div>
        </div>
    )
}
