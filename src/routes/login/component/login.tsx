import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema } from "@/services/auth/auth.schema";
import type { LoginFormData, ApiError } from "@/services/auth/auth.types";
import { useSignIn } from "@/services/auth/auth.hooks";
import { isAxiosError } from "axios";

export default function Login() {
	const navigate = useNavigate();
	const signInMutation = useSignIn();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			await signInMutation.mutateAsync(data.email);
			toast.success("OTP code has been sent to your email");
			navigate(`/login/verify?e=${encodeURIComponent(data.email)}`);
		} catch (error) {
			if (isAxiosError<ApiError>(error) && error.response?.data) {
				toast.error(
					error.response.data.error.message || "Failed to send OTP"
				);
			} else {
				toast.error("Failed to send OTP");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="w-full max-w-md rounded-4xl pt-14">
				<CardContent className="">
					<div className="flex flex-col items-center space-y-8">
						<img className="size-16" src="/logo_blue.png" />

						<div className="space-y-2 text-center">
							<h1 className="text-2xl text-foreground font-serif">
								Access GetLegalAid
							</h1>
							<p className="text-sm text-muted-foreground">
								Connecting those who need legal help with
								lawyers ready to serve
							</p>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="email"
													placeholder="Enter your email address"
													className="w-full rounded-xl"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className="flex flex-col gap-2">
									<Button
										type="submit"
										className="w-full rounded-xl"
										size="lg"
										disabled={signInMutation.isPending}>
										{signInMutation.isPending
											? "Sending..."
											: "Send verification code"}
									</Button>
								</div>
							</form>
						</Form>

						<div className="w-full space-y-4">
							<p className="text-center text-sm text-muted-foreground">
								Don't have an account?{" "}
								<Link
									to="/register"
									className="underline hover:text-foreground font-medium">
									Register
								</Link>
							</p>

							<p className="text-center text-xs w-11/12 mx-auto text-muted-foreground">
								You acknowledge that you read, and agree, to our{" "}
								<a
									href="#"
									className="underline hover:text-foreground">
									Terms of Service
								</a>{" "}
								and our{" "}
								<a
									href="#"
									className="underline hover:text-foreground">
									Privacy Policy
								</a>
								.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
