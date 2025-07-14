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
import { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios/unsafe/axios.js";
import { useQuery } from "@tanstack/react-query";

export default function ManageUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const { data: users = [] } = useQuery(["users"], async () => {
        const response = await axios.get("http://localhost:3000/get-all-users");
        return response.data;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleMakeAdmin = (userId) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === userId ? { ...user, isAdmin: true } : user
            )
        );
        alert(`User with ID ${userId} is now an admin!`);
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
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.username}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.badge}</TableCell>
                                <TableCell className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMakeAdmin(user.id)}
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
