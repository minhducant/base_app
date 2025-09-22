export type EmissionFactors = {
  [pollutant: string]: number;
};

type VehicleType = "motorbike" | "car" | "bus";

const vehicleData: Record<
  VehicleType,
  { fuelConsumption: number; factors: EmissionFactors }
> = {
  motorbike: {
    fuelConsumption: 2.26,
    factors: { CO: 12.09, HC: 1.02, NOx: 0.11 },
  },
  car: {
    fuelConsumption: 11.3,
    factors: { CO: 2.21, HC: 0.26, NOx: 1.05, PM: 0.3 },
  },
  bus: {
    fuelConsumption: 0,
    factors: { CO: 2.9, HC: 0.8, NOx: 32.7 },
  },
};

export function calculateEmission(
  fuelConsumption: number,
  emissionFactors: EmissionFactors
): { [pollutant: string]: number } {
  const result: { [pollutant: string]: number } = {};

  Object.keys(emissionFactors).forEach((pollutant) => {
    result[pollutant] = fuelConsumption * emissionFactors[pollutant];
  });

  return result;
}

export function calculateVehicleEmission(vehicle: VehicleType) {
  const data = vehicleData[vehicle];
  return calculateEmission(data.fuelConsumption, data.factors);
}
