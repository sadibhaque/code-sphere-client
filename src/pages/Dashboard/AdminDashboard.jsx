import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, User } from "lucide-react";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

export default function AdminDashboard() {
    const [newTag, setNewTag] = useState("");
    const [errors, setErrors] = useState({});
    const [tags, setTags] = useState([]);
    const [tagsId, setTagsId] = useState("");

    // Profile edit states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: "",
        profileImage: "",
        aboutMe: "",
    });
    const [editErrors, setEditErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);

    const { user, updateUser } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    // console.log(userHook);

    // Redirect non-admin users to user dashboard
    useEffect(() => {
        if (userHook?.role && userHook.role !== "admin") {
            navigate("/dashboard/user", { replace: true });
        }
    }, [userHook, navigate]);

    const [postCount, setPostCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    useQuery({
        queryKey: ["postCount"],
        queryFn: async () => {
            const response = await axiosSecure.get("/posts-count");
            setPostCount(response.data.totalPosts);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["usersCount"],
        queryFn: async () => {
            const response = await axiosSecure.get("/users-count");
            setUserCount(response.data.totalUsers);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["commentsCount"],
        queryFn: async () => {
            const response = await axiosSecure.get("/comments-count");
            setCommentCount(response.data.totalComments);
            return response.data; // Return the data explicitly
        },
    });

    useQuery({
        queryKey: ["tags"],
        queryFn: async () => {
            try {
                const response = await axios.get("http://localhost:3000/tags");
                let fetchedTags = [];

                if (response.data && response.data.length > 0) {
                    // Check if tagList is a string that needs to be parsed
                    if (typeof response.data[0]?.tagList === "string") {
                        try {
                            fetchedTags = JSON.parse(response.data[0].tagList);
                        } catch (parseError) {
                            console.error("Error parsing tagList:", parseError);
                            fetchedTags = [];
                        }
                    } else if (Array.isArray(response.data[0]?.tagList)) {
                        // If it's already an array, use it directly
                        fetchedTags = response.data[0].tagList;
                    }

                    setTagsId(response.data[0]?._id);
                }

                setTags(fetchedTags);
                return response.data;
            } catch (error) {
                console.error("Error fetching tags:", error);
                toast.error("Failed to load tags");
                return [];
            }
        },
    });

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

    const onAddTag = async (e) => {
        e.preventDefault();
        const trimmedTag = newTag.trim();
        const error = validateTag(trimmedTag);

        if (error) {
            setErrors({ newTag: error });
            return;
        }

        // Update the local state first for immediate UI feedback
        const updatedTags = [...tags, trimmedTag];
        setTags(updatedTags);
        setNewTag("");

        try {
            if (!tagsId) {
                toast.error("Cannot update tags: Tag document ID not found");
                return;
            }

            // Send update to the server
            await axios.put(`http://localhost:3000/tags/${tagsId}`, {
                tagList: updatedTags,
            });

            toast.success(`Tag "${trimmedTag}" added successfully!`);
            setErrors({});
        } catch (error) {
            console.error("Error updating tags:", error);
            toast.error("Failed to save tag. Please try again.");
            // Rollback the local state on error
            setTags(tags);
        }
    };

    // Initialize edit form when dialog opens
    const handleEditDialogOpen = () => {
        setEditForm({
            displayName: user?.displayName || "",
            profileImage: user?.photoURL || "",
            aboutMe:
                userHook?.aboutMe ||
                "Experienced admin managing CodeSphere community.",
        });
        setEditErrors({});
        setIsEditDialogOpen(true);
    };

    // Handle edit form submission
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!editForm.displayName.trim()) {
            newErrors.displayName = "Display name is required";
        }
        if (editForm.displayName.trim().length < 2) {
            newErrors.displayName =
                "Display name must be at least 2 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setEditErrors(newErrors);
            return;
        }

        try {
            // Update Firebase user profile
            const profileUpdates = {
                displayName: editForm.displayName.trim(),
            };

            // Only update photoURL if a new image was uploaded
            if (
                editForm.profileImage &&
                editForm.profileImage !== user?.photoURL
            ) {
                profileUpdates.photoURL = editForm.profileImage;
            }

            await updateUser(profileUpdates);

            // Update user profile in the server database
            const serverUpdateData = {
                displayName: editForm.displayName.trim(),
                aboutMe: editForm.aboutMe.trim(),
            };

            // Only include photoURL if it was updated
            if (
                editForm.profileImage &&
                editForm.profileImage !== user?.photoURL
            ) {
                serverUpdateData.photoURL = editForm.profileImage;
            }

            await axios.patch(
                `http://localhost:3000/users/${user.email}/profile`,
                serverUpdateData
            );

            toast.success("Profile updated successfully!");
            setIsEditDialogOpen(false);

            // The user state will be automatically updated by Firebase auth listener
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleEditInputChange = (field, value) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error for this field
        if (editErrors[field]) {
            setEditErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Handle image upload to ImgBB
    const handleImageUpload = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setUploadingImage(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // ImgBB API key from environment variables
            const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

            if (!API_KEY) {
                throw new Error("ImgBB API key not configured");
            }

            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${API_KEY}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                setEditForm((prev) => ({
                    ...prev,
                    profileImage: result.data.url,
                }));
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error(result.error?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className="w-full space-y-4 sm:space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">
                                Admin Profile
                            </CardTitle>
                            <CardDescription>
                                Overview of your admin account and site
                                statistics.
                            </CardDescription>
                        </div>
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleEditDialogOpen}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Update your profile information and
                                        settings.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleEditSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-name">
                                            Display Name
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={editForm.displayName}
                                            onChange={(e) =>
                                                handleEditInputChange(
                                                    "displayName",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter your display name"
                                        />
                                        {editErrors.displayName && (
                                            <p className="text-red-500 text-sm">
                                                {editErrors.displayName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-image">
                                            Profile Image
                                        </Label>
                                        <div className="space-y-3">
                                            {editForm.profileImage && (
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage
                                                            src={
                                                                editForm.profileImage
                                                            }
                                                            alt="Preview"
                                                        />
                                                        <AvatarFallback>
                                                            Preview
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            Current image
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setEditForm(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        profileImage:
                                                                            "",
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            <Input
                                                id="edit-image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file) {
                                                        handleImageUpload(file);
                                                    }
                                                }}
                                                disabled={uploadingImage}
                                            />
                                            {uploadingImage && (
                                                <p className="text-sm text-muted-foreground">
                                                    Uploading image...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit-about">
                                            About Me
                                        </Label>
                                        <Textarea
                                            id="edit-about"
                                            value={editForm.aboutMe}
                                            onChange={(e) =>
                                                handleEditInputChange(
                                                    "aboutMe",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setIsEditDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap w-8/12 mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                            <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mx-auto sm:mx-0">
                                <AvatarImage
                                    src={
                                        user?.photoURL ||
                                        "/placeholder-user.jpg"
                                    }
                                    alt={user.displayName}
                                />
                                <AvatarFallback className="text-2xl sm:text-4xl">
                                    {user.displayName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left space-y-1 flex-1">
                                <p className="text-xl sm:text-2xl font-bold break-words">
                                    {user.displayName}
                                </p>
                                <p className="text-muted-foreground text-sm sm:text-base break-all">
                                    {user.email}
                                </p>
                                <Badge
                                    variant="default"
                                    className="w-fit mt-2 mx-auto sm:mx-0"
                                >
                                    <User className="h-3 w-3 mr-1" />
                                    Administrator
                                </Badge>
                                <div className="mt-3">
                                    <h4 className="font-semibold text-sm mb-1">
                                        About Me
                                    </h4>
                                    <p className="text-muted-foreground text-xs sm:text-sm break-words">
                                        {userHook?.aboutMe}
                                    </p>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                                    Total Posts: {postCount} | Total Comments:{" "}
                                    {commentCount} | Total Users: {userCount}
                                </p>
                            </div>
                        </div>
                        <div className="w-full lg:w-120 h-70 mx-auto flex items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
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
                    <form onSubmit={onAddTag} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newTag">Tag Name</Label>
                            <Input
                                id="newTag"
                                type="text"
                                placeholder="e.g., AI, Blockchain"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="w-full"
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
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                >
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
