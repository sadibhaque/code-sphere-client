"use client";

import { Link } from "react-router";
import { Code, Bell, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useUser } from "@/lib/user-context";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const { user, logout } = [];
    const [announcementCount] = useState(2);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    setIsLoggedIn;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full  transition-all-smooth",
                isScrolled ? "bg-accent" : "bg-background"
            )}
        >
            <div className="container mx-auto max-w-10/12 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-105 transition-transform">
                        <Code className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold text-gradient">
                        CodeSphere
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium hover:text-primary transition-colors relative group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                    <Link
                        to="/membership"
                        className="text-sm font-medium hover:text-primary transition-colors relative group"
                    >
                        Membership
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-muted/50 transition-all-smooth hover:scale-105"
                    >
                        <Bell className="h-5 w-5" />
                        {announcementCount > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                                {announcementCount}
                            </span>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>

                    {/* User Menu or Login Button */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                                >
                                    <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                                        <AvatarImage
                                            src={
                                                user?.image ||
                                                "/placeholder-user.jpg"
                                            }
                                            alt={user?.name}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                            {user?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56 animate-scale-in"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link
                                        to={
                                            user?.isAdmin
                                                ? "/dashboard/admin"
                                                : "/dashboard/user"
                                        }
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all-smooth hover:scale-105 shadow-md">
                                Join Us
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-sm animate-fade-in">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/membership"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Membership
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
