import { NavLink, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from '@/components/ui/button';

const AuthLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen mt-10">
                <div className="border max-w-100 mx-auto rounded-3xl m-4">
                    <div className="flex items-center space-x-4 p-4">
                        <div className="flex gap-2 items-center border rounded-2xl bg-accent">
                            <NavLink
                                to="/auth/login"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-base bg-primary text-background px-2 py-1 rounded-xl font-medium"
                                        : "text-base px-2 font-medium"
                                }
                            >
                                <span>Login</span>
                            </NavLink>
                            <NavLink
                                to="/auth/register"
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-base bg-primary text-background px-2 py-1 rounded-xl font-medium"
                                        : "text-base px-2 font-medium"
                                }
                            >
                                <span>Register</span>
                            </NavLink>
                        </div>
                    </div>
                    <div className="border-t rounded-xl w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthLayout;
