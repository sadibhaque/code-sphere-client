import { Link, useLocation } from "react-router";
import {
    LayoutDashboard,
    User,
    PlusCircle,
    List,
    Users,
    Bell,
    MessageSquareWarning,
    Menu,
    ArrowLeft,
} from "lucide-react";

import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/Loading";
import { Button } from "@/components/ui/button";

export default function DashBoardLayout() {
    const { user } = useAuth();
    const userHook = useUser(user);
    const { role, loading } = useRole(user);
    const { pathname } = useLocation();

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loading />
            </div>
        );
    }

    const effectiveRole = role || userHook?.role;
    const navItems = effectiveRole === "admin" ? adminNavItems : userNavItems;
    const dashboardType = effectiveRole === "admin" ? "Admin" : "User";

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* <Navbar /> */}
            <SidebarProvider>
                <div className="flex flex-1 h-full">
                    <Sidebar className="border-r">
                        <SidebarHeader className="border-b px-4 sm:px-6 py-4 bg-background">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
                                <h2 className="text-base py-1 sm:text-lg font-semibold truncate">
                                    {dashboardType} Dashboard
                                </h2>
                            </div>
                        </SidebarHeader>

                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    Navigation
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {navItems.map((item) => (
                                            <SidebarMenuItem key={item.to}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={
                                                        pathname === item.to
                                                    }
                                                >
                                                    <Link to={item.to}>
                                                        <item.icon className="h-4 w-4" />
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarFooter className="border-t px-4 sm:px-6 py-4">
                            <div className="text-xs text-muted-foreground">
                                © 2025 CodeSphere
                            </div>
                        </SidebarFooter>
                    </Sidebar>

                    <main className="flex-1 flex flex-col h-full">
                        <header className="flex-shrink-0 border-b px-4 sm:px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex justify-between items-center gap-4">
                                <SidebarTrigger className="lg:hidden" />
                                <h1 className="text-lg sm:text-xl font-semibold truncate">
                                    {navItems.find(
                                        (item) => pathname === item.to
                                    )?.label || `${dashboardType} Dashboard`}
                                </h1>
                                <Link to="/">
                                    <Button className="bg-primary">
                                        <ArrowLeft></ArrowLeft> Home
                                    </Button>
                                </Link>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto">
                            <div className="p-4 sm:p-6">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
            {/* <Footer /> */}
        </div>
    );
}
