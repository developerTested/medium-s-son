import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import MasterLayout from "./layouts/MasterLayout";
import GuestLayout from "./layouts/GuestLayout";
import ErrorPage from "./pages/ErrorPage";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import Logout from "./pages/auth/Logout";
import AuthLayout from "./layouts/AuthLayout";
import PostList from "./pages/dashboard/post/PostList";
import PostCreate from "./pages/dashboard/post/PostCreate";
import EditPost from "./pages/dashboard/post/EditPost";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Explore from "./pages/Explore";
import ViewPost from "./pages/dashboard/post/ViewPost";
import HomePage from "./pages/HomePage";
import CreateBlog from "./pages/dashboard/blog/CreateBlog";
import EditBlog from "./pages/dashboard/blog/EditBlog";
import BlogList from "./pages/dashboard/blog/BlogList";
import ForgotPassword from "./pages/auth/ForgotPassword";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MasterLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                path: "/",
                element: <App />,
            },
            {
                path: "/explore",
                element: <Explore />,
            },
            {
                path: "/:user_name/:slug",
                element: <ViewPost />,
            },
        ]
    },
    {
        path: "/",
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/logout",
                element: <Logout />,
            },
            {
                path: "/home",
                element: <HomePage />,
            },
            {
                path: "/blogs",
                element: <PostList />,
            },
            {
                path: "/blogs/:blogId:/edit",
                element: <EditPost />,
            },
            {
                path: "/posts",
                element: <PostList />,
            },
            {
                path: "/posts/:postId/edit",
                element: <EditPost />,
            },
            {
                path: "/write",
                element: <PostCreate />,
            }
        ]
    },
    {
        path: "/auth",
        element: <GuestLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/auth/login",
                element: <SignIn />,
            },
            {
                path: "/auth/register",
                element: <SignUp />,
            },
            {
                path: "/auth/forgot-password",
                element: <ForgotPassword />,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                path: "/dashboard",
                element: <Dashboard />,
            },

            {
                path: "/dashboard/blogs",
                element: <BlogList />,
            },
            
            {
                path: "/dashboard/blogs/create",
                element: <CreateBlog />,
            },

            {
                path: "/dashboard/:blogId:/edit",
                element: <EditBlog />,
            },
        ]
    }
])

export default function RouteList() {
    return (
        <RouterProvider router={router} />
    )
}