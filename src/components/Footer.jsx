import { Link } from "react-router";
import { Code, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        console.log("Newsletter signup:", email);
        setEmail("");
    };

    return (
        <footer className="bg-gradient-to-br from-muted/50 to-muted border-t">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4 animate-fade-in">
                        <Link
                            href="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-105 transition-transform">
                                <Code className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold text-gradient">
                                CodeSphere
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Building the future of online communities. Connect,
                            share, and grow with developers worldwide.
                        </p>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary transition-all-smooth hover:scale-110"
                            >
                                <Github className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary transition-all-smooth hover:scale-110"
                            >
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary transition-all-smooth hover:scale-110"
                            >
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div
                        className="space-y-4 animate-slide-in-left"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <h3 className="font-semibold text-foreground">
                            Quick Links
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {[
                                { href: "/", label: "Home" },
                                { href: "/membership", label: "Membership" },
                                { href: "/about", label: "About Us" },
                                { href: "/contact", label: "Contact" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 transform"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Resources */}
                    <div
                        className="space-y-4 animate-slide-in-left"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <h3 className="font-semibold text-foreground">
                            Resources
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {[
                                { href: "#", label: "Documentation" },
                                { href: "#", label: "API Reference" },
                                { href: "#", label: "Community Guidelines" },
                                { href: "#", label: "Help Center" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 transform"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Newsletter */}
                    <div
                        className="space-y-4 animate-slide-in-right"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <h3 className="font-semibold text-foreground">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Get the latest updates and announcements delivered
                            to your inbox.
                        </p>
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="space-y-2"
                        >
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 h-10 border-2 focus:border-primary transition-all-smooth"
                                    required
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth hover:scale-105 px-4"
                                >
                                    <Mail className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            &copy; {new Date().getFullYear()} ForumApp. All
                            rights reserved.
                        </span>
                    </div>
                    <nav className="flex gap-6">
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            Cookie Policy
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
