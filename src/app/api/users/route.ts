import { NextResponse } from "next/server";
import { db } from "@/db";
import { usersTable, NewUser } from "@/db/schema";

// GET handler for retrieving all users
export async function GET() {
    try {
        const users = await db.select().from(usersTable);
        return NextResponse.json(users);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST handler for creating a new user
export async function POST(request: Request) {
    try {
        const newUser = await request.json() as NewUser;
        const insertedUsers = await db.insert(usersTable).values(newUser).returning();
        return NextResponse.json(insertedUsers[0], { status: 201 });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
