import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Edit } from "lucide-react";
import PostCard from "../../components/PostCard";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "../../../node_modules/axios/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function UserDashboard() {
    const { user, updateUser } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    // Profile edit states
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        displayName: "",
        profileImage: "",
        aboutMe: "",
    });
    const [editErrors, setEditErrors] = useState({});
    const [uploadingImage, setUploadingImage] = useState(false);

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
                .get("https://code-sphere-server-nu.vercel.app/posts")
                .then((response) => response.data),
    });

    const recentPosts = posts
        .filter((post) => post.authorEmail === user.email)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 3);

    // Initialize edit form when dialog opens
    const handleEditDialogOpen = () => {
        setEditForm({
            displayName: user?.displayName || "",
            profileImage: user?.photoURL || "",
            aboutMe: user?.aboutMe || "",
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
                `https://code-sphere-server-nu.vercel.app/users/${user.email}/profile`,
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
        <div className="mx-auto space-y-4 sm:space-y-6 overflow-hidden">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg sm:text-xl">
                                My Profile
                            </CardTitle>
                            <CardDescription>
                                View and manage your profile information.
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mx-auto sm:mx-0 flex-shrink-0">
                            <AvatarImage
                                src={user?.photoURL || "/placeholder-user.jpg"}
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
                        <h3 className="font-semibold">About Me</h3>
                        <p className="text-muted-foreground text-sm sm:text-base break-words">
                            {userHook?.aboutMe ||
                                "Passionate about web development and building engaging user experiences. Always learning new technologies."}
                        </p>
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
