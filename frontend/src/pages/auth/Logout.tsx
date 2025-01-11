import Button from '@/components/forms/Button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/redux/slices/actions/auth';
import { resetUser } from '@/redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogout } from '@react-oauth/google';

export default function Logout() {
    const {socialLogin} = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {

        await toast.promise(dispatch(logout()).unwrap(), {
            pending: "Please wait... We're logging you out!",
            success: {
                render: () => {
                    dispatch(resetUser());
                    return "You've been logout successfully!";
                }
            },
            error: "An error occurred while logging you out!"
        })

        navigate('/')
    }

    const handleSocialLogout = () => {
        googleLogout()
        dispatch(resetUser())

        toast.success("You've logged out successfully!")
    }
    

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="block p-4 bg-white border rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">
                    Are you sure you want to log out?
                </h2>
                <div className="flex items-center justify-between">
                    <Button onClick={socialLogin ? handleSocialLogout : handleLogout}>
                        Log Out
                    </Button>
                    <Link to='/home' className="btn uppercase bg-gray-200 dark:bg-white/20 text-center py-2.5 px-4 rounded-full">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    )
}
