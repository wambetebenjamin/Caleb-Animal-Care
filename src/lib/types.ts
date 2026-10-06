export type ServiceSlug =
  | "general-consultation"
  | "vaccination-programme"
  | "dental-care"
  | "surgery"
  | "grooming"
  | "livestock-health"
  | "mobile-vet-home-visits"
  | "wildlife-and-exotic-animals";

export interface Service {
  slug: ServiceSlug;
  name: string;
  short: string;
  description: string;
  whatToExpect: string[];
  preparation: string[];
  priceFrom: number;
  priceTo: number;
  image: string;
  category: string;
}

export interface Vet {
  slug: string;
  name: string;
  qualification: string;
  specialisation: string;
  years: number;
  languages: string[];
  image: string;
}

export interface Testimonial {
  owner: string;
  pet: string;
  service: string;
  review: string;
  rating: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  sizes: string[];
  price: number;
  category: "food" | "flea" | "supplement" | "accessory" | "dewormer";
  stock: number;
}

export interface Slot {
  time: string;
  taken: boolean;
}

export interface WeightEntry {
  date: string;
  kg: number;
}

export interface VaccineEntry {
  name: string;
  givenAt: string;
  nextDue: string;
}

export interface PetProfile {
  id: string;
  ownerEmail: string;
  name: string;
  species: string;
  breed: string;
  ageYears: number;
  photo?: string;
  weights: WeightEntry[];
  vaccines: VaccineEntry[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  createdAt: string;
  serviceSlug: string;
  vetSlug: string;
  date: string;
  time: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    age: string;
    weight: string;
    history: string;
  };
  owner: { name: string; phone: string; email: string; address: string };
  recordsUrl?: string;
  status: "confirmed";
}

export interface Reminder {
  id: string;
  ownerEmail: string;
  ownerPhone: string;
  petName: string;
  medication: string;
  dosage: string;
  remindAt: string;
  sent: boolean;
  createdAt: string;
}
