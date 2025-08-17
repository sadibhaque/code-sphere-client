import { useEffect, useMemo, useState } from "react";
import useUser from "./useUser";

// Lightweight role resolver with sessionStorage cache and background refresh.
// Returns: { role, loading }
export default function useRole(user) {
    const email = user?.email || null;
    const [cached, setCached] = useState(() => {
        if (!email) return null;
        try {
            const v = sessionStorage.getItem(`role:${email}`);
            return v ? JSON.parse(v) : null;
        } catch {
            return null;
        }
    });

    // Fetch profile via existing hook (uses axiosSecure under the hood)
    const profile = useUser(user);

    // Derived role with fast-path from cache
    const role = useMemo(
        () => profile?.role || cached || null,
        [profile?.role, cached]
    );

    // Loading is true until we have either cached role or fetched role when email exists
    const loading = !!email && role == null;

    // When profile resolves, update cache
    useEffect(() => {
        if (email && profile?.role) {
            try {
                sessionStorage.setItem(
                    `role:${email}`,
                    JSON.stringify(profile.role)
                );
                setCached(profile.role);
            } catch {
                // ignore quota/security errors
            }
        }
    }, [email, profile?.role]);

    // If user changes (email change), clear cached role for previous
    useEffect(() => {
        if (!email) setCached(null);
    }, [email]);

    return { role, loading };
}
