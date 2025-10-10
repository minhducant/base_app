export type VehicleType =
  | 'car'
  | 'bus'
  | 'walk'
  | 'train'
  | 'bike'
  | 'truck'
  | 'taxi'
  | 'airplane';

export type FuelType = 'gasoline' | 'electric';

// CO factor (g CO / lít) cho từng loại nhiên liệu
const fuelEmissionFactor: Record<FuelType, number> = {
  gasoline: 2.31, // trung bình xăng
  electric: 0.1,  // gần như bằng 0 (gián tiếp từ điện)
};

const vehicleData: Record<
  VehicleType,
  { fuelConsumption: number; baseCO: number }
> = {
  bike: {
    fuelConsumption: 2.26,
    baseCO: 12.09, // g CO/l (cá nhân, xe máy)
  },
  car: {
    fuelConsumption: 8.5,
    baseCO: 2.21,
  },
  bus: {
    fuelConsumption: 3.5,
    baseCO: 1.2,
  },
  truck: {
    fuelConsumption: 25.0,
    baseCO: 3.5,
  },
  taxi: {
    fuelConsumption: 10.0,
    baseCO: 2.8,
  },
  walk: {
    fuelConsumption: 0,
    baseCO: 0,
  },
  train: {
    fuelConsumption: 2.0,
    baseCO: 0.8,
  },
  airplane: {
    fuelConsumption: 35.0,
    baseCO: 3.2,
  },
};

export function calculateVehicleCO(
  vehicle: VehicleType,
  distanceKm: number,
  fuel: FuelType = 'gasoline',
): number {
  const data = vehicleData[vehicle];
  const { fuelConsumption, baseCO } = data;

  // Tính lượng nhiên liệu tiêu thụ (lít)
  const fuelUsed = (fuelConsumption / 100) * distanceKm;

  // Điều chỉnh CO tùy theo loại nhiên liệu
  const emissionFactor = fuelEmissionFactor[fuel];
  const coEmission = fuelUsed * baseCO * (emissionFactor / fuelEmissionFactor.gasoline);
  return coEmission; // g CO
}
