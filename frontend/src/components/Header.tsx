import React from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import SearchForm from "./forms/SearchForm";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import { LiaEdit } from "react-icons/lia";
import { ImExit } from "react-icons/im";

export default function Header() {

    const { user, loggedIn } = useAppSelector(state => state.auth)

    return (
        <header className="sticky top-0 z-1030 flex items-center justify-between w-full h-14 bg-white shadow px-4">
            <div className="flex items-center gap-4">
                <Link to="/">
                    <Logo />
                </Link>
                {loggedIn ? <SearchForm /> : undefined}
            </div>


            <div className="menu flex items-center gap-4">
                <Link to="/" className="px-4 py-2 hover:bg-black hover:text-white rounded-full transition-all">
                    Home
                </Link>

                <Link to="/explore" className="px-4 py-2 hover:bg-black hover:text-white rounded-full transition-all">
                    Explore
                </Link>
                {loggedIn && user ?
                    <React.Fragment>

                        <Link to="/dashboard" className="px-4 py-2 hover:bg-black hover:text-white rounded-full transition-all">
                            Dashboard
                        </Link>

                        <Link to="/write" className="flex items-center gap-2">
                            <LiaEdit className="size-8" />

                            <div className="text hover:font-semibold">
                                Write
                            </div>
                        </Link>

                        <Avatar src={user.avatar} alt={user.display_name} />

                        <Link to="/logout">
                            <ImExit className="size-8" />
                        </Link>
                    </React.Fragment>
                    :
                    <React.Fragment>

                        <Link to={"/auth/login"}>
                            Sign in
                        </Link>

                        <Link to={"/auth/register"} className="bg-black text-white px-4 py-2 rounded-full">
                            Get Started
                        </Link>
                    </React.Fragment>
                }
            </div>
        </header>
    )
}
