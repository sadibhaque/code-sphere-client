import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { Link } from "react-router";
import axios from "axios/unsafe/axios.js";
import { useQuery } from "@tanstack/react-query";

export default function Featured() {
    const { data: posts = [] } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await axios.get(
                "https://code-sphere-server-nu.vercel.app/posts"
            );
            return res.data || [];
        },
        staleTime: 30_000,
    });

    const featured = useMemo(() => {
        const scored = posts.map((p) => ({
            ...p,
            _score: (p.upvotes || 0) - (p.downvotes || 0),
        }));
        return scored.sort((a, b) => b._score - a._score).slice(0, 3);
    }, [posts]);

    if (!featured.length) return null;

    return (
        <section id="featured" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="border-0 shadow-xl hover-lift overflow-hidden">
                    <CardHeader className="pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground animate-pulse-slow">
                                <Flame className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gradient">
                                    Featured Posts
                                </CardTitle>
                                <p className="text-muted-foreground text-sm">
                                    Top-voted content from the community
                                </p>
                            </div>
                        </div>
                        <Link to="#posts">
                            <Button variant="outline" className="rounded-xl">
                                View all
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featured.map((post) => (
                                <Link
                                    to={`/post-details/${post._id}`}
                                    key={post._id}
                                    className="group"
                                >
                                    <div className="rounded-2xl border bg-accent p-4 h-full transition-all-smooth hover-lift">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge
                                                variant="secondary"
                                                className="capitalize"
                                            >
                                                {post.tagList?.[0] || "general"}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                Score{" "}
                                                {(post.upvotes || 0) -
                                                    (post.downvotes || 0)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                                            {post.content}
                                        </p>
                                        <div className="mt-3 flex items-center text-primary text-sm">
                                            Read more{" "}
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
