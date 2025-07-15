import React from "react";
import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    PlusCircle,
    List,
    Users,
    Bell,
    MessageSquareWarning,
} from "lucide-react";

export function AppSidebar({ navItems, onClose }) {
    const { pathname } = useLocation();

    return (
        <div className="flex flex-col h-full w-64 bg-muted/40 border-r">
            {/* Sidebar Header */}
            <div className="flex h-14 items-center border-b px-4">
                <Link
                    to="/dashboard/user"
                    className="flex items-center gap-2 font-semibold"
                    onClick={onClose}
                >
                    <LayoutDashboard className="h-6 w-6" />
                    <span>Dashboard</span>
                </Link>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
                <nav className="grid items-start px-2 text-sm font-medium">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                pathname === item.to && "bg-muted text-primary"
                            )}
                            onClick={onClose}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="flex h-14 items-center border-t px-4">
                <span className="text-sm text-muted-foreground">
                    © 2025 CodeSphere
                </span>
            </div>
        </div>
    );
}
