import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Users, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

export default function Hero({ onSearchResults }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term");
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(
                `https://code-sphere-server-nu.vercel.app/posts/search?tags=${encodeURIComponent(
                    searchTerm.trim()
                )}`
            );
            onSearchResults(response.data, searchTerm.trim());
            toast.success(
                `Found ${
                    response.data.length
                } posts matching "${searchTerm.trim()}"`
            );
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to search posts. Please try again.");
            onSearchResults([], searchTerm.trim());
        } finally {
            setIsSearching(false);
        }
    };

    const stats = [
        { icon: Users, label: "Active Users", value: "10K+" },
        { icon: MessageSquare, label: "Discussions", value: "50K+" },
        { icon: TrendingUp, label: "Daily Posts", value: "500+" },
    ];

    return (
        <section className="relative lg:max-w-10/12 max-w-11/12 mx-auto my-10 rounded-3xl py-16 md:py-24 lg:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                {/* <div
                    className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg%20width='60'%20height='60'%20viewBox='0%200%2060%2060'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cg%20fill='none'%20fillRule='evenodd'%3E%3Cg%20fill='%239C92AC'%20fillOpacity='0.05'%3E%3Ccircle%20cx='30'%20cy='30'%20r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] animate-pulse-slow`}
                /> */}
            </div>

            <div className="container relative mx-auto px-4 md:px-6 text-center">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Main Heading */}
                    <div className="space-y-4 animate-fade-in">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            <span className="block text-gradient">
                                Connect.
                            </span>
                            <span className="block">Share.</span>
                            <span className="block">Learn.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Join our vibrant community of developers, designers,
                            and innovators. Share knowledge, ask questions, and
                            grow together.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto ">
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
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                <Search className="h-5 w-5 mr-2" />
                                {isSearching ? "Searching..." : "Search"}
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-in-right">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="glass rounded-2xl p-6 hover-lift stagger-item"
                                style={{
                                    animationDelay: `${0.2 + index * 0.1}s`,
                                }}
                            >
                                <div className="flex items-center justify-center mb-3">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-gradient mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth hover:scale-105 shadow-lg px-8 py-3 text-base rounded-xl"
                        >
                            <a href="#posts">Start Exploring</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
