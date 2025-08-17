import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
});

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    );

    // Apply selected or system theme to the root element
    useEffect(() => {
        const root = window.document.documentElement;
        const apply = (mode) => {
            root.classList.remove("light", "dark");
            root.classList.add(mode);
        };

        if (theme === "system") {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            apply(mq.matches ? "dark" : "light");
            return;
        }

        apply(theme);
    }, [theme]);

    // When in system mode, respond to OS theme changes in real-time
    useEffect(() => {
        if (theme !== "system") return;
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => {
            const root = window.document.documentElement;
            root.classList.toggle("dark", mq.matches);
            root.classList.toggle("light", !mq.matches);
        };
        mq.addEventListener?.("change", onChange);
        // Fallback for older browsers
        mq.addListener?.(onChange);
        return () => {
            mq.removeEventListener?.("change", onChange);
            mq.removeListener?.(onChange);
        };
    }, [theme]);

    const value = {
        theme,
        setTheme: (nextTheme) => {
            localStorage.setItem(storageKey, nextTheme);
            setTheme(nextTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
