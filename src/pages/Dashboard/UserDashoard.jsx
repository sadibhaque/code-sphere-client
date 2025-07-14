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
import axios from "../../../node_modules/axios/lib/axios";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

// const posts = [
//     {
//         id: "1",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Alice Johnson",
//         title: "Getting Started with Next.js 14",
//         description:
//             "A comprehensive guide to setting up your first Next.js 14 project with App Router.",
//         tags: ["Next.js", "React", "Web Development"],
//         time: "2 hours ago",
//         commentsCount: 15,
//         upvotes: 120,
//         downvotes: 5,
//     },
//     {
//         id: "2",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Bob Williams",
//         title: "Understanding Tailwind CSS Utility Classes",
//         description:
//             "Dive deep into the power of Tailwind CSS and how to effectively use its utility-first approach.",
//         tags: ["Tailwind CSS", "CSS", "Styling"],
//         time: "1 day ago",
//         commentsCount: 8,
//         upvotes: 90,
//         downvotes: 2,
//     },
//     {
//         id: "3",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Charlie Brown",
//         title: "State Management in React: A Comparison",
//         description:
//             "Exploring different state management solutions like Context API, Redux, Zustand, and Jotai.",
//         tags: ["React", "State Management", "JavaScript"],
//         time: "3 days ago",
//         commentsCount: 22,
//         upvotes: 150,
//         downvotes: 10,
//     },
//     {
//         id: "4",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Diana Prince",
//         title: "Building RESTful APIs with Node.js and Express",
//         description:
//             "A step-by-step tutorial on creating robust RESTful APIs using Node.js and the Express framework.",
//         tags: ["Node.js", "Express.js", "API"],
//         time: "5 days ago",
//         commentsCount: 10,
//         upvotes: 75,
//         downvotes: 3,
//     },
//     {
//         id: "5",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Eve Adams",
//         title: "Database Design Best Practices for Scalable Applications",
//         description:
//             "Tips and tricks for designing efficient and scalable databases for your web applications.",
//         tags: ["Database", "MongoDB", "SQL"],
//         time: "1 week ago",
//         commentsCount: 5,
//         upvotes: 60,
//         downvotes: 1,
//     },
//     {
//         id: "6",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Frank White",
//         title: "Introduction to Serverless Functions with Vercel",
//         description:
//             "Learn how to deploy serverless functions on Vercel for backend logic without managing servers.",
//         tags: ["Serverless", "Vercel", "Cloud"],
//         time: "1 week ago",
//         commentsCount: 18,
//         upvotes: 110,
//         downvotes: 4,
//     },
//     {
//         id: "7",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Grace Lee",
//         title: "Optimizing React Performance: A Deep Dive",
//         description:
//             "Techniques and tools to identify and fix performance bottlenecks in your React applications.",
//         tags: ["React", "Performance", "Optimization"],
//         time: "2 weeks ago",
//         commentsCount: 9,
//         upvotes: 85,
//         downvotes: 0,
//     },
//     {
//         id: "8",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Henry Green",
//         title: "Securing Your Web Applications: Common Vulnerabilities",
//         description:
//             "An overview of common web security vulnerabilities and how to protect your applications.",
//         tags: ["Security", "Web Development", "Best Practices"],
//         time: "2 weeks ago",
//         commentsCount: 12,
//         upvotes: 95,
//         downvotes: 6,
//     },
//     {
//         id: "9",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Ivy King",
//         title: "Responsive Design with CSS Grid and Flexbox",
//         description:
//             "Mastering modern CSS layout techniques for building responsive and adaptive user interfaces.",
//         tags: ["CSS", "Responsive Design", "Frontend"],
//         time: "3 weeks ago",
//         commentsCount: 7,
//         upvotes: 70,
//         downvotes: 1,
//     },
//     {
//         id: "10",
//         authorImage: "/placeholder-user.jpg",
//         authorName: "Jack Black",
//         title: "Introduction to GraphQL for Frontend Developers",
//         description:
//             "A beginner-friendly guide to understanding and using GraphQL in your frontend projects.",
//         tags: ["GraphQL", "API", "Frontend"],
//         time: "1 month ago",
//         commentsCount: 11,
//         upvotes: 100,
//         downvotes: 3,
//     },
// ];

export default function UserDashboard() {
    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    const { data: posts = [] } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            axios
                .get("http://localhost:3000/posts")
                .then((response) => response.data),
    });

    // if (userHook?.role !== "user") {
    //     navigate("/dashboard/admin");
    // }

    // Filter dummy posts by current user's email (dummy logic)
    const recentPosts = posts
        .filter((post) => post.authorEmail === user.email)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 3);
    // const recentPosts = posts; // Get up to 3 recent posts

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>
                        View and manage your profile information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={user.image || "/placeholder-user.jpg"}
                                alt={user.displayName || "User Avatar"}
                            />
                            <AvatarFallback className="text-4xl">
                                {user.displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-2xl font-bold">
                                {user.displayName}
                            </p>
                            <p className="text-muted-foreground">
                                {user.email}
                            </p>
                            <Badge className="w-fit mt-2">
                                {userHook?.badge}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <h3 className="font-semibold">About Me (Optional)</h3>
                        <p className="text-muted-foreground">
                            {/* Dummy About Me content */}
                            Passionate about web development and building
                            engaging user experiences. Always learning new
                            technologies.
                        </p>
                        {/* Add an Edit button and form for About Me here as per optional task */}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>My Recent Posts</CardTitle>
                    <CardDescription>
                        Your latest contributions to the forum.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {recentPosts.length > 0 ? (
                        recentPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-muted-foreground">
                            You haven&apos;t made any posts yet.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
