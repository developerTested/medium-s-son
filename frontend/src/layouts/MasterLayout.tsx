import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MasterLayout() {
    return (
        <div className="block w-full min-h-screen">
            <Header />

            <section className="container">
                <Outlet />
            </section>
        </div>
    )
}
