// Ghana's 16 administrative regions
export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Western",
  "Western North",
  "Volta",
  "Oti",
  "Northern",
  "Upper East",
  "Upper West",
  "Savannah",
  "North East",
  "Bono",
  "Bono East",
  "Ahafo",
] as const;

export type GhanaRegion = typeof GHANA_REGIONS[number];
