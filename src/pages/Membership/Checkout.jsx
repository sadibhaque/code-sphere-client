import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import axios from "axios";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const userHook = useUser(user);

    const params = useMemo(
        () => new URLSearchParams(location.search),
        [location.search]
    );
    const plan = params.get("plan") || "gold";
    const price = Number(params.get("price") || 9.99);

    const [name, setName] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [card, setCard] = useState("");
    const [exp, setExp] = useState("");
    const [cvc, setCvc] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    const validate = () => {
        if (!name || !email || !card || !exp || !cvc) {
            setError("Please fill out all fields.");
            return false;
        }
        if (card.replace(/\s|-/g, "").length < 12) {
            setError("Card number seems too short.");
            return false;
        }
        if (!/^[0-9/\s-]+$/.test(exp) || exp.length < 4) {
            setError("Enter a valid expiry, e.g. 12/30.");
            return false;
        }
        if (cvc.replace(/\D+/g, "").length < 3) {
            setError("CVC must be at least 3 digits.");
            return false;
        }
        setError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setProcessing(true);
        // Simulate gateway processing
        setTimeout(async () => {
            try {
                if (!userHook?._id) throw new Error("User not loaded");
                await axios.patch(
                    `https://code-sphere-server-nu.vercel.app/users/${userHook._id}/badge`,
                    { badge: plan }
                );
                toast.success("Payment successful! Membership upgraded.");
                navigate("/membership");
            } catch (err) {
                console.error(err);
                toast.error("Failed to complete payment. Please try again.");
            } finally {
                setProcessing(false);
            }
        }, 1200);
    };

    return (
        <div className="w-full my-10 max-w-2xl mx-auto animate-scale-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20 hover-lift">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Checkout</CardTitle>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Lock className="h-4 w-4" />
                            Secure
                        </div>
                    </div>
                    <CardDescription>
                        Complete your payment to activate the {plan} membership.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name on card</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="jane@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="card">Card number</Label>
                                <Input
                                    id="card"
                                    value={card}
                                    onChange={(e) => setCard(e.target.value)}
                                    placeholder="4242 4242 4242 4242"
                                    inputMode="numeric"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="exp">Expiry</Label>
                                    <Input
                                        id="exp"
                                        value={exp}
                                        onChange={(e) => setExp(e.target.value)}
                                        placeholder="MM/YY"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input
                                        id="cvc"
                                        value={cvc}
                                        onChange={(e) =>
                                            setCvc(
                                                e.target.value.replace(
                                                    /\D+/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="123"
                                        inputMode="numeric"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {error && (
                            <div className="text-sm text-red-600">{error}</div>
                        )}
                        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                            <div className="flex items-center gap-2 text-sm">
                                <Shield className="h-4 w-4" />
                                <span>Plan</span>
                            </div>
                            <div className="font-medium capitalize">{plan}</div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4" />
                                <span>Amount</span>
                            </div>
                            <div className="font-semibold">
                                ${price.toFixed(2)}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? "Processing…"
                                    : `Pay $${price.toFixed(2)}`}
                            </Button>
                        </div>
                    </form>
                    <p className="text-[10px] text-muted-foreground mt-2">
                        Demo checkout only. No real charges are made.
                    </p>
                </CardContent>
                <CardFooter />
            </Card>
        </div>
    );
}
