import { SubmitHandler, useForm } from "react-hook-form"
import Button from "./Button";
import MediumAPI from "@/utilities/api";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/hooks";
import { addNewComment } from "@/redux/slices/postSlice";

type IForm = {
    content: string
}

type NewCommentFormType = {
    postId: string,
}

export default function NewCommentForm({ postId }: NewCommentFormType) {

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<IForm>();

    const dispatch = useAppDispatch();


    const submitComment: SubmitHandler<IForm> = async (data) => {
        try {

            const { data: response } = await MediumAPI.post(`/posts/${postId}/comments`, data);

            dispatch(addNewComment(response.data))

            toast.success(response.message);
        } catch (error: any) {
            console.log(error);
            toast.error(error.message)
        }
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit(submitComment)} className="space-y-2">
                <div className="block w-full">
                    <textarea rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded outline-none focus:border-black"
                        placeholder="Enter your message"
                        {...register("content", {
                            required: true,
                        })}
                    ></textarea>
                    {errors.content ?
                        <p className="text-sm text-red-500">
                            Comment message is required!
                        </p> : undefined
                    }
                </div>
                <Button
                    type="submit"
                >
                    Comment
                </Button>
            </form>
        </div>
    )
}
