import { useState, useContext, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AuthContext } from "@/providers/AuthProvider";

export default function AddPost() {
    const { user } = useContext(AuthContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tagList: [],
    });
    const [errors, setErrors] = useState({});
    // Initialize tagList as an empty array
    const [tagList, setTagList] = useState([]);

    const list = [1, 2, 3, 4];

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch("http://localhost:3000/tags");
                const data = await response.json();
                setTagList(data[0].tagList);
            } catch (error) {
                console.error("Error fetching tags:", error);
                setTagList([]);
            }
        };

        fetchTags();
    }, []);

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
                tagList: formData.tagList,
                upvotes: 0,
                downvotes: 0,
            };

            // Send POST request to the API
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });

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
        <form onSubmit={onSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            <div className="grid gap-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleInputChange}
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                )}
            </div>
            <div className="grid gap-2">
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
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="space-y-2">
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value=""
                        onChange={(e) => {
                            if (e.target.value) {
                                handleTagSelect(e.target.value);
                            }
                        }}
                    >
                        <option value="">Select a tag...</option>
                        {tagList.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                        {formData.tagList.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleTagRemove(tag)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
    );
}
