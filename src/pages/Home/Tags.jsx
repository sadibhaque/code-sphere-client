import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { ChevronRight, Hash } from "lucide-react";

const tags = [
    "Next.js",
    "React",
    "Web Development",
    "Tailwind CSS",
    "CSS",
    "Styling",
    "State Management",
    "JavaScript",
    "Node.js",
    "Express.js",
    "API",
    "Database",
    "MongoDB",
    "SQL",
    "Serverless",
    "Vercel",
    "Cloud",
    "Performance",
    "Optimization",
    "Security",
    "Best Practices",
    "Responsive Design",
    "Frontend",
    "GraphQL",
];

export default function Tags() {
    const [hoveredTag, setHoveredTag] = useState(null);

    return (
        <section className="w-full py-12 animate-fade-in">
            <div className="container mx-auto px-4 md:px-6">
                <Card className="border-0 shadow-xl hover-lift">
                    <CardHeader className="text-center pb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                <Hash className="h-6 w-6" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold text-gradient mb-2">
                            Explore Topics
                        </CardTitle>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Discover discussions across various technologies and
                            topics. Click on any tag to explore related posts.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {tags.map((tag, index) => (
                                <Link
                                    to={`/tag/${encodeURIComponent(tag)}`}
                                    key={tag}
                                    className="stagger-item"
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                    }}
                                >
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "cursor-pointer px-4 py-2 text-sm font-medium rounded-full transition-all-smooth hover:scale-110 hover:shadow-md",
                                            "bg-gradient-to-r from-muted to-muted/80 hover:from-primary/10 hover:to-primary/5",
                                            "border border-border hover:border-primary/30",
                                            hoveredTag === tag &&
                                                "ring-2 ring-primary/20"
                                        )}
                                        onMouseEnter={() => setHoveredTag(tag)}
                                        onMouseLeave={() => setHoveredTag(null)}
                                    >
                                        <span className="mr-2">#</span>
                                        {tag}
                                        <ChevronRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
