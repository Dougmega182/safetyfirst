import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogIn } from "lucide-react"
import JobSiteCards from "@/components/job-site-cards"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold">Construction Safety Platform</h1>
            <p className="mb-8 text-xl">
              Streamline site safety, inductions, and compliance with our comprehensive platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
                <Link href="/auth/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
                <Link href="/auth/login">
                  <LogIn className="mr-2 h-5 w-5" /> Admin Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Sites Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Please Select Your Jobsite from Below</h2>
          <JobSiteCards />
        </div>
      </section>
    </div>
  )
}

