/**
 * CAR HUZY External Car Data Provider Interface & Types
 */

export interface NormalizedCarModel {
  brandNameKo: string;
  brandNameEn: string;
  brandCountry: "KOREA" | "IMPORTED";
  modelNameKo: string;
  modelNameEn: string;
  modelSlug: string;
  vehicleType: "SEDAN" | "SUV" | "RV" | "COMPACT" | "HATCHBACK" | "WAGON" | "COUPE" | "CONVERTIBLE" | "TRUCK" | "VAN";
  releaseYear: number;
  minPrice: number;
  maxPrice: number;
  imageUrl?: string;
  trims: NormalizedCarTrim[];
}

export interface NormalizedCarTrim {
  nameKo: string;
  price: number;
  fuelType: "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC" | "LPG" | "HYDROGEN";
  engineDisplacement?: number;
  transmission?: string;
  fuelEfficiencyCombined?: number;
  electricEfficiencyCombined?: number;
  maxPower?: number;
  maxTorque?: number;
  seatingCapacity: number;
}

export interface NormalizedUsedCarListing {
  externalId: string;
  brandNameKo: string;
  modelNameKo: string;
  title: string;
  year: number;
  mileageKm: number;
  price: number;
  fuelType: "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC" | "LPG" | "HYDROGEN";
  region: string;
  accidentHistory: "NONE" | "SIMPLE_REPAIR" | "MAJOR_ACCIDENT";
  isCertified: boolean;
  sourceUrl?: string;
  imageUrl?: string;
}

export interface SyncReport {
  provider: string;
  success: boolean;
  totalFetched: number;
  totalUpserted: number;
  totalErrors: number;
  durationMs: number;
  message: string;
  timestamp: string;
}

export interface CarDataProvider {
  readonly code: string;
  readonly name: string;
  readonly isMock: boolean;
  isAvailable(): boolean;
  fetchNewCars(brandOrQuery?: string): Promise<NormalizedCarModel[]>;
  fetchUsedCarListings(modelQuery?: string): Promise<NormalizedUsedCarListing[]>;
  synchronize(): Promise<SyncReport>;
}
