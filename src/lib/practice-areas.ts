// Areas of legal practice
export const PRACTICE_AREAS = [
	// Core Practice Areas
	"Corporate Law",
	"Criminal Law",
	"Civil Litigation",
	"Constitutional Law",
	"Contract Law",
	"Family Law",
	"Property Law",
	"Tort Law",
	"Administrative Law",
	"Tax Law",

	// Specialized Practice Areas
	"Intellectual Property Law",
	"Employment and Labor Law",
	"Environmental Law",
	"Immigration Law",
	"Banking and Finance Law",
	"Energy and Natural Resources Law",
	"International Law",
	"Maritime and Admiralty Law",
	"Aviation Law",
	"Media and Communications Law",
	"Sports and Entertainment Law",
	"Human Rights Law",
	"Health Law",
	"Insurance Law",
	"Consumer Protection Law",
	"Cybersecurity and Data Protection Law",

	// Emerging Practice Areas
	"Technology Law",
	"Fintech and Blockchain Law",
	"Space Law",
	"Artificial Intelligence and Robotics Law",
	"Privacy and Digital Rights Law",

	// Other
	"Other",
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];
