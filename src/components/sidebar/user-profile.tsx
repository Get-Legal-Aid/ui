import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutModal } from "@/components/logout/logout-modal";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { MoreVertical, LogOut, UserCircle, Settings, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { isMobile } = useSidebar();
	const [showLogoutModal, setShowLogoutModal] = useState(false);

	if (!user) return null;

	const getInitials = () => {
		return `${user.firstName.charAt(0)}${user.lastName.charAt(
			0
		)}`.toUpperCase();
	};

	const userName = `${user.firstName} ${user.lastName}`;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src="" alt={userName} />
								<AvatarFallback className="rounded-lg text-sidebar-accent font-bold">
									{getInitials()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{userName}
								</span>
								<span className="text-background/60 truncate text-xs">
									{user.email}
								</span>
							</div>
							<MoreVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src="" alt={userName} />
									<AvatarFallback className="rounded-lg">
										{getInitials()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{userName}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/settings/profile")}>
								<UserCircle />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate("/settings")}>
								<Settings />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setShowLogoutModal(true)}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>

			<LogoutModal
				open={showLogoutModal}
				onOpenChange={setShowLogoutModal}
			/>
		</SidebarMenu>
	);
}
