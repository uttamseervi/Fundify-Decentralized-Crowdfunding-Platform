import { prisma } from "@/utils/prisma-client";

export async function POST(req: Request) {
    const { name, email, userId } = await req.json();
    console.log(name, email, userId);

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404 }
            );
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                username: name,
                email,
            },
        });

        return new Response(
            JSON.stringify({ message: "User updated", user: updatedUser }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to update user:", error);
        return new Response(
            JSON.stringify({ message: "Failed to update user", error }),
            { status: 500 }
        );
    }
}
