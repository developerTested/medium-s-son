import { Link } from "react-router-dom";
import { ImExit } from "react-icons/im";
import Logo from "../Logo";
import Avatar from "../Avatar";
import { useAppSelector } from "@/hooks";

export default function DashboardHeader() {

    const { user } = useAppSelector(state => state.auth)

    return (
        <header className="fixed top-0 flex items-center justify-between w-full h-14 bg-white shadow px-4">
            <Link to="/">
                <Logo />
            </Link>

            {user ? <div className="flex items-center gap-2">

                <div className="flex items-center gap-2">
                    Hi, <div className="font-semibold">{user.display_name}</div>
                </div>

                <Avatar alt={user.display_name} />

                <Link to="/logout">
                    <ImExit className="size-8" />
                </Link>
            </div> : undefined}

        </header>
    )
}
