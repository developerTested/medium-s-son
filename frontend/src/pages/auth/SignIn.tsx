import { useState } from 'react'
import Button from '@/components/forms/Button'
import Input from '@/components/forms/Input'
import Logo from '@/components/Logo'
import Alert from '@/components/Alert'
import Spinner from '@/components/Spinner'
import { loginBody, LoginSchema } from '@/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks'
import { login } from '@/redux/slices/actions/auth'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { decodeJwtResponse } from '@/utilities/helper'
import { setSocialUser } from '@/redux/slices/authSlice'
import MediumAPI from '@/utilities/api'

export default function SignIn() {

    const [passwordShow, setPasswordShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(LoginSchema),
    })

    /**
     * Do Login
     * @param data 
     */
    const onSubmit: SubmitHandler<loginBody> = async (data) => {

        setLoading(true);

        try {
            setError('');
            const response = await dispatch(login(data)).unwrap();
            toast.success(response ? response.message : 'Welcome Back!');
            navigate('/');
        } catch (error: any) {
            const errorMessage = Array.isArray(error?.errors) && error?.errors?.length ? error.errors : error.message;
            setLoading(false);
            setError(errorMessage);
            toast.error(errorMessage);
        }
    }


    const handleSocialLogin = async (credentialResponse?: string) => {

        if (!credentialResponse) {
            toast.error("Login failed")

            return false;
        }

        const decodeToken = decodeJwtResponse(credentialResponse);

        const socialUser = {
            email: decodeToken.email,
            display_name: `${decodeToken.given_name} ${decodeToken.family_name}`,
            avatar: decodeToken.picture,
            social_id: decodeToken.sub,
            social_provider: "google",
        }

        try {

            const registerData = {
                ...socialUser,
                user_name: socialUser.display_name.toLowerCase().replace(/ /g, '_')
            }

            const { data: response } = await MediumAPI.post("/user/social", registerData)

            dispatch(setSocialUser(response))
        } catch (error) {
            toast.error("Error while Logging user")
        }

    }

    return (
        <div className="p-2 w-full max-w-xl rounded-md flex flex-col gap-4">
            <Link to={"/"} className="block text-center mb-4">
                <Logo className="text-4xl" />
            </Link>

            <h1 className="text-4xl font-semibold text-center">Welcome back.</h1>

            {error ? <Alert variant="danger">
                {error}
            </Alert> : undefined}


            <GoogleLogin
                onSuccess={credentialResponse => handleSocialLogin(credentialResponse.credential)}
                onError={() => toast.error("Login Failed!")}
                size="large"
                width={"100%"}
            />

            <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <p className="mx-2 text-gray-500">OR</p>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative p-4 bg-white rounded-xl shadow-lg">
                <div className="block space-y-2">
                    <label htmlFor="email" className="block text-sm">Email</label>
                    <Input
                        disabled={loading}
                        type="email"
                        id='email'
                        placeholder='Email'
                        className={`${errors.email ? 'border-red-600' : ''} w-full px-4 py-2 outline-none border`}
                        {...register('email')}
                    />
                    {errors.email ? <p className='text-red-600 text-xs my-1'>
                        {errors.email.message}
                    </p> : ''}
                </div>
                <div className="block space-y-2">
                    <label htmlFor="password" className="block text-sm">Password</label>
                    <div className="relative">
                        <Input
                            disabled={loading}
                            type={passwordShow ? 'text' : 'password'}
                            id='password'
                            placeholder='Password'
                            className={`${errors.password ? 'border-red-600' : ''} w-full px-4 py-2 outline-none border`}
                            {...register('password')}
                        />

                        <div onClick={() => setPasswordShow(!passwordShow)} className="cursor-pointer absolute top-0 bottom-0 right-2 flex items-center justify-center text-slate-400">
                            {passwordShow ? <FaEye className='w-6 h-6' /> : <FaEyeSlash className='w-6 h-6' />}
                        </div>
                    </div>
                    {errors.password ? <p className='text-red-600 text-xs my-1'>
                        {errors.password.message}
                    </p> : ''}
                </div>

                <div className="w-full flex items-center justify-between">

                    <label htmlFor="remember" className="">
                        <input type="checkbox" name="remember" id="remember" className='mx-2' />
                        Remember me
                    </label>

                    <div className="block">
                        <Link to="/auth/forgot-password">
                            Forgot password?
                        </Link>
                    </div>

                </div>
                <Button size="lg" disabled={loading} fullWidth>
                    {loading ? <Spinner /> : 'Login'}
                </Button>
            </form>

            <p className='text-center my-4'>
                Don't have an account?
                <Link to="/auth/register" className='mx-2'>
                    Sign up
                </Link>
            </p>
        </div>
    )
}
