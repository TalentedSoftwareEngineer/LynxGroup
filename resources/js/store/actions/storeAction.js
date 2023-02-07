import { SET_STORES, SET_THERAPIST_SHIFT_STORES } from "../types";

export const setStoresAction = (storeInfo) => ({
  type: SET_STORES, 
  payload: storeInfo
});

export const setTherapistShiftStoresAction = (storeInfo) => ({
  type: SET_THERAPIST_SHIFT_STORES, 
  payload: storeInfo
});