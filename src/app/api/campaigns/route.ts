import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma-client";
import { cookies } from "next/headers";
import {
    type GenerateLoginPayloadParams,
    type VerifyLoginPayloadParams,
    createAuth,
} from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

const secretKey: string = process.env.SECRET_KEY || "";
const privateKey: string = process.env.ACCOUNT_PRIVATE_KEY || "";

const client = createThirdwebClient({ secretKey });

export const thirdwebAuth = createAuth({
    domain: "localhost:3000",
    client,
    adminAccount: privateKeyToAccount({ client, privateKey }),
    login: {
        statement: "Click Sign only means you have proved this wallet is owned by you. We will use the public wallet address to fetch your NFTs. This request will not trigger any blockchain transaction or cost any gas fees.",
        version: "1",
        uri: "localhost:3000",
    },
});


export async function POST(req: NextRequest) {
    try {
        const jwt = req.cookies.get("jwt")?.value;

        if (!jwt) {
            return NextResponse.json(
                { message: "Unauthorized. Please sign in to create a campaign" },
                { status: 401 }
            );
        }

        const payload = await thirdwebAuth.verifyJWT({ jwt: jwt });
        console.log("the payload inside the thing is ", payload)
        if (!payload.valid) {
            return NextResponse.json({ message: "Invalid JWT" }, { status: 401 });
        }
        const walletAddress = payload.parsedJWT.sub;

        // Find user by wallet
        const user = await prisma.user.findUnique({ where: { smartWalletAddress: walletAddress } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        console.log("the userid is ", user.id)
        const {
            title,
            description,
            goalAmount,
            category,
            imageUrl,
            deadline,
            ipfsHash,
        } = await req.json();

        if (!title || !description || !goalAmount || !deadline || !ipfsHash) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const campaign = await prisma.campaign.create({
            data: {
                title,
                description,
                goalAmount: parseFloat(goalAmount),
                category,
                imageUrl: imageUrl || null,
                deadline: new Date(deadline),
                ipfsHash,
                creatorId: user.id,
                status: "ACTIVE",
            },
        });
        console.log("the campaign is ", campaign)
        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error("Error creating campaign:", error);
        return NextResponse.json(
            { message: "Failed to create campaign", error: (error as Error).message },
            { status: 500 }
        );
    }
}




export async function GET(req: NextRequest) {
    try {
        const jwt = req.cookies.get("jwt")?.value;

        if (!jwt) {
            return NextResponse.json(
                { message: "Unauthorized. Please sign in to fetch campaigns" },
                { status: 401 }
            );
        }

        const payload = await thirdwebAuth.verifyJWT({ jwt: jwt });

        if (!payload.valid) {
            return NextResponse.json({ message: "Invalid JWT" }, { status: 401 });
        }

        const walletAddress = payload.parsedJWT.sub;

        // Find user by wallet address
        const user = await prisma.user.findUnique({
            where: { smartWalletAddress: walletAddress },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Fetch campaigns by creatorId
        const campaigns = await prisma.campaign.findMany({
            where: { creatorId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(campaigns, { status: 200 });

    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return NextResponse.json(
            { message: "Failed to fetch campaigns", error: (error as Error).message },
            { status: 500 }
        );
    }
}
