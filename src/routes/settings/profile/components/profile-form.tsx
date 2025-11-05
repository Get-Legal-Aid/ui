import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetFullProfile,
  useUpdateUserInfo,
  useUpdateLawyerProfile,
  useUpdateStudentProfile,
} from "@/services/profile/profile.hooks";
import {
  updateUserInfoSchema,
  updateLawyerProfileSchema,
  updateStudentProfileSchema,
  type UpdateUserInfoFormData,
  type UpdateLawyerProfileFormData,
  type UpdateStudentProfileFormData,
} from "@/services/profile/profile.schema";
import { toast } from "sonner";
import { Loader2, User, Briefcase, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { isAxiosError } from "axios";
import type { ApiError } from "@/services/auth/auth.types";
import { Badge } from "@/components/ui/badge";

export function ProfileForm() {
  const { data: profile, isLoading, error } = useGetFullProfile();
  const { mutateAsync: updateUserInfo, isPending: isUpdatingUser } = useUpdateUserInfo();
  const { mutateAsync: updateLawyerProfile, isPending: isUpdatingLawyer } = useUpdateLawyerProfile();
  const { mutateAsync: updateStudentProfile, isPending: isUpdatingStudent } = useUpdateStudentProfile();

  const userForm = useForm<UpdateUserInfoFormData>({
    resolver: zodResolver(updateUserInfoSchema),
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
        }
      : undefined,
  });

  const lawyerForm = useForm<UpdateLawyerProfileFormData>({
    resolver: zodResolver(updateLawyerProfileSchema),
    values: profile?.lawyerProfile
      ? {
          companyName: profile.lawyerProfile.companyName,
          practiceArea: profile.lawyerProfile.practiceArea,
          yearOfCall: profile.lawyerProfile.yearOfCall,
          operatingRegion: profile.lawyerProfile.operatingRegion,
          bio: profile.lawyerProfile.bio || "",
        }
      : undefined,
  });

  const studentForm = useForm<UpdateStudentProfileFormData>({
    resolver: zodResolver(updateStudentProfileSchema),
    values: profile?.studentProfile
      ? {
          schoolName: profile.studentProfile.schoolName,
          expectedGraduationYear: profile.studentProfile.expectedGraduationYear,
          bio: profile.studentProfile.bio || "",
        }
      : undefined,
  });

  const onUpdateUserInfo = async (data: UpdateUserInfoFormData) => {
    try {
      await updateUserInfo(data);
      toast.success("Profile Updated", {
        description: "Your basic information has been updated successfully.",
      });
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Update Failed", {
          description:
            error.response.data.error.message || "Failed to update profile.",
        });
      } else {
        toast.error("Update Failed", {
          description: "Failed to update profile. Please try again.",
        });
      }
    }
  };

  const onUpdateLawyerProfile = async (data: UpdateLawyerProfileFormData) => {
    try {
      await updateLawyerProfile(data);
      toast.success("Profile Updated", {
        description: "Your professional information has been updated successfully.",
      });
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Update Failed", {
          description:
            error.response.data.error.message || "Failed to update profile.",
        });
      } else {
        toast.error("Update Failed", {
          description: "Failed to update profile. Please try again.",
        });
      }
    }
  };

  const onUpdateStudentProfile = async (data: UpdateStudentProfileFormData) => {
    try {
      await updateStudentProfile(data);
      toast.success("Profile Updated", {
        description: "Your academic information has been updated successfully.",
      });
    } catch (error) {
      if (isAxiosError<ApiError>(error) && error.response?.data) {
        toast.error("Update Failed", {
          description:
            error.response.data.error.message || "Failed to update profile.",
        });
      } else {
        toast.error("Update Failed", {
          description: "Failed to update profile. Please try again.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="rounded-lg border p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-serif">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                {profile.role.toLowerCase()}
              </Badge>
              <Badge variant="outline">{profile.points} Points</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>

        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(onUpdateUserInfo)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={userForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isUpdatingUser}>
              {isUpdatingUser && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </div>

      {/* Lawyer Profile */}
      {profile.role === "LAWYER" && (
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Professional Information</h3>
          </div>

          <Form {...lawyerForm}>
            <form
              onSubmit={lawyerForm.handleSubmit(onUpdateLawyerProfile)}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={lawyerForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Law firm or company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={lawyerForm.control}
                  name="practiceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practice Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Family Law" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={lawyerForm.control}
                  name="yearOfCall"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Call</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Year admitted to bar"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={lawyerForm.control}
                  name="operatingRegion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Region</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lagos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={lawyerForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience and expertise..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingLawyer}>
                {isUpdatingLawyer && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Student Profile */}
      {profile.role === "STUDENT" && (
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Academic Information</h3>
          </div>

          <Form {...studentForm}>
            <form
              onSubmit={studentForm.handleSubmit(onUpdateStudentProfile)}
              className="space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={studentForm.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your law school" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={studentForm.control}
                  name="expectedGraduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Graduation Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 2026"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value, 10))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={studentForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your interests and goals..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum 500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdatingStudent}>
                {isUpdatingStudent && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
