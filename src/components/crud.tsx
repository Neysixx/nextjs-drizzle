"use client";

import { useState, useEffect } from "react";
import { User, NewUser } from "../db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner"

export default function CRUD() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const form = useForm<Omit<NewUser, "id">>({
        defaultValues: {
            name: "",
            age: 0,
            email: "",
        },
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setIsLoading(true);
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            toast("An error occurred while fetching users")
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(data: Omit<NewUser, "id">) {
        setIsLoading(true);
        try {
            if (editMode && currentUserId !== null) {
                // Update user
                await fetch(`/api/users/${currentUserId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                toast("User updated successfully")
                setEditMode(false);
                setCurrentUserId(null);
            } else {
                // Create user
                await fetch("/api/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                toast("User created successfully")
            }
            form.reset({
                name: "",
                age: 0,
                email: "",
            });
            fetchUsers();
        } catch (error) {
            toast("An error occurred while processing the request")
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteUser(id: number) {
        setIsLoading(true);
        try {
            await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });
            toast("User deleted successfully")
            fetchUsers();
        } catch (error) {
            toast("An error occurred while deleting the user")
        } finally {
            setIsLoading(false);
        }
    }

    function editUser(user: User) {
        form.reset({
            name: user.name,
            age: user.age,
            email: user.email,
        });
        setEditMode(true);
        setCurrentUserId(user.id);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Next.js + Drizzle + Shadcn/UI CRUD Demo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{editMode ? "Edit User" : "Create New User"}</CardTitle>
                        <CardDescription>
                            {editMode
                                ? "Update an existing user's information"
                                : "Add a new user to the database"}
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter name"
                                    {...form.register("name", { required: true })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Enter age"
                                    {...form.register("age", {
                                        required: true,
                                        valueAsNumber: true,
                                        min: 0,
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email"
                                    {...form.register("email", { required: true })}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {editMode && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        form.reset({
                                            name: "",
                                            age: 0,
                                            email: "",
                                        });
                                        setEditMode(false);
                                        setCurrentUserId(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Processing..."
                                    : editMode
                                        ? "Update User"
                                        : "Create User"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Users List</CardTitle>
                        <CardDescription>Manage existing users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.age}</TableCell>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => editUser(user)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            onClick={fetchUsers}
                            className="w-full"
                            disabled={isLoading}
                        >
                            Refresh Users
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
