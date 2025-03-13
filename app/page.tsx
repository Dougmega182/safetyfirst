import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Admin Sign In */}
      <div className="absolute top-4 right-4">
        <Button asChild variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
          <Link href="/auth/login">
            <LogIn className="mr-2 h-5 w-5" /> Admin Login
          </Link>
        </Button>
      </div>

      {/* Sign-Up Form */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="text-center">
          <img src="/logo.png" alt="Transform Homes Logo" className="mx-auto mb-4 h-12" />
          <h2 className="text-xl font-semibold">Safety Pass</h2>
          <p className="text-gray-600">Please sign up to continue</p>
        </div>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700">Email address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  )
}
