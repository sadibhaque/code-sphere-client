import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import DashBoardLayout from "../layouts/DashBoardLayout";
import UserDashboard from "../pages/Dashboard/UserDashoard";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageUsers from "../pages/Dashboard/ManageUsers";
import ReportedComments from "../pages/Dashboard/ReportedComments";
import MakeAnnouncement from "../pages/Dashboard/MakeAnnouncement";
import AddPost from "../pages/Dashboard/AddPost";
import MyPosts from "../pages/Dashboard/MyPosts";
import PostDetail from "../pages/Post/PostDetails";
import MembershipCard from "../pages/Membership/Membership";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../components/Register";
import Login from "../components/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            { index: true, element: <Home /> },
            {
                path: "/post-details/:id",
                element: <PostDetail></PostDetail>,
            },
            {
                path: "/membership",
                element: <MembershipCard />,
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Login /> },
            { path: "/auth/register", element: <Register /> },
            { path: "/auth/login", element: <Login /> },
        ],
    },
    {
        path: "/dashboard",
        element: <DashBoardLayout></DashBoardLayout>,
        children: [
            { path: "/dashboard/user", element: <UserDashboard /> },
            {
                path: "/dashboard/user/add-post",
                element: <AddPost />,
            },
            {
                path: "/dashboard/user/my-posts",
                element: <MyPosts />,
            },
            { path: "/dashboard/admin", element: <AdminDashboard /> },
            { path: "/dashboard/admin/manage-users", element: <ManageUsers /> },
            {
                path: "/dashboard/admin/reported-comments",
                element: <ReportedComments />,
            },
            {
                path: "/dashboard/admin/make-announcement",
                element: <MakeAnnouncement />,
            },
        ],
    },
]);

export default router;
