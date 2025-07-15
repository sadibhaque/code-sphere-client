import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";
import Loading from "../components/Loading";

export default function DashboardRedirect() {
    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();

    useEffect(() => {
        if (userHook?.role) {
            if (userHook.role === "admin") {
                navigate("/dashboard/admin", { replace: true });
            } else {
                navigate("/dashboard/user", { replace: true });
            }
        }
    }, [userHook?.role, navigate]);

    return (
        <div className="flex items-center justify-center h-64">
            <Loading />
        </div>
    );
}
