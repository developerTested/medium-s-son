import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/forms/Button";
import Input from "@/components/forms/Input";
import Logo from "@/components/Logo";
import { useForm, SubmitHandler } from "react-hook-form";
import MediumAPI from "@/utilities/api";
import Spinner from "@/components/Spinner";

interface IFormInput {
    email: string;
}

export default function ForgotPassword() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            await MediumAPI.post("/user/password/forgot", {
                email: data.email
            });

            setSuccess(true);
        } catch (error: any) {
            setError(error.message)
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg w-full space-y-8 bg-white p-4 rounded-xl shadow-lg">
            <Link to={"/"} className="block text-center mb-4">
                <Logo className="text-4xl" />
            </Link>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Forgot Password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a recovery link
                </p>
            </div>

            {success ?
                <div
                    className="bg-success text-white border border-green-400  px-4 py-3 rounded relative"
                    role="alert"
                >
                    <p className="text-sm text-center">
                        If this email is registered, you will receive a recovery link shortly.
                    </p>
                </div> : undefined}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email address
                        </label>

                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email address"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format",
                                },
                            })}
                        />
                        {errors.email ? <p className='text-red-600 text-xs my-1'>
                            {errors.email.message}
                        </p> : ''}
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center" role="alert">
                        {error}
                    </div>
                )}

                <Button size="lg" disabled={loading} fullWidth>
                    {loading ? <Spinner /> : "Send Recovery Link"}
                </Button>

            </form>
            <p className="block text-center">
                Go back to login <Link to={"/auth/login"} className="font-bold">Sign in</Link>
            </p>
        </div>
    );
};