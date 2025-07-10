import { Link } from "react-router";
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    PlusCircle,
    List,
    Users,
    Bell,
    MessageSquareWarning,
    Menu,
} from "lucide-react";

// import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UserDashboard from "../pages/Dashboard/UserDashoard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import ManageUsers from "../pages/Dashboard/ManageUsers";

export default function DashBoardLayout({ children }) {
    const { pathname } = useLocation();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // const router = useNavigate();

    const user = {
        name: "mendax",
        email: "mendax@example.com",
        badge: "bronze",
    };

    // useEffect(() => {
    //     // Dummy authentication check for dashboard access
    //     if (!user?.isLoggedIn) {
    //         router("/login");
    //     }
    // }, [user, router]);

    // if (!user?.isLoggedIn) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
    //             <p>Redirecting to login...</p>
    //         </div>
    //     );
    // }

    const userNavItems = [
        { to: "/dashboard/user", icon: User, label: "My Profile" },
        {
            to: "/dashboard/user/add-post",
            icon: PlusCircle,
            label: "Add Post",
        },
        { to: "/dashboard/user/my-posts", icon: List, label: "My Posts" },
    ];

    const adminNavItems = [
        { to: "/dashboard/admin", icon: User, label: "Admin Profile" },
        {
            to: "/dashboard/admin/manage-users",
            icon: Users,
            label: "Manage Users",
        },
        {
            to: "/dashboard/admin/reported-comments",
            icon: MessageSquareWarning,
            label: "Reported Comments",
        },
        {
            to: "/dashboard/admin/make-announcement",
            icon: Bell,
            label: "Make Announcement",
        },
    ];

    // const navItems = user.isAdmin ? adminNavItems : userNavItems;
    const navItems = adminNavItems;

    return (
        <div>
            <Navbar></Navbar>
            <div className="grid min-h-[calc(100vh-14rem)] w-full lg:grid-cols-[220px_1fr] xl:grid-cols-[280px_1fr]">
                {/* Desktop Sidebar */}
                <div className="hidden border-r bg-muted/40 lg:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link
                                to="/dashboard/user"
                                className="flex items-center gap-2 font-semibold"
                            >
                                <LayoutDashboard className="h-6 w-6" />
                                <span>Dashboard</span>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        to={item.to}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                            pathname === item.href &&
                                                "bg-muted text-primary"
                                        )}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        {/* Mobile Sidebar Trigger */}
                        <Sheet
                            open={isMobileSidebarOpen}
                            onOpenChange={setIsMobileSidebarOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                    aria-label="Toggle sidebar"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex flex-col w-64"
                            >
                                <div className="flex h-14 items-center border-b px-4">
                                    <Link
                                        href="/dashboard/user"
                                        className="flex items-center gap-2 font-semibold"
                                        onClick={() =>
                                            setIsMobileSidebarOpen(false)
                                        }
                                    >
                                        <LayoutDashboard className="h-6 w-6" />
                                        <span>Dashboard</span>
                                    </Link>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <nav className="grid items-start px-2 text-sm font-medium">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                                    pathname === item.href &&
                                                        "bg-muted text-primary"
                                                )}
                                                onClick={() =>
                                                    setIsMobileSidebarOpen(
                                                        false
                                                    )
                                                } // Close sheet on link click
                                            >
                                                <item.icon className="h-4 w-4" />
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                        <h1 className="text-lg font-semibold md:text-2xl">
                            {navItems.find((item) =>
                                pathname.startsWith(item.to)
                            )?.label || "Dashboard"}
                        </h1>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <Outlet></Outlet>
                    </main>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}
