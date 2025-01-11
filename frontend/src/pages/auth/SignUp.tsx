import Button from '@/components/forms/Button'
import Input from '@/components/forms/Input'
import Logo from '@/components/Logo'
import { registerBody, RegisterSchema } from '@/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

export default function SignUp() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
            user_name: "",
            display_name: "",
        },
        resolver: zodResolver(RegisterSchema),
    })


    const onSubmit = (data: registerBody) => console.log(data)

    return (
        <div className="p-2 w-full max-w-xl rounded-md flex flex-col gap-4">
            <Link to={"/"} className="block text-center mb-4">
                <Logo className="text-4xl" />
            </Link>

            <h1 className="text-4xl font-semibold text-center">Create an account to start writing.</h1>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center gap-4">
                    <div className="space-y-2">
                        <label htmlFor="user_name" className="block text-sm">User Name</label>
                        <Input
                            type="text"
                            placeholder="User Name"
                            id="user_name"
                            {...(register('user_name'))}
                        />

                        {errors.user_name ? <p className='text-red-500 text-sm'>{errors.user_name?.message}</p> : undefined}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="display_name" className="block text-sm">Display Name</label>
                        <Input
                            type="text"
                            placeholder="Display Name"
                            id="display_name"
                            {...(register('display_name'))}
                        />

                        {errors.display_name ? <p className='text-red-500 text-sm'>{errors.display_name?.message}</p> : undefined}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm">Email</label>
                    <Input type="email" name="email" placeholder="Email Address" id="email" />

                    {errors.email ? <p className='text-red-500 text-sm'>{errors.email?.message}</p> : undefined}
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm">Password</label>
                    <Input type="password" name="password" placeholder="Password" id="password" />

                    {errors.password ? <p className='text-red-500 text-sm'>{errors.password?.message}</p> : undefined}
                </div>

                <Button type="submit">
                    Sign up
                </Button>
            </form>

            <p className="block text-center">
                Already have an account? <Link to={"/auth/login"} className="font-bold">Sign in</Link>
            </p>
        </div>
    )
}
