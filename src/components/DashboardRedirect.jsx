import { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import useRole from "../hooks/useRole";

export default function DashboardRedirect() {
    const { user } = useAuth();
    const { role, loading } = useRole(user);
    const navigate = useNavigate();

    useEffect(() => {
        if (role) {
            if (role === "admin") {
                navigate("/dashboard/admin", { replace: true });
            } else {
                navigate("/dashboard/user", { replace: true });
            }
        }
    }, [role, navigate]);

    return (
        <div className="flex items-center justify-center h-64">
            {loading ? <Loading /> : null}
        </div>
    );
}
