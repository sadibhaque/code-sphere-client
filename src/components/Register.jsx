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
import { Mail, Lock, ArrowRight, AtSign, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useContext, useState, useRef, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { AuthContext } from "../providers/AuthProvider";

// Registration form validation schema
const registerSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Full name is required")
        .min(3, "Full name must be at least 3 characters"),
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .matches(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers and underscores"
        ),
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [usernameStatus, setUsernameStatus] = useState({
        checked: false,
        available: false,
        message: "",
    });
    const [checkingUsername, setCheckingUsername] = useState(false);
    const usernameTimeoutRef = useRef(null);

    const { createUser, updateUser, setUser, loginWithGoogle } =
        useContext(AuthContext);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    // Effect to clean up any pending timeout when component unmounts
    useEffect(() => {
        return () => {
            if (usernameTimeoutRef.current) {
                clearTimeout(usernameTimeoutRef.current);
            }
        };
    }, []);

    const handleUsernameChange = () => {
        const usernameInput = document.getElementById("username");
        const username = usernameInput.value.trim().toLowerCase();

        // Clear any existing timeout
        if (usernameTimeoutRef.current) {
            clearTimeout(usernameTimeoutRef.current);
        }

        // Only check availability if username meets minimum requirements
        if (username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username)) {
            setCheckingUsername(true);
            setUsernameStatus({
                checked: false,
                available: false,
                message: "Checking availability...",
            });

            // Debounce the API call by 500ms
            usernameTimeoutRef.current = setTimeout(() => {
                // Call API to check if username is available
                fetch(
                    `https://code-sphere-server-nu.vercel.app/users/check-username?username=${username}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.available) {
                            setUsernameStatus({
                                checked: true,
                                available: true,
                                message: "Username is available!",
                            });
                        } else {
                            setUsernameStatus({
                                checked: true,
                                available: false,
                                message: "Username is already taken.",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking username:", error);
                        setUsernameStatus({
                            checked: true,
                            available: false,
                            message: "Error checking username availability.",
                        });
                    })
                    .finally(() => {
                        setCheckingUsername(false);
                    });
            }, 500);
        } else if (username.length > 0) {
            // If username doesn't meet requirements but has content
            setUsernameStatus({
                checked: true,
                available: false,
                message:
                    "Username must be at least 3 characters and only contain letters, numbers, and underscores.",
            });
        } else {
            // If username is empty
            setUsernameStatus({
                checked: false,
                available: false,
                message: "",
            });
        }

        // Set the formatted username back to the input field
        usernameInput.value = username;
    };

    // Handle email/password registration
    const onSubmit = async (data) => {
        try {
            // Check if username is available before proceeding
            if (!usernameStatus.available) {
                // First check if we need to verify the username
                const username = data.username.trim().toLowerCase();

                // Make one final check if the username is available
                const response = await fetch(
                    `https://code-sphere-server-nu.vercel.app/users/check-username?username=${username}`
                );
                const checkResult = await response.json();

                if (!checkResult.available) {
                    toast.error(
                        "Username is already taken. Please choose a different username."
                    );
                    return;
                }

                // Update username status if it's available
                setUsernameStatus({
                    checked: true,
                    available: true,
                    message: "Username is available!",
                });
            }

            setIsLoading(true);

            // Regular email/password registration
            try {
                const userCredential = await createUser(
                    data.email,
                    data.password
                );
                const user = userCredential.user;

                const userInfo = {
                    email: data.email,
                    role: "user", // default role
                    username: data.username.toLowerCase(),
                    badge: "bronze", // default badge
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString(),
                };

                try {
                    const response = await fetch(
                        `https://code-sphere-server-nu.vercel.app/users`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(userInfo),
                        }
                    );

                    if (response.ok) {
                        console.log("User created successfully");
                    } else {
                        throw new Error("Failed to create user in database");
                    }

                    await updateUser({ displayName: data.fullName });

                    setUser({
                        ...user,
                        displayName: data.fullName,
                        role: "user", // default role
                        username: data.username.toLowerCase(),
                        badge: "bronze", // default badge
                    });

                    toast.success("Registration successful");
                    console.log("Registration successful");
                    // Reset form after successful registration
                    reset();
                    // Navigate to home or previous page
                    navigate(location?.state?.from || "/");
                } catch (error) {
                    toast.error(
                        `User creation or profile update failed: ${error.message}`
                    );
                    console.error("Error:", error);
                }
            } catch (error) {
                toast.error(`Registration failed: ${error.message}`);
                console.error("Registration error:", error.message);
            }
        } catch (error) {
            toast.error(`Registration error: ${error.message}`);
            console.error("Registration error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google registration
    const handleGoogleRegister = async () => {
        try {
            setIsGoogleLoading(true);
            const result = await loginWithGoogle();
            const googleUser = result.user;

            // Check if user exists in database
            const response = await fetch(
                `https://code-sphere-server-nu.vercel.app/users/${googleUser.email}`
            );

            if (response.ok) {
                // User exists, proceed with login
                const userData = await response.json();
                setUser({
                    ...googleUser,
                    username: userData.username,
                    role: userData.role || "user",
                    badge: userData.badge || "bronze",
                });
                toast.success("Login successful");
                navigate(location.state ? location.state : "/");
            } else {
                // User doesn't exist, create a new user in the database
                // Generate a random username based on displayName or email
                const baseUsername = googleUser.displayName
                    ? googleUser.displayName.toLowerCase().replace(/\s+/g, "_")
                    : googleUser.email.split("@")[0];
                const randomSuffix = Math.floor(
                    Math.random() * 10000
                ).toString();
                const username = `${baseUsername}_${randomSuffix}`;

                // Create new user in database
                const userInfo = {
                    email: googleUser.email,
                    role: "user", // As specified in requirements
                    username: username,
                    displayName: googleUser.displayName || "",
                    photoURL: googleUser.photoURL || "",
                    last_log_in: new Date().toISOString(),
                    badge: "bronze", // As specified in requirements
                    aboutMe: "",
                    created_at: new Date().toISOString(),
                };

                try {
                    const createResponse = await fetch(
                        `https://code-sphere-server-nu.vercel.app/users`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(userInfo),
                        }
                    );

                    if (createResponse.ok) {
                        // Update user state
                        setUser({
                            ...googleUser,
                            username: username,
                            role: "admin",
                            badge: "Gold",
                        });

                        toast.success("Registration successful!");
                        navigate(location.state ? location.state : "/");
                    } else {
                        throw new Error("Failed to create user account");
                    }
                } catch (error) {
                    console.error("Error creating user:", error);
                    toast.error("Failed to create account. Please try again.");
                }
            }
        } catch (error) {
            console.error("Google registration error:", error);
            toast.error(error.message || "Google registration failed");
        } finally {
            setIsGoogleLoading(false);
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
                        Sign Up
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="fullName"
                                className="text-sm font-medium"
                            >
                                Full Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="pl-10 h-12 border-2 focus:border-primary transition-all-smooth"
                                    {...register("fullName")}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="username"
                                className="text-sm font-medium"
                            >
                                Username
                            </Label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="pl-10 h-12 border-2 focus:border-primary transition-all-smooth"
                                    {...register("username")}
                                    onInput={() => {
                                        handleUsernameChange();
                                    }}
                                />
                            </div>
                            {checkingUsername && (
                                <p className="text-blue-500 text-sm mt-1 animate-pulse">
                                    Checking username availability...
                                </p>
                            )}
                            {!checkingUsername && usernameStatus.checked && (
                                <p
                                    className={`text-sm mt-1 animate-fade-in ${
                                        usernameStatus.available
                                            ? "text-green-500"
                                            : "text-orange-500"
                                    }`}
                                >
                                    {usernameStatus.message}
                                </p>
                            )}
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
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
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </Label>
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
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium"
                            >
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="pl-10 h-12 border-2 focus:border-primary transition-all-smooth"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1 animate-fade-in">
                                    {errors.confirmPassword.message}
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
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    Sign Up
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/auth/login"
                                className="text-primary hover:underline font-medium transition-colors"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or register with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 border-2 flex items-center justify-center gap-2 hover:bg-muted/50 transition-all-smooth"
                        onClick={handleGoogleRegister}
                        disabled={isGoogleLoading}
                    >
                        {isGoogleLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                <span>Connecting...</span>
                            </div>
                        ) : (
                            <>
                                <FaGoogle className="h-5 w-5 text-primary" />
                                <span>Sign up with Google</span>
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
