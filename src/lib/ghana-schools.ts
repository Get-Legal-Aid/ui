// Major universities and tertiary institutions in Ghana
export const GHANA_UNIVERSITIES = [
  // Public Universities
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology (KNUST)",
  "University of Cape Coast",
  "University of Education, Winneba",
  "University for Development Studies",
  "University of Mines and Technology",
  "University of Energy and Natural Resources",
  "University of Health and Allied Sciences",
  "C.K. Tedam University of Technology and Applied Sciences",
  "Simon Diedong Dombo University of Business and Integrated Development Studies",
  "Accra Technical University",
  "Kumasi Technical University",
  "Takoradi Technical University",
  "Tamale Technical University",
  "Sunyani Technical University",
  "Ho Technical University",
  "Koforidua Technical University",
  "Wa Technical University",
  "Bolgatanga Technical University",
  "Cape Coast Technical University",

  // Private Universities
  "Ashesi University",
  "Central University",
  "Valley View University",
  "Ghana Christian University College",
  "Presbyterian University College",
  "Methodist University College Ghana",
  "Wisconsin International University College",
  "Lancaster University Ghana",
  "Webster University Ghana",
  "Academic City University College",
  "Pentecost University",
  "Regent University College of Science and Technology",
  "Ghana Technology University College",
  "Zenith University College",
  "Catholic University College of Ghana",
  "Trinity Theological Seminary",

  // Law Schools
  "Ghana School of Law",

  // Other
  "Other",
] as const;

export type GhanaSchool = typeof GHANA_UNIVERSITIES[number];
