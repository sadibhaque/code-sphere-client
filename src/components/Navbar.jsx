import { Link, useLocation, useNavigate } from "react-router";
import {
    Code,
    Bell,
    LayoutDashboard,
    LogOut,
    Menu,
    X,
    Calendar,
} from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
// import { useUser } from "@/lib/user-context";
import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "sonner";
import axios from "axios/unsafe/axios.js";
import { ModeToggle } from "@/components/ModeToggle";

export default function Navbar() {
    const { user, logoutUser } = useContext(AuthContext);
    const [announcementCount, setAnnouncementCount] = useState(2);
    const [announcements, setAnnouncements] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        }
        axios
            .get("https://code-sphere-server-nu.vercel.app/announcements-count")
            .then((response) => {
                const totalAnnouncements = response.data.totalAnnouncements;
                setAnnouncementCount(totalAnnouncements);
            });
    }, [user]);

    // Function to fetch latest announcements for the notification modal
    const fetchLatestAnnouncements = async () => {
        try {
            const response = await axios.get(
                "https://code-sphere-server-nu.vercel.app/announcements"
            );
            // Get the latest 4 announcements, sorted by creation date
            const latest = response.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 4);
            setAnnouncements(latest);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
            toast.error("Failed to load announcements");
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logged out successfully");
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Smoothly navigate to a section on the home page
    const goToSection = async (id, closeMobile = false) => {
        const scrollToTarget = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                // Reflect hash in URL without reloading (guarded)
                if (window?.history?.replaceState) {
                    window.history.replaceState(null, "", `/#${id}`);
                }
            }
        };

        if (location.pathname !== "/") {
            navigate("/");
            // wait a tick for the home to render
            setTimeout(scrollToTarget, 100);
        } else {
            scrollToTarget();
        }

        if (closeMobile) setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full  transition-all-smooth",
                isScrolled ? "bg-background" : "bg-background"
            )}
        >
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12 border-b h-16 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
                >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-105 transition-transform">
                        <Code className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold text-gradient">
                        CodeSphere
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Desktop Navigation - varies by auth (3 when logged out, 5 when logged in) */}
                    <nav className="hidden md:flex items-center gap-6 mr-2">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-primary transition-colors relative group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                        {/* Explore section */}
                        <button
                            type="button"
                            onClick={() => goToSection("posts")}
                            className="text-sm font-medium hover:text-primary transition-colors relative group"
                        >
                            Explore
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </button>
                        {/* Topics section */}
                        <button
                            type="button"
                            onClick={() => goToSection("topics")}
                            className="text-sm font-medium hover:text-primary transition-colors relative group"
                        >
                            Topics
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </button>
                        {/* Membership visible only when logged in */}
                        {isLoggedIn && (
                            <Link
                                to="/membership"
                                className="text-sm font-medium hover:text-primary transition-colors relative group"
                            >
                                Membership
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        )}
                        {/* When logged in, show Dashboard as the 5th visible link */}
                        {isLoggedIn && (
                            <Link
                                to={
                                    user?.role === "admin" ||
                                    user?.metadata?.role === "admin"
                                        ? "/dashboard/admin"
                                        : "/dashboard/user"
                                }
                                className="text-sm font-medium hover:text-primary transition-colors relative group"
                            >
                                Dashboard
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        )}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="hidden md:flex">
                        <ModeToggle />
                    </div>

                    {/* Notification Bell */}
                    {isLoggedIn && (
                        <Dialog
                            open={isNotificationOpen}
                            onOpenChange={setIsNotificationOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative hover:bg-muted/50 transition-all-smooth hover:scale-105"
                                    onClick={() => {
                                        setIsNotificationOpen(true);
                                        fetchLatestAnnouncements();
                                    }}
                                >
                                    <Bell className="h-5 w-5" />
                                    {announcementCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                                            {announcementCount}
                                        </span>
                                    )}
                                    <span className="sr-only">
                                        Notifications
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Latest Announcements
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    {announcements.length > 0 ? (
                                        <ScrollArea className="h-[400px] pr-4">
                                            <div className="space-y-4">
                                                {announcements.map(
                                                    (announcement) => (
                                                        <div
                                                            key={
                                                                announcement._id
                                                            }
                                                            className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                                        >
                                                            <div className="space-y-2">
                                                                <h4 className="font-semibold text-sm leading-tight">
                                                                    {
                                                                        announcement.title
                                                                    }
                                                                </h4>{" "}
                                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                                    {
                                                                        announcement.description
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                    <Calendar className="h-3 w-3" />
                                                                    <span>
                                                                        {new Date(
                                                                            announcement.createdAt
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="text-xs"
                                                                    >
                                                                        New
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                No announcements available
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

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
                                                user?.photoURL ||
                                                "/placeholder-user.jpg"
                                            }
                                            alt={user?.displayName}
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                            {user?.displayName?.charAt(0) ||
                                                user?.email?.charAt(0)}
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
                                            {user?.displayName || "User"}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* Protected routes */}
                                {user?.role === "admin" ||
                                user?.metadata?.role === "admin" ? (
                                    <>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/admin">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/admin/manage-users">
                                                Manage Users
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/admin/reported-comments">
                                                Reported Comments
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/admin/make-announcement">
                                                Make Announcement
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/membership">
                                                Membership
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/user">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>My Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/user/add-post">
                                                Add Post
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/dashboard/user/my-posts">
                                                My Posts
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            asChild
                                            className="cursor-pointer"
                                        >
                                            <Link to="/membership">
                                                Membership
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link to="/auth/login">
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
                        <div className="flex justify-end mb-2">
                            <ModeToggle />
                        </div>
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <button
                            type="button"
                            className="text-left text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => goToSection("posts", true)}
                        >
                            Explore
                        </button>
                        <button
                            type="button"
                            className="text-left text-sm font-medium hover:text-primary transition-colors"
                            onClick={() => goToSection("topics", true)}
                        >
                            Topics
                        </button>
                        {isLoggedIn && (
                            <Link
                                to="/membership"
                                className="text-sm font-medium hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Membership
                            </Link>
                        )}
                        {isLoggedIn && (
                            <>
                                <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
                                    Dashboard & Tools
                                </div>
                                {user?.role === "admin" ||
                                user?.metadata?.role === "admin" ? (
                                    <>
                                        <Link
                                            to="/dashboard/admin"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <Link
                                            to="/dashboard/admin/manage-users"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Manage Users
                                        </Link>
                                        <Link
                                            to="/dashboard/admin/reported-comments"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Reported Comments
                                        </Link>
                                        <Link
                                            to="/dashboard/admin/make-announcement"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Make Announcement
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/dashboard/user"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            My Dashboard
                                        </Link>
                                        <Link
                                            to="/dashboard/user/add-post"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            Add Post
                                        </Link>
                                        <Link
                                            to="/dashboard/user/my-posts"
                                            className="text-sm font-medium hover:text-primary transition-colors"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            My Posts
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
