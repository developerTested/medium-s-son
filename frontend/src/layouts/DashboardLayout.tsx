import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../hooks'
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout() {

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

            <main className="flex min-h-screen pt-14">
                <Sidebar />

                <section className="grow bg-gray-100 lg:ml-60">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}
