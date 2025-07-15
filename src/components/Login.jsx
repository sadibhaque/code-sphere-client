import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "sonner";

// Login form validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const { loginUser, setUser, user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    console.log(user);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        // reset,
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    // Handle email/password login
    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            console.log("Login data:", data);

            // Here you will add Firebase authentication later
            // For now, just logging the data and simulating a successful login

            loginUser(data.email, data.password)
                .then((userCredential) => {
                    setUser(userCredential.user);
                    fetch(
                        `https://code-sphere-server-nu.vercel.app/users/${data.email}`
                    )
                        .then((response) => response.json())
                        .then((x) => {
                            setUser({
                                ...userCredential.user,
                                username: x.username.toLowerCase(),
                                role: x.role || "user", // default to user if not set
                                badge: x.badge || "bronze", // default badge
                            });
                        })
                        .catch((error) => console.error("Fetch error:", error));

                    toast.success("Login successful");
                    navigate(`${location.state ? location.state : "/"}`);
                })
                .catch((error) => {
                    toast.error(error.message);
                    console.log(error.message);
                });

            // Reset form after successful login
            // reset();

            // TODO: Redirect user after successful login
        } catch (error) {
            console.error("Login error:", error.message);
            // TODO: Show error message to user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto animate-scale-in">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-background to-muted/20 hover-lift">
                <CardHeader className="text-center pb-8">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gradient">
                        Login
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="pl-10 h-12 border-2 focus:border-primary transition-all-smooth"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </Label>
                                <Link
                                    to="#"
                                    className="text-sm text-primary hover:underline transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="pl-10 h-12 border-2 focus:border-primary transition-all-smooth"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth hover:scale-105 shadow-lg text-base font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging in...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Login
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-primary hover:underline font-medium transition-colors"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
