import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * DummyStripeCheckout
 * A client-only mock checkout dialog that simulates a Stripe payment.
 *
 * Props:
 * - open: boolean
 * - onOpenChange: (open: boolean) => void
 * - price: string | number (e.g., 9.99)
 * - onSuccess: (result: { paymentId: string }) => void
 * - onCancel?: () => void
 */
export default function DummyStripeCheckout({
    open,
    onOpenChange,
    price = 9.99,
    onSuccess,
    onCancel,
}) {
    const [cardNumber, setCardNumber] = useState("");
    const [exp, setExp] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) {
            setCardNumber("");
            setExp("");
            setCvc("");
            setName("");
            setEmail("");
            setIsProcessing(false);
            setError("");
        }
    }, [open]);

    const validate = () => {
        if (!name || !email || !cardNumber || !exp || !cvc) {
            setError("Please fill out all fields.");
            return false;
        }
        if (cardNumber.replace(/\s|-/g, "").length < 12) {
            setError("Card number seems too short.");
            return false;
        }
        if (!/^[0-9/\s-]+$/.test(exp) || exp.length < 4) {
            setError("Enter a valid expiry, e.g. 12/30.");
            return false;
        }
        if (cvc.length < 3) {
            setError("CVC must be at least 3 digits.");
            return false;
        }
        setError("");
        return true;
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsProcessing(true);
        // Simulate network + payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onOpenChange(false);
            onSuccess?.({ paymentId: `dummy_${Date.now()}` });
        }, 1200);
    };

    const handleCancel = () => {
        onOpenChange(false);
        onCancel?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Complete your payment to activate membership.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePay} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name on card</Label>
                            <Input
                                id="name"
                                placeholder="Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="jane@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card">Card number</Label>
                            <Input
                                id="card"
                                inputMode="numeric"
                                placeholder="4242 4242 4242 4242"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="exp">Expiry</Label>
                                <Input
                                    id="exp"
                                    placeholder="MM/YY"
                                    value={exp}
                                    onChange={(e) => setExp(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input
                                    id="cvc"
                                    inputMode="numeric"
                                    placeholder="123"
                                    value={CvcAsDigits(cvc)}
                                    onChange={(e) => setCvc(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">{error}</div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                            {isProcessing
                                ? "Processing…"
                                : `Pay $${Number(price).toFixed(2)}`}
                        </Button>
                    </div>
                </form>
                <p className="text-[10px] text-muted-foreground mt-2">
                    This is a demo payment. No real charges will be made.
                </p>
            </DialogContent>
        </Dialog>
    );
}

function CvcAsDigits(v) {
    return v.replace(/\D+/g, "");
}
