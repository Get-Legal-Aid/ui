import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { GHANA_REGIONS } from "@/lib/ghana-regions";
import { GHANA_UNIVERSITIES } from "@/lib/ghana-schools";
import { PRACTICE_AREAS } from "@/lib/practice-areas";
import type { UseFormReturn } from "react-hook-form";
import type { SignUpFormData } from "@/services/auth/auth.types";

interface CareerFormProps {
	form: UseFormReturn<SignUpFormData>;
	role: "LAWYER" | "STUDENT" | "ADMIN";
	onBack: () => void;
	isSubmitting: boolean;
}

export function CareerForm({
	form,
	role,
	onBack,
	isSubmitting,
}: CareerFormProps) {
	const [isOtherSchool, setIsOtherSchool] = useState(false);
	const [customSchoolName, setCustomSchoolName] = useState("");
	const schoolNameValue = form.watch("schoolName");

	const [isOtherPracticeArea, setIsOtherPracticeArea] = useState(false);
	const [customPracticeArea, setCustomPracticeArea] = useState("");
	const practiceAreaValue = form.watch("practiceArea");

	// Check if current value is from the predefined list
	useEffect(() => {
		const handleCustomValue = (
			value: string | undefined,
			list: readonly string[],
			setter: (val: string) => void
		) => {
			if (value && !list.includes(value) && value !== "Other") {
				setter(value);
			}
		};

		handleCustomValue(schoolNameValue, GHANA_UNIVERSITIES, setCustomSchoolName);
		handleCustomValue(practiceAreaValue, PRACTICE_AREAS, setCustomPracticeArea);
	}, [schoolNameValue, practiceAreaValue]);

	return (
		<>
			<div className="space-y-2 text-center">
				<h2 className="text-xl font-medium text-foreground">
					{role === "LAWYER"
						? "Professional Details"
						: role === "STUDENT"
						? "Education Details"
						: "Almost there!"}
				</h2>
				<p className="text-sm text-muted-foreground">
					{role === "LAWYER"
						? "Tell us about your legal practice"
						: role === "STUDENT"
						? "Tell us about your education"
						: "Complete your registration"}
				</p>
			</div>

			<div className="space-y-4">
				{role === "LAWYER" && (
					<>
						<FormField
							control={form.control}
							name="companyName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Law Firm / Company Name</FormLabel>
									<FormControl>
										<Input
											placeholder="e.g. Bentsi-Enchill, Letsa & Ankomah"
											className="rounded-xl"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{!isOtherPracticeArea ? (
							<FormField
								control={form.control}
								name="practiceArea"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Practice Area</FormLabel>
										<Select
											onValueChange={(value) => {
												if (value === "Other") {
													setIsOtherPracticeArea(true);
													setCustomPracticeArea("");
													field.onChange("");
												} else {
													field.onChange(value);
												}
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="rounded-xl w-full">
													<SelectValue placeholder="Select your practice area" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-[300px]">
												{PRACTICE_AREAS.map((area) => (
													<SelectItem key={area} value={area}>
														{area}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : (
							<FormField
								control={form.control}
								name="practiceArea"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Practice Area</FormLabel>
										<div className="space-y-2">
											<FormControl>
												<Input
													placeholder="Enter your practice area"
													className="rounded-xl"
													value={customPracticeArea}
													onChange={(e) => {
														setCustomPracticeArea(e.target.value);
														field.onChange(e.target.value);
													}}
												/>
											</FormControl>
											<button
												type="button"
												onClick={() => {
													setIsOtherPracticeArea(false);
													setCustomPracticeArea("");
													field.onChange(undefined);
												}}
												className="text-xs text-muted-foreground hover:text-foreground underline"
											>
												Select from list instead
											</button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="yearOfCall"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Year of Call to the Bar</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Year admitted to Bar"
											className="rounded-xl"
											{...field}
											onChange={(e) =>
												field.onChange(
													e.target.value ? parseInt(e.target.value) : undefined
												)
											}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="operatingRegion"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Operating Region</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger className="rounded-xl w-full">
												<SelectValue placeholder="Select your region" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{GHANA_REGIONS.map((region) => (
												<SelectItem key={region} value={region}>
													{region}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				{role === "STUDENT" && (
					<>
						{!isOtherSchool ? (
							<FormField
								control={form.control}
								name="schoolName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>School Name</FormLabel>
										<Select
											onValueChange={(value) => {
												if (value === "Other") {
													setIsOtherSchool(true);
													setCustomSchoolName("");
													field.onChange("");
												} else {
													field.onChange(value);
												}
											}}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="rounded-xl w-full">
													<SelectValue placeholder="Select your school" />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="max-h-[300px]">
												{GHANA_UNIVERSITIES.map((school) => (
													<SelectItem key={school} value={school}>
														{school}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						) : (
							<FormField
								control={form.control}
								name="schoolName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>School Name</FormLabel>
										<div className="space-y-2">
											<FormControl>
												<Input
													placeholder="Enter your school name"
													className="rounded-xl"
													value={customSchoolName}
													onChange={(e) => {
														setCustomSchoolName(e.target.value);
														field.onChange(e.target.value);
													}}
												/>
											</FormControl>
											<button
												type="button"
												onClick={() => {
													setIsOtherSchool(false);
													setCustomSchoolName("");
													field.onChange(undefined);
												}}
												className="text-xs text-muted-foreground hover:text-foreground underline"
											>
												Select from list instead
											</button>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<FormField
							control={form.control}
							name="expectedGraduationYear"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Expected Year of Graduation</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Expected graduation year"
											className="rounded-xl"
											{...field}
											onChange={(e) =>
												field.onChange(
													e.target.value ? parseInt(e.target.value) : undefined
												)
											}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</>
				)}

				{role === "ADMIN" && (
					<div className="text-center py-8 text-muted-foreground">
						<p>No additional information required for admin accounts.</p>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<Button
					type="submit"
					className="w-full rounded-xl"
					size="lg"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Creating account..." : "Create account"}
				</Button>
				<Button
					type="button"
					variant="ghost"
					onClick={onBack}
					className="w-full rounded-xl"
					size="lg"
				>
					Back
				</Button>
			</div>
		</>
	);
}
