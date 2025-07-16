import { useState, useContext, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthContext } from "@/providers/AuthProvider";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";

export default function AddPost() {
    const { user } = useContext(AuthContext);
    const userHook = useUser(user);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const axiosSecure = useAxiosSecure();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tagList: [],
    });
    const [errors, setErrors] = useState({});
    // Initialize tagList as an empty array
    const [tagList, setTagList] = useState([]);
    const [postCount, setPostCount] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch(
                    "https://code-sphere-server-nu.vercel.app/tags"
                );
                const data = await response.json();
                setTagList(data[0].tagList);
            } catch (error) {
                console.error("Error fetching tags:", error);
                setTagList([]);
            }
        };

        fetchTags();
    }, []);

    const { data: count } = useQuery({
        queryKey: ["postCount", user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(
                `/posts-count-by-user/${user?.email}`
            );
            return data;
        },
        enabled: !!user?.email,
    });

    useEffect(() => {
        if (count) {
            setPostCount(count.postCount);
        }
    }, [count]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim() || formData.title.trim().length < 5) {
            newErrors.title = "Title must be at least 5 characters.";
        }

        if (
            !formData.description.trim() ||
            formData.description.trim().length < 20
        ) {
            newErrors.description =
                "Description must be at least 20 characters.";
        }

        if (formData.tagList.length === 0) {
            newErrors.tagList = "At least one tag is required.";
        }

        return newErrors;
    };

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

    const handleTagSelect = (tag) => {
        if (!formData.tagList.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tagList: [...prev.tagList, tag],
            }));

            // Clear tagList error
            if (errors.tagList) {
                setErrors((prev) => ({
                    ...prev,
                    tagList: "",
                }));
            }
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tagList: prev.tagList.filter((tag) => tag !== tagToRemove),
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (postCount >= 5 && userHook?.role === "bronze") {
            toast.error(
                "You have reached the maximum post limit of 5 become an Gold user."
            );
            navigate("/membership");
            return;
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare the post data
            const postData = {
                title: formData.title,
                content: formData.description,
                authorName: user?.displayName || "Anonymous User",
                authorEmail: user?.email || "",
                authorImage: user?.photoURL || "",
                tagList: formData.tagList,
                upvotes: 0,
                downvotes: 0,
            };

            // Send POST request to the API
            const response = await fetch(
                "https://code-sphere-server-nu.vercel.app/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(postData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create post");
            }

            // Show success message
            toast.success("Post created successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                tagList: [],
            });
            setErrors({});
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error(
                error.message || "Failed to create post. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Post Title</Label>
                    <Input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Enter post title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm">{errors.title}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Post Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Write your post content here..."
                        rows={8}
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">
                            {errors.description}
                        </p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="space-y-2">
                        <select
                            className="w-full p-3 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors hover:border-accent-foreground/20"
                            value=""
                            onChange={(e) => {
                                if (e.target.value) {
                                    handleTagSelect(e.target.value);
                                }
                            }}
                        >
                            <option value="" className="text-muted-foreground">
                                Select a tag...
                            </option>
                            {tagList.map((tag) => (
                                <option
                                    key={tag}
                                    value={tag}
                                    className="text-foreground bg-background hover:bg-accent"
                                >
                                    {tag}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-2">
                            {formData.tagList.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                    <span className="mr-1">#</span>
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleTagRemove(tag)}
                                        className="ml-2 text-primary/70 hover:text-primary hover:bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                        aria-label={`Remove ${tag} tag`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    {errors.tagList && (
                        <p className="text-red-500 text-sm">{errors.tagList}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Post...
                        </div>
                    ) : (
                        "Add Post"
                    )}
                </Button>
            </form>
        </div>
    );
}
