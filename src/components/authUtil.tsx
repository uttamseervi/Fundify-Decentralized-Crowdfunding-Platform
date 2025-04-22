
'use client'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setWalletConnectionStatus } from "@/store/reducers/userReducer"
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
const AuthUtil = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    console.log(`The current path is ${pathname}`)


    useEffect(() => {
        const walletAddress = localStorage.getItem("walletAddress")
        if (!walletAddress){
                router.push("/auth");
        }
        else {
            dispatch(setWalletConnectionStatus(true))
        }
    }, [])



    return (
        <main>
            {children}
        </main>
    )
}

export default AuthUtil
