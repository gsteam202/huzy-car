import { MolitDataProvider } from "./molit-provider";
import { EncarDataProvider } from "./encar-provider";
import { CarDataProvider } from "./car-provider-types";

export * from "./car-provider-types";
export * from "./molit-provider";
export * from "./encar-provider";
export * from "./ts-car-api-client";

export function getDataProviders(): CarDataProvider[] {
  return [new MolitDataProvider(), new EncarDataProvider()];
}

export function getDataProvider(code: string): CarDataProvider | undefined {
  return getDataProviders().find((p) => p.code === code);
}
