export type VehicleType = 'bike' | 'car' | 'bus' | 'truck' | 'taxi';

const vehicleData: Record<
  VehicleType,
  { fuelConsumption: number; CO: number }
> = {
  bike: {
    fuelConsumption: 2.26, // l/100km
    CO: 12.09, // g CO / lít
  },
  car: {
    fuelConsumption: 11.3,
    CO: 2.21,
  },
  bus: {
    fuelConsumption: 30.0,
    CO: 2.9,
  },
  truck: {
    fuelConsumption: 25.0,
    CO: 3.5,
  },
  taxi: {
    fuelConsumption: 12.5,
    CO: 3.0,
  },
};

export function calculateVehicleCO(
  vehicle: VehicleType,
  distanceKm: number,
): number {
  const data = vehicleData[vehicle];
  const fuelUsed = (data.fuelConsumption / 100) * distanceKm; // lít tiêu thụ
  return fuelUsed * data.CO; // g CO
}
