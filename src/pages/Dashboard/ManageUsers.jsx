import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUser from "../../hooks/useUser";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function ManageUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const usersPerPage = 10;

    const { user } = useAuth();
    const userHook = useUser(user);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    // Redirect non-admin users to user dashboard
    useEffect(() => {
        if (userHook?.role && userHook.role !== "admin") {
            navigate("/dashboard/user", { replace: true });
        }
    }, [userHook, navigate]);

    const { data = [] } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await axiosSecure.get("/get-all-users");
            return response.data;
        },
    });

    useEffect(() => {
        setUsers(data);
    }, [data]);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleMakeAdmin = async (userId) => {
        try {
            // Make API call to update user role
            await axios.patch(`http://localhost:3000/users/${userId}/role`, {
                role: "admin",
            });

            // Update local state
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userId ? { ...user, role: "admin" } : user
                )
            );

            toast.success("User has been promoted to admin");
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
                <Input
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={() => console.log("Search triggered")}>
                    <Search className="h-4 w-4 mr-2" /> Search
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User Name</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>Subscription Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentUsers.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="text-center py-4 text-muted-foreground"
                            >
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">
                                    {user.username}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.badge}</TableCell>
                                <TableCell className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleMakeAdmin(user._id)
                                        }
                                        disabled={user.role === "admin"}
                                    >
                                        {user.role === "admin"
                                            ? "Admin"
                                            : "Make Admin"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    paginate(Math.max(1, currentPage - 1));
                                }}
                                className={
                                    currentPage === 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === i + 1}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        paginate(i + 1);
                                    }}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    paginate(
                                        Math.min(totalPages, currentPage + 1)
                                    );
                                }}
                                className={
                                    currentPage === totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
