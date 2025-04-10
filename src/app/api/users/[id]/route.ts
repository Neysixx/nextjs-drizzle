import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
    params: {
        id: string;
    };
}

// GET handler for retrieving a single user
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const user = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);

        if (user.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user[0]);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT handler for updating a user
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const updatedData = await request.json();
        const updatedUser = await db
            .update(usersTable)
            .set(updatedData)
            .where(eq(usersTable.id, id))
            .returning();

        if (updatedUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser[0]);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE handler for removing a user
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const deletedUser = await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();

        if (deletedUser.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(deletedUser[0]);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
