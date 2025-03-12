import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle, LogIn } from "lucide-react"
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

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Platform Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to improve site safety?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of construction sites using our platform to streamline safety processes and compliance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/register" className="inline-flex items-center gap-2">
                Get Started Today <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login" className="inline-flex items-center gap-2">
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    title: "Attendance",
    description: "Multiple sign-on methods for easy site attendance tracking.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Inductions",
    description: "Reduce induction time from 30 minutes to just 5 minutes.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "SWMS Management",
    description: "Easily approve or reject Safe Work Method Statements.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Worker Credentials",
    description: "Autofill worker information and verify credentials.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Mobile Signatures",
    description: "Capture handwritten signatures on any mobile device.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
  {
    title: "Data & Reporting",
    description: "Customizable reports and insights for better decision making.",
    icon: <CheckCircle className="h-6 w-6" />,
  },
]

