import { prisma } from "@/utils/prisma-client";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const wallet_address = body.wallet_address;
        const smart_wallet_address = body.smart_wallet_address;

        console.log(`address is ${wallet_address} smart wallet address is ${smart_wallet_address}`);

        if (!smart_wallet_address || !wallet_address) {
            return new Response(JSON.stringify({ message: "Missing smart_wallet_address or wallet_address" }), {
                status: 400,
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                smartWalletAddress: smart_wallet_address,
            },
        });

        if (existingUser) {
            console.log("existing user", existingUser);
            return new Response(JSON.stringify({ message: "User already exists", user: existingUser }), {
                status: 200,
            });
        }

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                smartWalletAddress: smart_wallet_address,
                wallet: wallet_address,
            },
        });

        console.log("createdUser", newUser);
        return new Response(JSON.stringify({ message: "User created successfully", user: newUser }), {
            status: 201,
        });
    } catch (err: any) {
        console.error("Unexpected error:", err);
        return new Response(
            JSON.stringify({ message: "Unexpected error", error: err.message || err.toString() }),
            { status: 500 }
        );
    }
}
