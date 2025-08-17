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
import Loading from "@/components/Loading";

export default function ManageUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const usersPerPage = 10;

    const { data: queryData = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            axios
                .get("https://code-sphere-server-nu.vercel.app/users")
                .then((res) => res.data),
    });

    useEffect(() => {
        setUsers(queryData);
    }, [queryData]);

    // Filter users based on search term
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleToggleUserRole = async (user) => {
        try {
            const newStatus = user.role === "user" ? "admin" : "user";
            await axios.patch(
                `https://code-sphere-server-nu.vercel.app/users/${user._id}`,
                {
                    role: newStatus,
                }
            );

            // Update local state
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u._id === user._id ? { ...u, role: newStatus } : u
                )
            );

            toast.success(`User role updated to ${newStatus}`);
        } catch (error) {
            console.error("Error updating user role:", error);
            toast.error("Failed to update user role");
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                <Input
                    placeholder="Search users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-sm"
                />
                <Button
                    onClick={() => console.log("Search triggered")}
                    className="w-full sm:w-auto"
                >
                    <Search className="h-4 w-4 mr-2" /> Search
                </Button>
            </div>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[150px]">
                                    Name
                                </TableHead>
                                <TableHead className="min-w-[200px]">
                                    Email
                                </TableHead>
                                <TableHead className="min-w-[100px]">
                                    Role
                                </TableHead>
                                <TableHead className="text-center min-w-[120px]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">
                                            <div className="truncate max-w-[150px]">
                                                {user.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="truncate max-w-[200px]">
                                                {user.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.role === "admin"
                                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleToggleUserRole(user)
                                                }
                                                className="text-xs sm:text-sm"
                                            >
                                                Make{" "}
                                                {user.role === "user"
                                                    ? "Admin"
                                                    : "User"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {!isLoading && filteredUsers.length > usersPerPage && (
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
                                            Math.min(
                                                totalPages,
                                                currentPage + 1
                                            )
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
            )}
        </div>
    );
}
