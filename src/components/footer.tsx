import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-[#f3f4f6] py-8">
      <div className="container px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <Link href="/" className="font-bricolage text-lg font-bold text-neutral-800">
              Fundify
            </Link>
          </div>

          <div className="flex gap-6">
            <Link href="/how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900">
              How It Works
            </Link>
            <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900">
              Terms
            </Link>
            <Link href="#" className="text-sm text-neutral-600 hover:text-neutral-900">
              Privacy
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Fundify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
