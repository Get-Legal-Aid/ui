import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUpSchema } from "@/services/auth/auth.schema";
import type {
	SignUpFormData,
	SignUpRequest,
	ApiError,
} from "@/services/auth/auth.types";
import { useSignUp } from "@/services/auth/auth.hooks";
import { isAxiosError } from "axios";
import { useState } from "react";
import { RoleSelection } from "./role-selection";
import { BiodataForm } from "./biodata-form";
import { CareerForm } from "./career-form";

export default function Register() {
	const navigate = useNavigate();
	const [step, setStep] = useState<1 | 2 | 3>(1);
	const signUpMutation = useSignUp();

	const form = useForm<SignUpFormData>({
		resolver: zodResolver(signUpSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			role: undefined,
			// Lawyer fields
			companyName: undefined,
			practiceArea: undefined,
			yearOfCall: undefined,
			operatingRegion: undefined,
			// Student fields
			schoolName: undefined,
			expectedGraduationYear: undefined,
		},
	});

	const role = form.watch("role");

	const handleStep1Next = () => {
		const role = form.getValues("role");
		if (!role) {
			form.setError("role", { message: "Please select a role" });
			return;
		}
		form.clearErrors("role");
		setStep(2);
	};

	const handleStep2Next = async () => {
		const isValid = await form.trigger(["email", "firstName", "lastName"]);
		if (isValid) {
			setStep(3);
		}
	};

	const onSubmit = async (data: SignUpFormData) => {
		const signupData: SignUpRequest = {
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			role: data.role,
		};

		// Add role-specific fields
		if (data.role === "LAWYER") {
			signupData.companyName = data.companyName;
			signupData.practiceArea = data.practiceArea;
			signupData.yearOfCall = data.yearOfCall;
			signupData.operatingRegion = data.operatingRegion;
		} else if (data.role === "STUDENT") {
			signupData.schoolName = data.schoolName;
			signupData.expectedGraduationYear = data.expectedGraduationYear;
		}

		try {
			// Save signup data to session storage for resend OTP functionality
			sessionStorage.setItem("pendingSignup", JSON.stringify(signupData));

			await signUpMutation.mutateAsync(signupData);
			toast.success(
				"Account created! Please check your email for OTP verification code."
			);
			navigate(`/register/verify?e=${encodeURIComponent(data.email)}`);
		} catch (error) {
			if (isAxiosError<ApiError>(error) && error.response?.data) {
				toast.error(
					error.response.data.error.message ||
						"Failed to create account"
				);
			} else {
				toast.error("Failed to create account");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen py-8">
			<Card className="w-full max-w-md rounded-4xl pt-14">
				<CardContent className="">
					<div className="flex flex-col items-center space-y-8">
						<img className="size-16" src="/logo_blue.png" />

						<div className="space-y-2 text-center">
							<h1 className="text-2xl text-foreground font-serif">
								Join GetLegalAid
							</h1>
						</div>

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(
									onSubmit,
									(errors) => {
										// Display specific error messages
										if (errors.companyName) {
											toast.error(
												errors.companyName.message ||
													"Please enter company name"
											);
										} else if (errors.schoolName) {
											toast.error(
												errors.schoolName.message ||
													"Please enter school name"
											);
										} else if (errors.yearOfCall) {
											toast.error(
												errors.yearOfCall.message ||
													"Please enter year of call"
											);
										} else if (
											errors.expectedGraduationYear
										) {
											toast.error(
												errors.expectedGraduationYear
													.message ||
													"Please enter expected graduation year"
											);
										} else if (errors.practiceArea) {
											toast.error(
												errors.practiceArea.message ||
													"Please enter practice area"
											);
										} else if (errors.operatingRegion) {
											toast.error(
												errors.operatingRegion
													.message ||
													"Please select operating region"
											);
										} else {
											toast.error(
												"Please complete all required fields correctly"
											);
										}
									}
								)}
								className="w-full space-y-6">
								{step === 1 && (
									<RoleSelection
										form={form}
										onNext={handleStep1Next}
									/>
								)}

								{step === 2 && (
									<BiodataForm
										form={form}
										onNext={handleStep2Next}
										onBack={() => setStep(1)}
									/>
								)}

								{step === 3 && role && (
									<CareerForm
										form={form}
										role={role}
										onBack={() => setStep(2)}
										isSubmitting={signUpMutation.isPending}
									/>
								)}
							</form>
						</Form>

						<div className="w-full space-y-4">
							<p className="text-center text-sm text-muted-foreground">
								Already have an account?{" "}
								<Link
									to="/login"
									className="underline hover:text-foreground font-medium">
									Login
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
