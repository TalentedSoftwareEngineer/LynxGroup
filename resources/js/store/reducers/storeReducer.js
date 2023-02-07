import { SET_STORES, SET_THERAPIST_SHIFT_STORES } from "../types";

const initialState = {
  stores: [],
  therapistShiftStores: [{id: -1, store_name: '-'}],
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STORES:
      return {
        ...state,
        stores: action.payload
      };

    case SET_THERAPIST_SHIFT_STORES:
      state.therapistShiftStores = [{id: -1, store_name: '-'}];
      return {
        ...state,
        therapistShiftStores: [...state.therapistShiftStores ,...action.payload]
      }

    default:
      return state;
  }
};

export default storeReducer;
