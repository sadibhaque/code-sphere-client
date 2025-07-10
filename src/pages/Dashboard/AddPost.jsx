import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Dummy tags data
const dummyTags = [
    "React",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Python",
    "CSS",
    "HTML",
    "Web Development",
    "Frontend",
    "Backend",
    "Database",
    "API",
    "MongoDB",
    "Express",
    "Next.js",
    "Vue.js",
    "Angular",
    "Bootstrap",
    "Tailwind CSS",
    "GraphQL",
];

export default function AddPost() {
    const [formData, setFormData] = useState({
        authorImage: "/placeholder-user.jpg",
        authorName: "mendax", // Default user name
        authorEmail: "mendax@example.com", // Default user email
        title: "",
        description: "",
        tags: [],
        upvotes: 0,
        downvotes: 0,
    });
    const [errors, setErrors] = useState({});
    const [selectedTagInput, setSelectedTagInput] = useState("");

    const validateForm = () => {
        const newErrors = {};

        if (!formData.authorName.trim()) {
            newErrors.authorName = "Author name is required.";
        }

        if (!formData.authorEmail.trim()) {
            newErrors.authorEmail = "Author email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.authorEmail)) {
            newErrors.authorEmail = "Invalid email address.";
        }

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

        if (formData.tags.length === 0) {
            newErrors.tags = "At least one tag is required.";
        }

        if (formData.authorImage && !isValidUrl(formData.authorImage)) {
            newErrors.authorImage = "Please enter a valid URL.";
        }

        return newErrors;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
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
        if (!formData.tags.includes(tag)) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tag],
            }));
            setSelectedTagInput("");

            // Clear tags error
            if (errors.tags) {
                setErrors((prev) => ({
                    ...prev,
                    tags: "",
                }));
            }
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        console.log("New Post Data:", formData);
        alert("Post added successfully!");

        // Reset form
        setFormData({
            authorImage: "/placeholder-user.jpg",
            authorName: "mendax",
            authorEmail: "mendax@example.com",
            title: "",
            description: "",
            tags: [],
            upvotes: 0,
            downvotes: 0,
        });
        setErrors({});
        setSelectedTagInput("");
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-6">
            <div className="grid gap-2">
                <Label htmlFor="authorImage">Author Image URL</Label>
                <Input
                    id="authorImage"
                    name="authorImage"
                    type="url"
                    value={formData.authorImage}
                    onChange={handleInputChange}
                    disabled
                />
                {errors.authorImage && (
                    <p className="text-red-500 text-sm">{errors.authorImage}</p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                        id="authorName"
                        name="authorName"
                        type="text"
                        value={formData.authorName}
                        onChange={handleInputChange}
                        disabled
                    />
                    {errors.authorName && (
                        <p className="text-red-500 text-sm">
                            {errors.authorName}
                        </p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="authorEmail">Author Email</Label>
                    <Input
                        id="authorEmail"
                        name="authorEmail"
                        type="email"
                        value={formData.authorEmail}
                        onChange={handleInputChange}
                        disabled
                    />
                    {errors.authorEmail && (
                        <p className="text-red-500 text-sm">
                            {errors.authorEmail}
                        </p>
                    )}
                </div>
            </div>
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
                        onChange={(e) => handleTagSelect(e.target.value)}
                    >
                        <option value="">Select a tag...</option>
                        {dummyTags.map((tag) => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
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
                {errors.tags && (
                    <p className="text-red-500 text-sm">{errors.tags}</p>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="upvotes">UpVotes (Default: 0)</Label>
                    <Input
                        id="upvotes"
                        name="upvotes"
                        type="number"
                        value={formData.upvotes}
                        disabled
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="downvotes">DownVotes (Default: 0)</Label>
                    <Input
                        id="downvotes"
                        name="downvotes"
                        type="number"
                        value={formData.downvotes}
                        disabled
                    />
                </div>
            </div>
            <Button type="submit" className="w-full">
                Add Post
            </Button>
        </form>
    );
}
