import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Crown,
    Zap,
    Shield,
    ArrowRight,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";

export default function MembershipCard() {
    const { user } = useAuth();
    const userHook = useUser(user);
    const [isLoading] = useState(false);
    const [isGold, setIsGold] = useState(false);
    const [billing, setBilling] = useState("monthly"); // monthly | yearly
    const navigate = useNavigate();

    useEffect(() => {
        setIsGold(userHook?.badge === "gold");
    }, [userHook?.badge]);

    const monthlyPrice = 9.99;
    const yearlyPrice = 99; // ~2 months free
    const priceDisplay =
        billing === "monthly" ? `$${monthlyPrice}` : `$${yearlyPrice}`;
    const subText =
        billing === "monthly" ? "per month" : "per year (2 months free)";

    const goCheckout = () => {
        const price = billing === "monthly" ? monthlyPrice : yearlyPrice;
        navigate(
            `/membership/checkout?plan=gold&price=${price}&billing=${billing}`
        );
    };

    const freeFeatures = [
        "Post up to 5 times/month",
        "Access to public discussions",
        "Basic community support",
    ];
    const goldFeatures = [
        "Unlimited posting",
        "Gold profile badge",
        "Priority support",
        "Ad-free experience",
        "Early access to features",
    ];

    return (
        <section className="w-full py-12">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                {/* Hero */}
                <div className="text-center mb-10">
                    <Badge
                        className="mb-3 bg-primary/15 text-primary"
                        variant="secondary"
                    >
                        Premium plans
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-gradient">
                        Level up your CodeSphere
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Choose a plan that fits your goals. Upgrade anytime.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" /> Secure
                        checkout • Cancel anytime
                    </div>
                </div>

                {/* Billing toggle */}
                <div className="mx-auto w-fit mb-8 rounded-full p-1 bg-muted/60 border">
                    <button
                        onClick={() => setBilling("monthly")}
                        className={cn(
                            "px-4 py-1.5 text-sm rounded-full",
                            billing === "monthly"
                                ? "bg-background shadow"
                                : "text-muted-foreground"
                        )}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBilling("yearly")}
                        className={cn(
                            "px-4 py-1.5 text-sm rounded-full",
                            billing === "yearly"
                                ? "bg-background shadow"
                                : "text-muted-foreground"
                        )}
                    >
                        Yearly{" "}
                        <span className="ml-1 text-xs text-primary">
                            (save 2 months)
                        </span>
                    </button>
                </div>

                {/* Pricing grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free */}
                    <Card className="relative overflow-hidden border-0 shadow-2xl bg-accent">
                        <CardHeader>
                            <CardTitle className="text-xl">Free</CardTitle>
                            <div className="text-3xl font-bold">$0</div>
                            <div className="text-sm text-muted-foreground">
                                Forever
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {freeFeatures.map((f) => (
                                    <li
                                        key={f}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Check className="h-4 w-4 text-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="secondary"
                                className="w-full"
                                disabled
                            >
                                You're on Free
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Gold / Pro */}
                    <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-primary/50 via-primary/10 to-primary/50">
                        <Card className="relative overflow-hidden rounded-2xl border-0 shadow-2xl bg-background">
                            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                                Most popular
                            </span>
                            {/* blobs */}
                            <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/15 blur-2xl" />
                            <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />

                            <CardHeader className="relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                        <Crown className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Gold
                                        </CardTitle>
                                        <div className="text-sm text-muted-foreground">
                                            Everything in Free, plus
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-4xl font-bold text-gradient">
                                        {priceDisplay}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {subText}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <ul className="space-y-2">
                                    {goldFeatures.map((f) => (
                                        <li
                                            key={f}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="relative z-10">
                                {isGold ? (
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                        disabled
                                    >
                                        <Crown className="h-4 w-4 mr-2" />{" "}
                                        You're Gold
                                    </Button>
                                ) : (
                                    <Button
                                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                        onClick={goCheckout}
                                        disabled={isLoading}
                                    >
                                        Upgrade to Gold{" "}
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Comparison */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">
                        Compare plans
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px rounded-lg overflow-hidden border">
                        {/* Header row */}
                        <div className="p-3 bg-muted font-medium">Feature</div>
                        <div className="p-3 bg-muted font-medium text-center">
                            Free
                        </div>
                        <div className="p-3 bg-muted font-medium text-center">
                            Gold
                        </div>
                        {/* Rows */}
                        {["Posting limit", "Badge", "Ads", "Support"].map(
                            (row) => (
                                <>
                                    <div
                                        key={`${row}-label`}
                                        className="p-3 bg-card text-sm"
                                    >
                                        {row}
                                    </div>
                                    {row === "Posting limit" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            5 / month
                                        </div>
                                    ) : row === "Badge" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Bronze
                                        </div>
                                    ) : row === "Ads" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Shown
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Community
                                        </div>
                                    )}
                                    {row === "Posting limit" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Unlimited
                                        </div>
                                    ) : row === "Badge" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Gold
                                        </div>
                                    ) : row === "Ads" ? (
                                        <div className="p-3 bg-card text-sm text-center">
                                            None
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-card text-sm text-center">
                                            Priority
                                        </div>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-3">
                        <details className="group rounded-lg border p-4 bg-card">
                            <summary className="cursor-pointer font-medium">
                                Can I cancel anytime?
                            </summary>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Yes. Your plan ends at the current billing
                                period, no questions asked.
                            </p>
                        </details>
                        <details className="group rounded-lg border p-4 bg-card">
                            <summary className="cursor-pointer font-medium">
                                Do you offer refunds?
                            </summary>
                            <p className="mt-2 text-sm text-muted-foreground">
                                We offer a 30-day money-back guarantee if you’re
                                not satisfied.
                            </p>
                        </details>
                        <details className="group rounded-lg border p-4 bg-card">
                            <summary className="cursor-pointer font-medium">
                                Is my payment secure?
                            </summary>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Payments are processed over HTTPS. We never
                                store card details.
                            </p>
                        </details>
                    </div>
                </div>

                {/* Guarantee */}
                <div className="mt-8 text-center text-xs text-muted-foreground">
                    🔒 Secure checkout • 30-day money-back guarantee • No hidden
                    fees
                </div>
            </div>
        </section>
    );
}
