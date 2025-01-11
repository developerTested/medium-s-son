import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import Header from '@/components/Header';

export default function AuthLayout() {

    const navigate = useNavigate();
    const { loggedIn } = useAppSelector(state => state.auth);

    useEffect(() => {

        if (!loggedIn) {
            navigate("/auth/login")
        }

    }, [loggedIn])

    return (
        <div className="block w-full min-h-screen">
            <Header />

            <div className="flex">

            </div>

            <section className="container">
                <Outlet />
            </section>
        </div>
    )
}
