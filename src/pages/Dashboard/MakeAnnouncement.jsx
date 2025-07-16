import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios/unsafe/axios.js";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";

export default function MakeAnnouncement() {
    const [formData, setFormData] = useState({
        authorImage: "/placeholder-user.jpg",
        authorName: "mendax", // Default admin name
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState({});

    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    // Redirect non-admin users to user dashboard
    useEffect(() => {
        if (userHook?.role && userHook.role !== "admin") {
            navigate("/dashboard/user", { replace: true });
        }
    }, [userHook, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        axios
            .post("https://code-sphere-server-nu.vercel.app/announcements", {
                title: formData.title,
                description: formData.description,
            })
            .then(() => {
                toast.success("Announcement made successfully!");
            });

        // Reset form
        setFormData({
            authorImage: "/placeholder-user.jpg",
            authorName: "mendax",
            title: "",
            description: "",
        });
        setErrors({});
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Make Announcement
                </h1>
                <p className="text-muted-foreground">
                    Create a new announcement for all users
                </p>
            </div>
            <form onSubmit={onSubmit} className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="title">Announcement Title</Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter announcement title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">
                        Announcement Description
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Write your announcement content here..."
                        rows={8}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full resize-y"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description}
                        </p>
                    )}
                </div>
                <Button type="submit" className="w-full">
                    Publish Announcement
                </Button>
            </form>
        </div>
    );
}
