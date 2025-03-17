"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import { useRequireOnboarding } from "@/lib/onboarding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, FileText, Users, BarChart3, QrCode, MapPin, LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@stackframe/stack";


type JobSite = {
  id: string;
  name: string;
  address: string;
  activeWorkers: number;
};

// Type definitions for component props
interface DashboardStatProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description: string;
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

interface JobSitesListProps {
  sites: JobSite[];
}

// Define types for user metadata
interface ClientReadOnlyMetadata {
  role?: string;
  jobTitle?: string;
  companyName?: string;
  [key: string]: unknown;
}

interface StackUser {
  displayName?: string;
  clientMetadata?: Record<string, unknown>;
  clientReadOnlyMetadata?: ClientReadOnlyMetadata;
}

// Admin Dashboard Component
const AdminDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage users and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Site Management</CardTitle>
          <CardDescription>Create and manage job sites</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/admin/sites">Manage Sites</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Dashboard Stats Card Component
const DashboardStat = ({ title, value, icon: Icon, description }: DashboardStatProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Quick Action Card Component
const QuickAction = ({ title, description, link }: QuickActionProps) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild className="w-full">
        <Link href={link}>Go</Link>
      </Button>
    </CardContent>
  </Card>
);

// Job Sites List Component
const JobSitesList = ({ sites }: JobSitesListProps) => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {sites.length > 0 ? (
      sites.map((site) => (
        <Card key={site.id}>
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
            <CardDescription>{site.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <span>{site.activeWorkers} active workers</span>
            </div>
          </CardContent>
        </Card>
      ))
    ) : (
      <p className="text-muted-foreground">No job sites found</p>
    )}
  </div>
);

export default function DashboardPage() {
  useRequireOnboarding(); // Call the hook but don't destructure any unused variables
  
  const { user, loading } = useAuth();
  const stackUser = useUser() as StackUser | null;
  const router = useRouter();
  const [recentSites, setRecentSites] = useState<JobSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Prevent unauthorized access
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Fetch recent job sites
  useEffect(() => {
    const fetchRecentSites = async () => {
      try {
        const response = await fetch("/api/job-sites?limit=4");
        if (response.ok) {
          const data = await response.json();
          setRecentSites(data.jobSites);
        }
      } catch (error) {
        console.error("Error fetching recent sites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRecentSites();
    }
  }, [user]);

  // Handle loading state
  if (loading || isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load your dashboard</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Extract user metadata safely - only get what we need
  const clientReadOnlyMetadata = stackUser?.clientReadOnlyMetadata || {};

  // Determine user role
  const userRole = clientReadOnlyMetadata?.role || user?.role || "USER";
  const isAdmin = ["ADMIN", "CEO"].includes(userRole?.toUpperCase() || "");

  // Get job title and company name
  const jobTitle = clientReadOnlyMetadata?.jobTitle || "No Title";
  const companyName = clientReadOnlyMetadata?.companyName || "No Company";

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome back, {stackUser?.displayName || user.name}!
        {jobTitle !== "No Title" && (
          <span className="ml-2 text-sm">
            ({jobTitle} at {companyName})
          </span>
        )}
      </p>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <DashboardStat title="Job Sites" value={recentSites.length} icon={MapPin} description="Active job sites" />
            <DashboardStat title="Inductions" value={12} icon={ClipboardList} description="Completed inductions" />
            <DashboardStat title="SWMS" value={8} icon={FileText} description="Signed SWMS" />
            <DashboardStat title="Hours" value={42} icon={BarChart3} description="Hours this week" />
          </div>

          <h2 className="text-2xl font-bold mt-8">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QuickAction title="Sign In to Site" description="Scan QR code or select a site to sign in" icon={QrCode} link="/job-sites" />
            <QuickAction title="Complete Inductions" description="View and complete required site inductions" icon={ClipboardList} link="/inductions" />
            <QuickAction title="Sign SWMS" description="Review and sign Safe Work Method Statements" icon={FileText} link="/swms" />
          </div>
        </TabsContent>

        {/* Job Sites Tab */}
        <TabsContent value="sites" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Recent Job Sites</h2>
            <Button asChild>
              <Link href="/job-sites">View All Sites</Link>
            </Button>
          </div>

          <JobSitesList sites={recentSites} />
        </TabsContent>

        {/* Admin Tab */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-8">
            <AdminDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}