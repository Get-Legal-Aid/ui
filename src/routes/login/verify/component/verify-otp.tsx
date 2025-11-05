import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOtpSchema } from "@/services/auth/auth.schema";
import type { VerifyOtpFormData, ApiError } from "@/services/auth/auth.types";
import { useResendOtp, useVerifyOtp } from "@/services/auth/auth.hooks";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";

export default function VerifyOTP() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const email = searchParams.get("e") || "";
	const [resendTimer, setResendTimer] = useState(0);
	const [canResend, setCanResend] = useState(true);

	const { signIn } = useAuth();
	const verifyOtpMutation = useVerifyOtp();
	const resendOtpMutation = useResendOtp();

	const form = useForm<VerifyOtpFormData>({
		resolver: zodResolver(verifyOtpSchema),
		defaultValues: {
			otp: "",
		},
	});

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setTimeout(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (resendTimer === 0 && !canResend) {
			setCanResend(true);
		}
	}, [resendTimer, canResend]);

	const handleResendCode = async () => {
		if (!canResend || !email) return;
		try {
			await resendOtpMutation.mutateAsync({ email });
			toast.success(
				"New verification code sent. Please check your email."
			);
			setResendTimer(60);
			setCanResend(false);
		} catch (error) {
			if (isAxiosError<ApiError>(error) && error.response?.data) {
				toast.error(
					error.response.data.error.message || "Failed to resend OTP"
				);
			} else {
				toast.error("Failed to resend OTP");
			}
		}
	};

	const onSubmit = async (data: VerifyOtpFormData) => {
		if (!email) {
			toast.error("Email is missing");
			return;
		}

		try {
			// Verify OTP and get user data (cookies are set automatically by server)
			const user = await verifyOtpMutation.mutateAsync({
				email,
				otp: data.otp,
			});

			// Store user data in auth context
			signIn(user);

			toast.success("Welcome to GetLegalAid!");
			navigate("/");
		} catch (error) {
			if (isAxiosError<ApiError>(error) && error.response?.data) {
				toast.error(
					error.response.data.error.message ||
						"Invalid or expired OTP code"
				);
			} else {
				toast.error("Invalid or expired OTP code");
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
								Check your email
							</h1>
							<p className="text-sm text-muted-foreground">
								We've sent a verification code to your email
							</p>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="w-full space-y-4">
								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem className="flex flex-col items-center">
											<FormLabel>
												Verification code
											</FormLabel>
											<FormControl>
												<InputOTP
													maxLength={6}
													{...field}>
													<InputOTPGroup>
														<InputOTPSlot
															index={0}
															className="size-15 text-lg"
														/>
														<InputOTPSlot
															index={1}
															className="size-15 text-lg"
														/>
														<InputOTPSlot
															index={2}
															className="size-15 text-lg"
														/>
														<InputOTPSlot
															index={3}
															className="size-15 text-lg"
														/>
														<InputOTPSlot
															index={4}
															className="size-15 text-lg"
														/>
														<InputOTPSlot
															index={5}
															className="size-15 text-lg"
														/>
													</InputOTPGroup>
												</InputOTP>
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
										disabled={verifyOtpMutation.isPending}>
										{verifyOtpMutation.isPending
											? "Verifying..."
											: "Verify and continue"}
									</Button>
									<Button
										variant="ghost"
										className="w-full rounded-xl"
										size="lg"
										asChild>
										<Link to="/login">Back to login</Link>
									</Button>
								</div>
							</form>
						</Form>

						<p className="text-center text-xs text-muted-foreground">
							Didn't receive the code?{" "}
							<button
								onClick={handleResendCode}
								disabled={
									!canResend || resendOtpMutation.isPending
								}
								className="underline hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline">
								{resendOtpMutation.isPending
									? "Sending..."
									: canResend
									? "Resend code"
									: `Resend code in ${resendTimer}s`}
							</button>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
