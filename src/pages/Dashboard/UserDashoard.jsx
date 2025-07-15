import { useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostCard from "../../components/PostCard";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";
import axios from "../../../node_modules/axios/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function UserDashboard() {
    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    // Redirect admin users to admin dashboard
    useEffect(() => {
        if (userHook?.role === "admin") {
            navigate("/dashboard/admin", { replace: true });
        }
    }, [userHook, navigate]);

    const { data: posts = [] } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            axios
                .get("http://localhost:3000/posts")
                .then((response) => response.data),
    });

    const recentPosts = posts
        .filter((post) => post.authorEmail === user.email)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 3);

    return (
        <div className="mx-auto space-y-4 sm:space-y-6 overflow-hidden">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        My Profile
                    </CardTitle>
                    <CardDescription>
                        View and manage your profile information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mx-auto sm:mx-0 flex-shrink-0">
                            <AvatarImage
                                src={user.image || "/placeholder-user.jpg"}
                                alt={user.displayName || "User Avatar"}
                            />
                            <AvatarFallback className="text-2xl sm:text-4xl">
                                {user.displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                            <p className="text-xl sm:text-2xl font-bold break-words">
                                {user.displayName}
                            </p>
                            <p className="text-muted-foreground text-sm sm:text-base break-all">
                                {user.email}
                            </p>
                            <Badge className="w-fit mt-2 mx-auto sm:mx-0">
                                {userHook?.badge}
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold">About Me (Optional)</h3>
                        <p className="text-muted-foreground text-sm sm:text-base break-words">
                            {/* Dummy About Me content */}
                            Passionate about web development and building
                            engaging user experiences. Always learning new
                            technologies.
                        </p>
                        {/* Add an Edit button and form for About Me here as per optional task */}
                    </div>
                </CardContent>
            </Card>

            <Card className="">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">
                        My Recent Posts
                    </CardTitle>
                    <CardDescription>
                        Your latest contributions to the forum.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 ">
                    {recentPosts.length > 0 ? (
                        <div className="space-y-4 w-full">
                            {recentPosts.map((post) => (
                                <div key={post.id} className="w-full min-w-0">
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            You haven&apos;t made any posts yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
