import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { resetUser } from '@/redux/slices/authSlice';

export default function GuestLayout() {

    const navigate = useNavigate();
    const { user, loggedIn } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {

        if (loggedIn) {
            navigate("/home")
        } else {
            dispatch(resetUser())
        }

    }, [user])

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <Outlet />
        </div>
    )
}
