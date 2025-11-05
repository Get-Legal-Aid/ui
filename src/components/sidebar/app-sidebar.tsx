"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Briefcase, Home, Settings, Trophy } from "lucide-react";
import type { Route } from "./nav-main";
import DashboardNavigation from "@/components/sidebar/nav-main";
import { NotificationsPopover } from "@/components/sidebar/nav-notifications";
import { UserProfile } from "@/components/sidebar/user-profile";
import { useAuth } from "@/contexts/auth-context";

const sampleNotifications = [
	{
		id: "1",
		avatar: "/avatars/01.png",
		fallback: "JD",
		text: "New case submitted for review.",
		time: "10m ago",
	},
	{
		id: "2",
		avatar: "/avatars/02.png",
		fallback: "SM",
		text: "Lawyer accepted your case.",
		time: "1h ago",
	},
	{
		id: "3",
		avatar: "/avatars/03.png",
		fallback: "AL",
		text: "Case status updated.",
		time: "2h ago",
	},
];

// Base routes for all authenticated users
const baseRoutes: Route[] = [
	{
		id: "dashboard",
		title: "Dashboard",
		icon: <Home className="size-4" />,
		link: "/",
	},
];

// Lawyer-specific case routes
const lawyerCasesRoute: Route = {
	id: "cases",
	title: "Cases",
	icon: <Briefcase className="size-4" />,
	link: "/cases",
	subs: [
		{ title: "All Cases", link: "/cases" },
		{ title: "My Cases", link: "/my-cases" },
	],
};

// Student-specific case routes
const studentCasesRoute: Route = {
	id: "cases",
	title: "Cases",
	icon: <Briefcase className="size-4" />,
	link: "/research-hub",
	subs: [
		{ title: "All Cases", link: "/cases" },
		{ title: "Research Hub", link: "/research-hub" },
	],
};

// Common routes for all users
const commonRoutes: Route[] = [
	{
		id: "leaderboard",
		title: "Leaderboard",
		icon: <Trophy className="size-4" />,
		link: "/leaderboard",
	},
	{
		id: "settings",
		title: "Settings",
		icon: <Settings className="size-4" />,
		link: "/settings",
		subs: [{ title: "Profile", link: "/settings/profile" }],
	},
];

export function DashboardSidebar() {
	const { state } = useSidebar();
	const { user } = useAuth();
	const isCollapsed = state === "collapsed";

	// Build routes based on user role
	const getDashboardRoutes = (): Route[] => {
		let routes = [...baseRoutes];

		// Add role-specific case routes
		if (user?.role === "LAWYER") {
			routes = [...routes, lawyerCasesRoute];
		} else if (user?.role === "STUDENT") {
			routes = [...routes, studentCasesRoute];
		} else {
			// Admin or other roles get basic cases route
			routes = [
				...routes,
				{
					id: "cases",
					title: "Cases",
					icon: <Briefcase className="size-4" />,
					link: "/cases",
				},
			];
		}

		// Add common routes
		routes = [...routes, ...commonRoutes];

		return routes;
	};

	const dashboardRoutes = getDashboardRoutes();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader
				className={cn(
					"flex md:pt-3.5",
					isCollapsed
						? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
						: "flex-row items-center justify-between"
				)}>
				<a href="#" className="flex items-center gap-2">
					<img className="size-8" src="/logo_white.png" />
				</a>

				<motion.div
					key={isCollapsed ? "header-collapsed" : "header-expanded"}
					className={cn(
						"flex items-center gap-2",
						isCollapsed
							? "flex-row md:flex-col-reverse"
							: "flex-row"
					)}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}>
					<NotificationsPopover notifications={sampleNotifications} />
					<SidebarTrigger />
				</motion.div>
			</SidebarHeader>
			<SidebarContent className="gap-4 px-2 py-4">
				<DashboardNavigation routes={dashboardRoutes} />
			</SidebarContent>
			<SidebarFooter className="px-2 pb-2">
				<UserProfile />
			</SidebarFooter>
		</Sidebar>
	);
}
