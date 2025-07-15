import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, Loader2 } from "lucide-react";
import PostCard from "@/components/PostCard";
import { toast } from "sonner";

export default function TagPage() {
    const { tag } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tag) {
            fetchPostsByTag(tag);
        }
    }, [tag]);

    const fetchPostsByTag = async (tagName) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `https://code-sphere-server-nu.vercel.app/posts/tag/${encodeURIComponent(
                    tagName
                )}`
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts by tag:", error);
            setError("Failed to load posts for this tag");
            toast.error("Failed to load posts for this tag");
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">
                                Loading posts...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={handleGoBack}
                        className="mb-4 hover:bg-muted"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <Card className="border-0 shadow-xl">
                        <CardHeader className="text-center pb-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    <Hash className="h-6 w-6" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-gradient mb-2">
                                Posts tagged with
                            </CardTitle>
                            <Badge
                                variant="secondary"
                                className="text-lg px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30"
                            >
                                <span className="mr-2">#</span>
                                {tag}
                            </Badge>
                            <p className="text-muted-foreground mt-4">
                                {posts.length === 0 && !loading
                                    ? "No posts found with this tag"
                                    : `Found ${posts.length} post${
                                          posts.length !== 1 ? "s" : ""
                                      } with this tag`}
                            </p>
                        </CardHeader>
                    </Card>
                </div>

                {/* Error State */}
                {error && (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6">
                            <div className="text-center text-destructive">
                                <p className="font-medium">{error}</p>
                                <Button
                                    variant="outline"
                                    onClick={() => fetchPostsByTag(tag)}
                                    className="mt-4"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Posts Grid */}
                {!error && posts.length > 0 && (
                    <div className="grid grid-cols-1  gap-6">
                        {posts.map((post, index) => (
                            <div
                                key={post._id}
                                className="animate-fade-in"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            >
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!error && !loading && posts.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Posts Found
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    There are no posts with the tag "{tag}" yet.
                                </p>
                                <Button
                                    onClick={handleGoBack}
                                    variant="outline"
                                >
                                    Go Back
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
