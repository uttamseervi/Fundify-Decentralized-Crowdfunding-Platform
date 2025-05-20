"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useActiveWallet } from "thirdweb/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const activeWallet = useActiveWallet()
  console.log("the active wallet is ", activeWallet)
  const router = useRouter();



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-[#f3f4f6] shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <span className="font-bricolage text-xl font-bold text-neutral-800">
            Fundify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Home
          </Link>
          <Link
            href="/campaigns"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            Explore
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            How It Works
          </Link>

          {isLoggedIn ? (
            <Button
              asChild
              variant="outline"
              className="border-neutral-300 text-neutral-700"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="bg-[#4c6ef5] hover:bg-[#4c6ef5]/90 text-white"
            >
              <Link href="/auth">Start Journey</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center justify-center md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-neutral-700" />
          ) : (
            <Menu className="h-6 w-6 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="container flex flex-col gap-4 bg-[#f3f4f6] px-4 pb-6 md:hidden"
        >
          <Link
            href="/"
            className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/campaigns"
            className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            onClick={() => setIsOpen(false)}
          >
            Explore
          </Link>
          <Link
            href="/how-it-works"
            className="py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            onClick={() => setIsOpen(false)}
          >
            How It Works
          </Link>

          {isLoggedIn ? (
            <Button
              asChild
              variant="outline"
              className="mt-2 w-full border-neutral-300 text-neutral-700"
            >
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="mt-2 w-full bg-[#4c6ef5] hover:bg-[#4c6ef5]/90 text-white"
            >
              <Link href="/auth" onClick={() => setIsOpen(false)}>
                Start Journey
              </Link>
            </Button>
          )}
        </motion.div>
      )}
    </header>
  );
}
