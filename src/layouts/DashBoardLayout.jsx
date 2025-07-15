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
import { Button } from "@/components/ui/button";
import useUser from "../hooks/useUser";
import useAuth from "../hooks/useAuth";

export default function DashBoardLayout() {
    const { user } = useAuth();
    const userHook = useUser(user);
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

    const navItems = userHook?.role === "admin" ? adminNavItems : userNavItems;
    const dashboardType = userHook?.role === "admin" ? "Admin" : "User";

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <Navbar />
            <SidebarProvider>
                <div className="flex flex-1 min-h-0">
                    <Sidebar className="border-r">
                        <SidebarHeader className="border-b px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-2">
                                <LayoutDashboard className="h-5 w-5 sm:h-6 sm:w-6" />
                                <h2 className="text-base sm:text-lg font-semibold truncate">
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

                    <main className="flex-1 flex flex-col min-w-0">
                        <header className="border-b px-4 sm:px-6 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger className="lg:hidden" />
                                <h1 className="text-lg sm:text-xl font-semibold truncate">
                                    {navItems.find(
                                        (item) => pathname === item.to
                                    )?.label || `${dashboardType} Dashboard`}
                                </h1>
                            </div>
                        </header>

                        <div className="flex-1 p-4 sm:p-6 overflow-x-hidden">
                            <div className="max-w-full overflow-x-auto">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </SidebarProvider>
            <Footer />
        </div>
    );
}
