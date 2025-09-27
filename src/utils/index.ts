import {
  setStorage,
  getStorage,
  multiRemove,
  getLanguage,
  getAccessToken,
} from './storage';
import { onLogout } from './logout';
import { useAsyncApp } from './asyncApp';
import { showMessage } from './toast';
import { calculateVehicleCO } from './emissionCalculator';

export {
  getAccessToken,
  getLanguage,
  useAsyncApp,
  showMessage,
  setStorage,
  getStorage,
  multiRemove,
  onLogout,
  calculateVehicleCO,
};
