"use client";

import { useRouter } from "next/navigation";
import { ConnectButton, useAdminWallet } from "thirdweb/react";
import { client } from "../client";
import {
    generatePayload,
    isLoggedIn,
    login,
    logout,
} from "@/actions/auth";
import { createWallet } from "thirdweb/wallets";
import { sepolia } from "thirdweb/chains";
import { useToast } from "@/hooks/use-toast";

export default function ConnectionButton({ type = "signin" }) {
    const wallets = [createWallet("io.metamask")];
    const router = useRouter();
    const adminWallet = useAdminWallet();
    const { toast } = useToast();

    return (
        <ConnectButton
            client={client}
            accountAbstraction={{
                chain: sepolia,
                sponsorGas: true,
            }}
            wallets={wallets}
            auth={{
                isLoggedIn: async () => {
                    const result = await isLoggedIn();
                    console.log("🔍 isLoggedIn:", result);
                    return result;
                },
                getLoginPayload: async ({ address }) => {
                    console.log("⚙️ getLoginPayload: Received address:", address);
                    const payload = await generatePayload({ address, chainId: 11155111 });
                    console.log("📦 Generated login payload:", payload);
                    return payload;
                },
                doLogin: async (params) => {
                    console.log("✅ Performing login with params:", params);
                    await login(params);
                    console.log("🎉 Login successful. Redirecting to dashboard...");
                    router.push("/dashboard");
                },
                doLogout: async () => {
                    console.log("logging out!");
                    await logout();
                    router.push("/auth")
                },
            }}
        />
    );
}
