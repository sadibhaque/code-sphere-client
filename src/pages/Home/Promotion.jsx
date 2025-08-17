import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Gift, ShieldCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Promotion() {
    const navigate = useNavigate();
    // Lightweight countdown (72h from mount)
    const [deadline] = useState(() => Date.now() + 1000 * 60 * 60 * 72);
    const [remaining, setRemaining] = useState(deadline - Date.now());
    useEffect(() => {
        const id = setInterval(() => setRemaining(deadline - Date.now()), 1000);
        return () => clearInterval(id);
    }, [deadline]);
    const formatTime = (ms) => {
        if (ms <= 0) return "00:00:00";
        const totalSec = Math.floor(ms / 1000);
        const d = Math.floor(totalSec / 86400);
        const h = Math.floor((totalSec % 86400) / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return d > 0
            ? `${d}d ${h}h ${m}m`
            : `${String(h).padStart(2, "0")}:${String(m).padStart(
                  2,
                  "0"
              )}:${String(s).padStart(2, "0")}`;
    };
    return (
        <section id="promo" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="relative overflow-hidden border-0 shadow-xl bg-accent hover-lift">
                    {/* Decorative gradient blobs */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
                    {/* Corner badge */}
                    <span className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow">
                        50% OFF
                    </span>
                    <CardHeader className="relative z-10 pb-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground animate-pulse-slow">
                            <Gift className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gradient">
                                Limited-time Promo
                            </CardTitle>
                            <p className="text-muted-foreground text-sm">
                                Save 50% on Gold membership this month.
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-muted-foreground max-w-2xl">
                            <div className="text-sm md:text-base">
                                Upgrade now to unlock posting limits, a gold
                                badge, and more community perks.
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-1 rounded-full bg-background/70 border flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />{" "}
                                    Gold badge
                                </span>
                                <span className="px-2 py-1 rounded-full bg-background/70 border flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />{" "}
                                    Increased limits
                                </span>
                                <span className="px-2 py-1 rounded-full bg-background/70 border flex items-center gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />{" "}
                                    Priority support
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground line-through">
                                    $19.99
                                </div>
                                <div className="text-2xl font-bold text-gradient">
                                    $9.99
                                </div>
                                <div className="mt-1 inline-flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5 mr-1 text-primary" />{" "}
                                    Ends in {formatTime(remaining)}
                                </div>
                            </div>
                            <Button
                                onClick={() =>
                                    navigate(
                                        "/membership/checkout?plan=gold&price=9.99"
                                    )
                                }
                                className="rounded-xl h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                            >
                                <Gift className="mr-2 h-4 w-4" /> Get the deal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
