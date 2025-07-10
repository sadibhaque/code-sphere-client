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
import { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Dummy users data
const dummyUsers = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        subscriptionStatus: "Free",
        isAdmin: true,
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "4",
        name: "Alice Brown",
        email: "alice@example.com",
        subscriptionStatus: "Free",
        isAdmin: false,
    },
    {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "6",
        name: "Diana Prince",
        email: "diana@example.com",
        subscriptionStatus: "Free",
        isAdmin: false,
    },
    {
        id: "7",
        name: "Eve Adams",
        email: "eve@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "8",
        name: "Frank White",
        email: "frank@example.com",
        subscriptionStatus: "Free",
        isAdmin: false,
    },
    {
        id: "9",
        name: "Grace Lee",
        email: "grace@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "10",
        name: "Henry Green",
        email: "henry@example.com",
        subscriptionStatus: "Free",
        isAdmin: false,
    },
    {
        id: "11",
        name: "Ivy King",
        email: "ivy@example.com",
        subscriptionStatus: "Premium",
        isAdmin: false,
    },
    {
        id: "12",
        name: "Jack Black",
        email: "jack@example.com",
        subscriptionStatus: "Free",
        isAdmin: false,
    },
];

export default function ManageUsers() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState(dummyUsers);
    const usersPerPage = 10; // 10 users per page as per challenge task

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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
                                    {user.name}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.subscriptionStatus}</TableCell>
                                <TableCell className="flex justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMakeAdmin(user.id)}
                                        disabled={user.isAdmin}
                                    >
                                        {user.isAdmin ? "Admin" : "Make Admin"}
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
