import { Link, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen mt-10">
                <div className="border max-w-100 mx-auto rounded-3xl m-4">
                    <div className="flex  items-center space-x-4 p-4">
                        <Tabs>
                            <TabsList>
                                <TabsTrigger value="account">
                                    <Link to="/auth/login">Login</Link>
                                </TabsTrigger>
                                <TabsTrigger value="password">
                                    <Link to="/auth/register">Register</Link>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="border-t w-full">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;
