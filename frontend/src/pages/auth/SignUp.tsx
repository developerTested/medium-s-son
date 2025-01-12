import { useState } from 'react'
import Button from '@/components/forms/Button'
import GoogleLoginButton from '@/components/forms/GoogleLoginButton'
import Input from '@/components/forms/Input'
import Logo from '@/components/Logo'
import Alert from '@/components/Alert'
import Spinner from '@/components/Spinner'
import { registerBody, RegisterSchema } from '@/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify'
import { useAppDispatch } from '@/hooks'
import { signUp } from '@/redux/slices/actions/auth'

export default function SignUp() {

    const [passwordShow, setPasswordShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<registerBody>({
        defaultValues: {
            user_name: "",
            display_name: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(RegisterSchema),
    })

    /**
         * Do Login
         * @param data 
         */
    const onSubmit: SubmitHandler<registerBody> = async (data) => {

        setLoading(true);

        try {
            setError('');
            const response = await dispatch(signUp(data)).unwrap();
            toast.success(response ? response.message : 'Welcome Back!');
            navigate('/auth/login');
        } catch (error: any) {
            const errorMessage = Array.isArray(error?.errors) && error?.errors?.length ? error.errors : error.message;
            setLoading(false);
            setError(errorMessage);
            toast.error(errorMessage);
        }
    }

    return (
        <div className="p-2 w-full max-w-xl rounded-md space-y-4 gap-4">
            <Link to={"/"} className="block text-center mb-4">
                <Logo className="text-4xl" />
            </Link>

            <h1 className="text-4xl font-semibold text-center">Create an account to start writing.</h1>

            <GoogleLoginButton text="signup_with" />

            <div className="flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <p className="mx-2 text-gray-500">OR</p>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {error ? <Alert variant="danger">
                {error}
            </Alert> : undefined}

            <form aria-disabled={loading} onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative p-4 bg-white rounded-xl shadow-lg">
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <label htmlFor="user_name" className="block text-sm">User Name</label>
                        <Input
                            disabled={loading}
                            type="text"
                            placeholder="User Name"
                            id="user_name"
                            {...(register('user_name'))}
                        />

                        {errors.user_name ? <p className='text-red-500 text-sm'>{errors.user_name?.message}</p> : undefined}
                    </div>
                    <div className="space-y-2 flex-1">
                        <label htmlFor="display_name" className="block text-sm">Display Name</label>
                        <Input
                            disabled={loading}
                            type="text"
                            placeholder="Display Name"
                            id="display_name"
                            {...(register('display_name'))}
                        />

                        {errors.display_name ? <p className='text-red-500 text-sm'>{errors.display_name?.message}</p> : undefined}
                    </div>
                </div>

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

                <Button size="lg" disabled={loading} fullWidth>
                    {loading ? <Spinner /> : 'Sign up'}
                </Button>
            </form>

            <p className="block text-center">
                Already have an account? <Link to={"/auth/login"} className="font-bold">Sign in</Link>
            </p>
        </div>
    )
}
