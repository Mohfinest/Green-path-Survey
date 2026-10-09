/**
 * Configuration constants for the application.
 * Google Apps Script Web App endpoint connected to the research Google Sheet.
 */
export const GOOGLE_APPS_SCRIPT_URL: string =
  (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) ||
  'https://script.google.com/macros/s/AKfycbxEpRaxSV5h6wG_vWFNbEuM4D2lEhlGr0gWYgBQNHoroih14_08xPu0jKh5R5pAJUnB/exec';
