import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLawyers } from "@/services/auth/auth.hooks";
import {
	useGetCaseReview,
	useSuggestLawyer,
} from "@/services/cases/cases.hooks";
import { formatDistanceToNow } from "date-fns";
import {
	BookOpen,
	Edit,
	Loader2,
	Plus,
	Search,
	User,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CaseReviewProps {
	caseId: string;
	isStudent: boolean;
}

export function CaseReview({ caseId, isStudent }: CaseReviewProps) {
	const navigate = useNavigate();
	const [isSuggestingLawyer, setIsSuggestingLawyer] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [lawyerSuggestion, setLawyerSuggestion] = useState({
		lawyerId: "",
		reason: "",
	});

	const { data: review, isLoading } = useGetCaseReview(caseId);
	const { mutateAsync: suggestLawyer, isPending: isSuggestingLawyerMutation } =
		useSuggestLawyer();

	// Fetch lawyers with search functionality
	const { data: lawyersData, isLoading: isLoadingLawyers } = useLawyers({
		search: searchQuery.trim() || undefined,
		limit: 50,
	});

	const handleAddReview = () => {
		navigate(`/cases/${caseId}/reviews/create`);
	};

	const handleEditReview = () => {
		navigate(`/cases/${caseId}/reviews/create`);
	};

	const handleSuggestLawyer = async () => {
		if (!lawyerSuggestion.lawyerId) return;

		try {
			await suggestLawyer({
				caseId,
				data: {
					lawyerId: lawyerSuggestion.lawyerId,
					reason: lawyerSuggestion.reason.trim() || undefined,
				},
			});

			toast.success("Lawyer suggestion submitted successfully");
			setLawyerSuggestion({
				lawyerId: "",
				reason: "",
			});
			setIsSuggestingLawyer(false);
		} catch (err) {
			toast.error("Failed to suggest lawyer");
			console.log(err);
		}
	};

	const getInitials = (firstName: string, lastName: string): string => {
		return `${firstName[0]}${lastName[0]}`.toUpperCase();
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						Student Research
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						Student Research
					</CardTitle>
					{isStudent && (
						<div className="flex gap-2">
							<Button
								onClick={review ? handleEditReview : handleAddReview}
								size="sm"
							>
								{review ? (
									<>
										<Edit className="h-4 w-4 mr-2" />
										Update Review
									</>
								) : (
									<>
										<Plus className="h-4 w-4 mr-2" />
										Add Review
									</>
								)}
							</Button>

							{/* Suggest Lawyer Dialog */}
							<Dialog
								open={isSuggestingLawyer}
								onOpenChange={setIsSuggestingLawyer}
							>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										<UserPlus className="h-4 w-4 mr-2" />
										Suggest Lawyer
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Suggest a Lawyer</DialogTitle>
										<DialogDescription>
											Recommend a specific lawyer for this case based on their
											expertise.
										</DialogDescription>
									</DialogHeader>

									<div className="space-y-4">
										{/* Search Bar */}
										<div className="space-y-2">
											<Label htmlFor="search">Search Lawyers</Label>
											<div className="relative">
												<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="search"
													placeholder="Search by name or company..."
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													className="pl-10"
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="lawyer">Select Lawyer</Label>
											<Select
												value={lawyerSuggestion.lawyerId}
												onValueChange={(value) =>
													setLawyerSuggestion({
														...lawyerSuggestion,
														lawyerId: value,
													})
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue
														placeholder={
															isLoadingLawyers
																? "Loading lawyers..."
																: "Choose a lawyer..."
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{isLoadingLawyers ? (
														<SelectItem value="loading" disabled>
															<div className="flex items-center">
																<Loader2 className="h-4 w-4 animate-spin mr-2" />
																Loading lawyers...
															</div>
														</SelectItem>
													) : lawyersData?.lawyers?.filter(
															(lawyer) => lawyer.id && lawyer.id.trim() !== ""
													  ).length ? (
														lawyersData.lawyers
															.filter(
																(lawyer) => lawyer.id && lawyer.id.trim() !== ""
															)
															.map((lawyer) => (
																<SelectItem key={lawyer.id} value={lawyer.id}>
																	<div className="flex flex-col">
																		<span>
																			{lawyer.firstName} {lawyer.lastName}
																		</span>
																		<span className="text-xs text-muted-foreground">
																			{lawyer.lawyerProfile.practiceArea} •{" "}
																			{lawyer.lawyerProfile.companyName}
																		</span>
																	</div>
																</SelectItem>
															))
													) : (
														<SelectItem value="no-results" disabled>
															{searchQuery
																? "No lawyers found matching your search"
																: "No lawyers available"}
														</SelectItem>
													)}
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="reason">
												Reason for Suggestion (Optional)
											</Label>
											<Textarea
												id="reason"
												placeholder="Why do you recommend this lawyer for this case?"
												value={lawyerSuggestion.reason}
												onChange={(e) =>
													setLawyerSuggestion({
														...lawyerSuggestion,
														reason: e.target.value,
													})
												}
												rows={4}
											/>
										</div>
									</div>

									<DialogFooter>
										<Button
											variant="outline"
											onClick={() => setIsSuggestingLawyer(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={handleSuggestLawyer}
											disabled={
												!lawyerSuggestion.lawyerId || isSuggestingLawyerMutation
											}
										>
											{isSuggestingLawyerMutation
												? "Suggesting..."
												: "Suggest Lawyer"}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>
			</CardHeader>

			<CardContent>
				{review ? (
					<div className="space-y-6">
						{/* Research Findings */}
						<div>
							<h4 className="font-medium mb-2">Research Findings</h4>
							<p className="text-sm text-muted-foreground whitespace-pre-wrap">
								{review.findings}
							</p>
						</div>

						{/* Practice Area */}
						{review.suggestedPracticeArea && (
							<div>
								<h4 className="font-medium mb-2">Suggested Practice Area</h4>
								<Badge variant="secondary" className="text-sm">
									{review.suggestedPracticeArea}
								</Badge>
							</div>
						)}

						{/* Suggested Lawyer */}
						{review.suggestedLawyer && (
							<div>
								<h4 className="font-medium mb-2">Suggested Lawyer</h4>
								<div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
									<Avatar className="h-10 w-10">
										<AvatarFallback>
											{getInitials(
												review.suggestedLawyer.firstName,
												review.suggestedLawyer.lastName
											)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<span className="font-medium">
												{review.suggestedLawyer.firstName}{" "}
												{review.suggestedLawyer.lastName}
											</span>
										</div>
										{/* {review.suggestedLawyer.lawyerProfile?.companyName && (
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {review.suggestedLawyer.lawyerProfile.companyName}
                        </span>
                      </div>
                    )} */}
									</div>
								</div>
							</div>
						)}

						{/* Metadata */}
						<div className="pt-4 border-t">
							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<span>
									Researched by {review.reviewedBy.firstName}{" "}
									{review.reviewedBy.lastName}
								</span>
								<span>•</span>
								<span>
									{formatDistanceToNow(new Date(review.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center py-8">
						<BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No Research Available</h3>
						<p className="text-muted-foreground mb-4">
							This case hasn't been researched by students yet.
						</p>
						{isStudent && (
							<Button onClick={handleAddReview}>
								<Plus className="h-4 w-4 mr-2" />
								Add Research
							</Button>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
