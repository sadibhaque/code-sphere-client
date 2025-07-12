import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios/unsafe/axios.js";
import { toast } from "sonner";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

// Dummy data
const dummyPosts = [
    { id: 1, title: "React Tips", author: "John" },
    { id: 2, title: "JavaScript Guide", author: "Jane" },
    { id: 3, title: "CSS Tricks", author: "Bob" },
    { id: 4, title: "Node.js Basics", author: "Alice" },
    { id: 5, title: "Database Design", author: "Charlie" },
];

const dummyComments = [
    { id: 1, text: "Great post!", postId: 1 },
    { id: 2, text: "Very helpful", postId: 1 },
    { id: 3, text: "Thanks for sharing", postId: 2 },
    { id: 4, text: "Awesome content", postId: 3 },
    { id: 5, text: "Well explained", postId: 2 },
    { id: 6, text: "Keep it up!", postId: 4 },
    { id: 7, text: "Nice work", postId: 5 },
    { id: 8, text: "Informative", postId: 3 },
];

const dummyUsers = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", email: "alice@example.com" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com" },
    { id: 6, name: "Diana Prince", email: "diana@example.com" },
    { id: 7, name: "Eve Adams", email: "eve@example.com" },
];

export default function AdminDashboard() {
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);
    const [tagsId, setTagsId] = useState("");

    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    if (userHook?.role !== "admin") {
        navigate("/dashboard/user");
    }

    useEffect(() => {
        axios.get("http://localhost:3000/posts/count").then((response) => {
            const totalPosts = response.data.totalPosts;
            setPostCount(totalPosts);
        });
        axios.get("http://localhost:3000/users-count").then((response) => {
            const totalUsers = response.data.totalUsers;
            setUserCount(totalUsers);
        });
        axios.get("http://localhost:3000/comments/count").then((response) => {
            const totalComments = response.data.totalComments;
            setCommentCount(totalComments);
        });

        axios.get("http://localhost:3000/tags").then((response) => {
            const fetchedTags = response.data[0]?.tagList || [];
            setTagsId(response.data[0]?._id);
            setTags(fetchedTags);
        });
    }, []);

    // data for pie chart
    const chartData = [
        { name: "Total Posts", value: postCount },
        { name: "Total Comments", value: commentCount },
        { name: "Total Users", value: userCount },
    ];

    const validateTag = (tagValue) => {
        if (!tagValue || tagValue.trim().length < 2) {
            return "Tag name must be at least 2 characters.";
        }
        if (tags.includes(tagValue.trim())) {
            return "Tag already exists.";
        }
        return null;
    };

    const onAddTag = (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        const error = validateTag(trimmedTag);

        if (error) {
            setErrors({ newTag: error });
            return;
        }

        setTags([...tags, trimmedTag]);

        // console.log(tags);

        axios.put(`http://localhost:3000/tags/${tagsId}`, {
            tagList: [...tags, trimmedTag],
        });

        setNewTag("");
        setErrors({});
        toast.success(`Tag "${trimmedTag}" added successfully!`);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Profile</CardTitle>
                    <CardDescription>
                        Overview of your admin account and site statistics.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={user.image || "/placeholder-user.jpg"}
                                alt={user.displayName}
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
                            <p className="text-sm text-muted-foreground mt-2">
                                Total Posts: {postCount} | Total Comments:{" "}
                                {commentCount} | Total Users: {userCount}
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Tag</CardTitle>
                    <CardDescription>
                        Add new tags that users can select for their posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onAddTag} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="newTag">Tag Name</Label>
                            <Input
                                id="newTag"
                                type="text"
                                placeholder="e.g., AI, Blockchain"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                            />
                            {errors.newTag && (
                                <p className="text-red-500 text-sm">
                                    {errors.newTag}
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full">
                            Add Tag
                        </Button>
                    </form>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Existing Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
