import { ThirdwebStorage } from "@thirdweb-dev/storage"
import { getContract } from "thirdweb"
import { ethers } from "ethers"
import { client } from "@/app/client"
import { sepolia } from "thirdweb/chains"

// Export a function to get the contract instance
export const getCampaignContract = (): any => {
    const contractAddress = process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT_ADDRESS as string
    const contract = getContract({
        client,
        address: contractAddress,
        chain: sepolia
    })
    return contract
}

// Export a function for IPFS storage (optional)
export const uploadImageToIPFS = async (imageFile: File): Promise<string> => {
    const storage = new ThirdwebStorage({
        clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID,
    })
    const cid = await storage.upload(imageFile)
    return `https://ipfs.io/ipfs/${cid}`
}
