import { Navigate, useLocation } from "react-router";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loading></Loading>;
    }

    if (user) {
        return children;
    }
    return <Navigate state={location.pathname} to={`/auth/login`}></Navigate>;
};

export default PrivateRoute;
