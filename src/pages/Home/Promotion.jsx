import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Gift } from "lucide-react";
import { useNavigate } from "react-router";

export default function Promotion() {
    const navigate = useNavigate();
    return (
        <section id="promo" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="border-0 shadow-xl relative bg-accent hover-lift overflow-hidden">
                    <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-2xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
                    <CardHeader className="pb-4 flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground animate-pulse-slow">
                            <Megaphone className="h-6 w-6" />
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
                    <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-muted-foreground">
                            Upgrade now to unlock posting limits, a gold badge,
                            and more community perks.
                        </div>
                        <Button
                            onClick={() =>
                                navigate(
                                    "/membership/checkout?plan=gold&price=9.99"
                                )
                            }
                            className="rounded-xl"
                        >
                            <Gift className="mr-2 h-4 w-4" /> Get the deal
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
