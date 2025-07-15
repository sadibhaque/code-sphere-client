import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PostCard from "../../components/PostCard";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchResults({ results, searchTerm, onClearSearch }) {
    if (!searchTerm) return null;

    return (
        <section className="w-full py-8 animate-fade-in">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
                    <CardHeader className="text-center pb-6">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                <Search className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold">
                                Search Results
                            </CardTitle>
                        </div>
                        <div className="flex items-center justify-center gap-4 flex-wrap">
                            <p className="text-muted-foreground">
                                {results.length === 0
                                    ? `No posts found for "${searchTerm}"`
                                    : `Found ${results.length} post${
                                          results.length === 1 ? "" : "s"
                                      } matching "${searchTerm}"`}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onClearSearch}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Clear Search
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {results.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 rounded-full bg-muted inline-block">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold">
                                        No posts found
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Try searching with different tags or
                                        keywords. Make sure your search terms
                                        match the tags used in posts.
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                                        <span className="text-sm text-muted-foreground">
                                            Popular tags:
                                        </span>
                                        {[
                                            "React",
                                            "JavaScript",
                                            "Node.js",
                                            "CSS",
                                            "HTML",
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-muted rounded-md text-xs cursor-pointer hover:bg-muted/80 transition-colors"
                                                onClick={() => {
                                                    // You could implement tag click to search functionality here
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {results.map((post) => (
                                    <div
                                        key={post._id || post.id}
                                        className="w-full"
                                    >
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
