import { SidebarContext } from "@/contexts/SidebarContext";
import { useState } from "react";

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen((prev) => !prev);
    const closeSidebar = () => setIsOpen(false);
    const openSidebar = () => setIsOpen(true);

    return (
        <SidebarContext.Provider
            value={{ isOpen, toggleSidebar, closeSidebar, openSidebar }}
        >
            {children}
        </SidebarContext.Provider>
    );
}
