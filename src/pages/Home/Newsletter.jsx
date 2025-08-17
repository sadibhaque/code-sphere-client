import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setEmail("");
            toast.success("Subscribed. Welcome aboard!");
        }, 700);
    };
    return (
        <section id="newsletter" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="relative overflow-hidden border-0 shadow-2xl bg-accent">
                    {/* Decorative gradient blobs */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />

                    <CardHeader className="relative z-10">
                        <div className="flex items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-gradient">
                                        Stay in the loop
                                    </CardTitle>
                                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                                        Weekly tips, highlights, and community
                                        news — straight to your inbox.
                                    </p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-background/60 px-3 py-1.5 rounded-full border">
                                <Sparkles className="h-4 w-4 text-primary" />
                                10k+ subscribers
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="relative z-10">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                            <form
                                onSubmit={submit}
                                className="flex-1 flex flex-col sm:flex-row gap-3"
                            >
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    aria-label="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-xl h-12"
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-xl h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                >
                                    {loading ? "Joining…" : "Subscribe"}
                                </Button>
                            </form>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground md:ml-2">
                                <Lock className="h-4 w-4" />
                                No spam, ever.
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-background/70 border">
                                Weekly insights
                            </span>
                            <span className="px-2 py-1 rounded-full bg-background/70 border">
                                Exclusive updates
                            </span>
                            <span className="px-2 py-1 rounded-full bg-background/70 border flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />{" "}
                                Unsubscribe anytime
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
