import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

export default function Hero({ onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const trendingTags = [
        "React",
        "JavaScript",
        "CSS",
        "Node.js",
        "Firebase",
        "Next.js",
    ];

    const handleSearch = async (q) => {
        const term = (q ?? searchTerm).trim();
        if (!term) {
            toast.error("Please enter a search term");
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(
                `https://code-sphere-server-nu.vercel.app/posts/search?tags=${encodeURIComponent(
                    term
                )}`
            );
            onSearchResults(response.data, term);
            toast.success(
                `Found ${response.data.length} posts matching "${term}"`
            );
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to search posts. Please try again.");
            onSearchResults([], term);
        } finally {
            setIsSearching(false);
        }
    };

    const handleTagClick = (tag) => {
        setSearchTerm(tag);
        handleSearch(tag);
    };

    // Note: right-side visual stats panel removed in this background-centric design.

    return (
        <section className="relative lg:max-w-10/12 max-w-11/12 mx-auto my-10 rounded-3xl py-16 md:py-24 lg:py-32 overflow-hidden">
            {/* Background stack: base gradient + spotlight + grid + aurora blobs */}
            <div className="absolute inset-0 -z-10">
                {/* base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20" />
                {/* center spotlight */}
                <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,theme(colors.primary/25),transparent)] dark:bg-[radial-gradient(60%_40%_at_50%_0%,theme(colors.primary/15),transparent)] animate-spotlight" />
                {/* moving blurred light sweep */}
                <div className="absolute -inset-x-1/2 inset-y-0 left-1/2 w-[120%] h-full -translate-x-1/2 rotate-[15deg] bg-gradient-to-r from-transparent via-primary/25 to-transparent blur-3xl animate-light-sweep" />
                {/* subtle dot grid */}
                <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2740%27%20height%3D%2740%27%20viewBox%3D%270%200%2040%2040%27%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%3E%3Ccircle%20cx%3D%272%27%20cy%3D%272%27%20r%3D%271%27%20fill%3D%27%239C92AC%27%20fill-opacity%3D%270.12%27/%3E%3C/svg%3E')] animate-grid-drift" />
                {/* aurora blobs */}
                {/* <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl opacity-70 animate-aurora" />
                <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-400/25 dark:bg-orange-300/10 blur-3xl opacity-70 animate-aurora-reverse" /> */}
            </div>

            <div className="container relative mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-5xl text-center space-y-8">
                    {/* Heading and subcopy */}
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block text-gradient">
                                Connect.
                            </span>
                            <span className="block">Share.</span>
                            <span className="block">Build.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            Join our vibrant community of developers, designers,
                            and innovators. Share knowledge, ask questions, and
                            grow together.
                        </p>
                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div
                                className={cn(
                                    "flex w-full rounded-2xl border-2 bg-background/50 backdrop-blur-sm transition-all-smooth shadow-lg",
                                    isSearchFocused
                                        ? "border-primary shadow-primary/20"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <Input
                                    type="text"
                                    placeholder="Search posts by tags (e.g., React, JavaScript, CSS, Node.js)..."
                                    className="flex-1 rounded-xl mt-2 ml-2 border-0 bg-transparent text-base px-6 py-4 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="m-2 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth hover:scale-105 shadow-md rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSearching ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Searching
                                        </>
                                    ) : (
                                        <>
                                            <Search className="h-5 w-5 mr-2" />
                                            Search
                                        </>
                                    )}
                                </Button>
                            </div>
                            {/* Quick suggestions */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    Try:
                                </span>
                                {trendingTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        className="text-xs rounded-full border px-3 py-1 hover:bg-muted transition-colors"
                                        disabled={isSearching}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                                <span className="hidden sm:inline text-xs text-muted-foreground">
                                    • Press Enter to search
                                </span>
                            </div>
                            {/* CTAs */}
                            <div className="mt-6 flex flex-wrap gap-3 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth shadow-lg px-6 rounded-xl"
                                >
                                    <a href="#posts">Explore Posts</a>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    <a href="#topics">Browse Topics</a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Trust bar */}

                    {/* Scroll hint */}
                    <div className="mt-10 flex justify-center">
                        <a
                            href="#posts"
                            className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                            Scroll to posts
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
