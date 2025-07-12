import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios/unsafe/axios.js";
import { toast } from "sonner";

export default function MakeAnnouncement() {
    const [formData, setFormData] = useState({
        authorImage: "/placeholder-user.jpg",
        authorName: "mendax", // Default admin name
        title: "",
        description: "",
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.authorName.trim()) {
            newErrors.authorName = "Author name is required.";
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

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        axios
            .post("http://localhost:3000/announcements", {
                title: formData.title,
                description: formData.description,
            })
            .then(() => {
                toast.success("Announcement made successfully!");
                console.log("done");
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
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Announcement Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Write your announcement content here..."
                    rows={8}
                    value={formData.description}
                    onChange={handleInputChange}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description}</p>
                )}
            </div>
            <Button type="submit" className="w-full">
                Publish Announcement
            </Button>
        </form>
    );
}
