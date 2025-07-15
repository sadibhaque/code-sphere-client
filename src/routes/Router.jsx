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
import AuthProvider from "../providers/AuthProvider";
import PrivateRoute from "../contexts/PrivateRoute";
import axios from "../../node_modules/axios/lib/axios";
import CommentReport from "../pages/CommentReport";
import MyComments from "../pages/MyComments";
import DashboardRedirect from "../components/DashboardRedirect";
import TagPage from "../pages/TagPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout></RootLayout>,
        children: [
            { index: true, element: <Home /> },
            {
                path: "/tag/:tag",
                element: <TagPage />,
            },
            {
                path: "/post-details/:id",
                element: (
                    <PrivateRoute>
                        <PostDetail></PostDetail>
                    </PrivateRoute>
                ),
                loader: async ({ params }) => {
                    const id = params.id;
                    const response = await axios.get(
                        `https://code-sphere-server-nu.vercel.app/posts/${id}`
                    );
                    return response.data;
                },
            },
            {
                path: "/comment-report/:id",
                element: (
                    <PrivateRoute>
                        <CommentReport />
                    </PrivateRoute>
                ),
                loader: async ({ params }) => {
                    const id = params.id;
                    const response = await axios.get(
                        `https://code-sphere-server-nu.vercel.app/comment/${id}`
                    );
                    return response.data;
                },
            },
            {
                path: "/membership",
                element: (
                    <PrivateRoute>
                        <MembershipCard />
                    </PrivateRoute>
                ),
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
        element: (
            <PrivateRoute>
                <DashBoardLayout />
            </PrivateRoute>
        ),
        children: [
            {
                index: true,
                element: (
                    <PrivateRoute>
                        <DashboardRedirect />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/user",
                element: (
                    <PrivateRoute>
                        <UserDashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/user-comments/:id",
                element: (
                    <PrivateRoute>
                        <MyComments />
                    </PrivateRoute>
                ),
                loader: async ({ params }) => {
                    const id = params.id;
                    return id;
                },
            },
            {
                path: "/dashboard/user/add-post",
                element: (
                    <PrivateRoute>
                        <AddPost />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/user/my-posts",
                element: (
                    <PrivateRoute>
                        <MyPosts />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/admin",
                element: (
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/admin/manage-users",
                element: (
                    <PrivateRoute>
                        <ManageUsers />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/admin/reported-comments",
                element: (
                    <PrivateRoute>
                        <ReportedComments />
                    </PrivateRoute>
                ),
            },
            {
                path: "/dashboard/admin/make-announcement",
                element: (
                    <PrivateRoute>
                        <MakeAnnouncement />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export default router;
