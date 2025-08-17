import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Star, Zap, Shield, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import { useNavigate } from "react-router";

export default function MembershipCard() {
    const [isLoading] = useState(false);
    const { user } = useAuth();
    const userHook = useUser(user);
    const [status, setStatus] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userHook?.badge === "gold") {
            setStatus(true);
        }
    }, [userHook]);

    // No direct upgrade here; handled on checkout page after successful payment

    const features = [
        { icon: Zap, text: "Post more than 5 times", highlight: true },
        { icon: Crown, text: "Receive the Gold badge", highlight: true },
        { icon: Shield, text: "Priority support", highlight: false },
        { icon: Heart, text: "Ad-free experience", highlight: false },
        { icon: Star, text: "Exclusive member events", highlight: false },
    ];

    return (
        <div className="w-full my-10 max-w-lg mx-auto animate-scale-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 bg-accent hover-lift overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-red-300/20 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-300/20 to-red-400/20 rounded-full translate-y-12 -translate-x-12" />

                <CardHeader className="text-center pb-8 relative">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg animate-pulse-slow">
                            <Crown className="h-8 w-8" />
                        </div>
                    </div>

                    <Badge
                        variant="secondary"
                        className="w-fit mx-auto mb-4 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800 px-4 py-1"
                    >
                        ⭐ Premium Membership
                    </Badge>

                    <CardTitle className="text-4xl font-bold text-gradient mb-2">
                        Go Gold
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Unlock exclusive features and support our amazing
                        community!
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8 relative">
                    {/* Pricing */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-5xl font-bold text-gradient">
                                $9.99
                            </span>
                            <div className="text-left">
                                <div className="text-sm text-muted-foreground line-through">
                                    $19.99
                                </div>
                                <div className="text-sm font-medium text-green-600">
                                    50% OFF
                                </div>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            per month • Cancel anytime
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-center mb-4">
                            What you'll get:
                        </h3>
                        <div className="space-y-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all-smooth stagger-item",
                                        feature.highlight
                                            ? "bg-gradient-to-r from-red-100/50 to-red-200/50 dark:from-red-900/20 dark:to-red-950/20 border border-red-200/50 dark:border-red-800/50"
                                            : "bg-background/50"
                                    )}
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <div
                                        className={cn(
                                            "p-2 rounded-full",
                                            feature.highlight
                                                ? "bg-gradient-to-br from-red-500 to-red-700 text-white"
                                                : "bg-green-100 dark:bg-green-900"
                                        )}
                                    >
                                        {feature.highlight ? (
                                            <feature.icon className="h-4 w-4" />
                                        ) : (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "font-medium",
                                            feature.highlight &&
                                                "text-red-800 dark:text-red-200"
                                        )}
                                    >
                                        {feature.text}
                                    </span>
                                    {feature.highlight && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-auto text-xs bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                                        >
                                            Popular
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-8 relative">
                    {userHook?.badge === "gold" && status ? (
                        <div className="w-full text-center space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Crown className="h-5 w-5 text-red-600" />
                                    <span className="font-semibold text-green-800 dark:text-green-200">
                                        You're already a Gold Member!
                                    </span>
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400">
                                    Enjoy all the premium benefits
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-full">
                            <Button
                                className="w-full h-14 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold text-lg transition-all-smooth hover:scale-105 shadow-lg"
                                onClick={() =>
                                    navigate(
                                        `/membership/checkout?plan=gold&price=9.99`
                                    )
                                }
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Crown className="h-5 w-5" />
                                        {user
                                            ? "Upgrade to Gold"
                                            : "Login to Become a Member"}
                                    </div>
                                )}
                            </Button>
                            {/* Checkout handled on dedicated route */}
                            <div className="text-center card mt-4 text-xs text-muted-foreground">
                                🔒 Secure payment • 30-day money-back guarantee
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
