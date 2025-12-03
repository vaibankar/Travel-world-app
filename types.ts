export interface User {
  name: string;
  email: string;
}

export interface ItineraryItem {
  day: number;
  activity: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  name: string;
  description: string;
  coordinates: Coordinates;
}

export interface TravelPackage {
  city: string;
  country: string;
  description: string;
  duration: string;
  cost: string;
  coordinates: Coordinates;
  places: Place[];
  itinerary: ItineraryItem[];
  bestTime: string;
  themes: string[];
}

export enum AppView {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  DETAILS = 'DETAILS',
  PLANNER = 'PLANNER',
}