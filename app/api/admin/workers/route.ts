import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth-utils";
import { startOfWeek } from "date-fns";

export async function GET(request: Request) {
  try {
    // Get the current user from the request
    const currentUser = await getUserFromRequest(request);
    if (!currentUser?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the user is an admin
    const user = await prisma.user.findUnique({
      where: { email: currentUser.email },
      include: { details: true },
    });

    if (!user || user.details?.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const siteId = url.searchParams.get("siteId");
    const dateFrom = url.searchParams.get("from") ? new Date(url.searchParams.get("from") as string) : undefined;
    const dateTo = url.searchParams.get("to") ? new Date(url.searchParams.get("to") as string) : undefined;
    const search = url.searchParams.get("search") || "";
    const email = url.searchParams.get("email") || undefined;

    // Get the start of the current week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    // Fetch all workers (users with role USER)
    const workers = await prisma.user.findMany({
      where: {
        details: {
          role: "USER"
        },
        ...(email && { email }),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { details: { company: { contains: search, mode: "insensitive" } } },
          ]
        } : {}),
      },
      include: {
        details: {
          include: {
            attendances: {
              where: {
                ...(siteId && { jobSiteId: siteId }),
                ...(dateFrom && { signInTime: { gte: dateFrom } }),
                ...(dateTo && { signInTime: { lte: dateTo } }),
              },
              include: { jobSite: true },
            },
            inductions: {
              where: {
                ...(dateFrom && { completedAt: { gte: dateFrom } }),
                ...(dateTo && { completedAt: { lte: dateTo } }),
              },
            },
            swmsSignoffs: {
              where: {
                ...(dateFrom && { signedAt: { gte: dateFrom } }),
                ...(dateTo && { signedAt: { lte: dateTo } }),
              },
            },
          },
        },
      },
    });

    // Transform data for the frontend
    const transformedWorkers = workers.map((worker) => {
      // Find current active attendance (if any)
      const activeAttendance = worker.details?.attendances?.find((a) => a.signOutTime === null);

      // Calculate total hours this week
      const weeklyAttendances = worker.details?.attendances?.filter((a) => {
        const signInDate = new Date(a.signInTime);
        return signInDate >= weekStart && a.signOutTime !== null;
      }) || [];

      const totalHoursThisWeek = weeklyAttendances.reduce((total, attendance) => {
        if (!attendance.signOutTime) return total;
        const signInTime = new Date(attendance.signInTime).getTime();
        const signOutTime = new Date(attendance.signOutTime).getTime();
        return total + (signOutTime - signInTime) / (1000 * 60 * 60);
      }, 0);

      return {
        id: worker.id,
        name: worker.name || "Unknown",
        email: worker.email,
        company: worker.details?.company || "",
        currentSite: activeAttendance ? activeAttendance.jobSite.name : null,
        signInTime: activeAttendance ? activeAttendance.signInTime.toISOString() : null,
        totalHoursThisWeek,
        completedInductions: worker.details?.inductions?.length || 0,
        signedSwms: worker.details?.swmsSignoffs?.length || 0,
      };
    });

    return NextResponse.json({ workers: transformedWorkers });
  } catch (error) {
    console.error("Error fetching admin worker data:", error);
    return NextResponse.json({ message: "An error occurred while fetching worker data" }, { status: 500 });
  }
}