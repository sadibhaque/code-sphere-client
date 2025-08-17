import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import axios from "axios/unsafe/axios.js";
import { useQuery } from "@tanstack/react-query";

export default function Announcement() {
    const [hoveredAnnouncement, setHoveredAnnouncement] = useState(null);

    const { data: announcements = [] } = useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            const response = await axios.get(
                "https://code-sphere-server-nu.vercel.app/announcements"
            );
            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    if (announcements.length === 0) {
        return null;
    }

    return (
        <section id="announcements" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 hover-lift overflow-hidden">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 rounded-full bg-primary text-primary-foreground animate-pulse-slow">
                                <Megaphone className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gradient">
                                    Latest Announcements
                                </CardTitle>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Stay updated with the latest news and
                                    updates
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className="w-fit bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                        >
                            {announcements.length} New Update
                            {announcements.length > 1 ? "s" : ""}
                        </Badge>
                    </CardHeader>
                    <CardContent className="overflow-hidden">
                        <ScrollArea className="h-68">
                            <div className="space-y-4 pr-4">
                                {announcements.map((announcement, index) => (
                                    <div
                                        key={announcement.id}
                                        className={cn(
                                            "p-3 sm:p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/50 transition-all-smooth hover-lift cursor-pointer stagger-item",
                                            "bg-gradient-to-r from-background/50 to-amber-50/50 dark:to-amber-950/50",
                                            hoveredAnnouncement ===
                                                announcement.id &&
                                                "shadow-md border-amber-300 dark:border-amber-700"
                                        )}
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredAnnouncement(
                                                announcement.id
                                            )
                                        }
                                        onMouseLeave={() =>
                                            setHoveredAnnouncement(null)
                                        }
                                    >
                                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-base sm:text-lg mb-2 text-foreground break-words">
                                                    {announcement.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm leading-relaxed mb-3 break-words">
                                                    {announcement.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            Posted:{" "}
                                                            {new Date(
                                                                announcement.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
                                                <Megaphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
