import { SET_ACCOUNT_PAYMENT } from "../types";

const initialState = {
  accountPayments: [],
};

const accountPaymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_PAYMENT:
      return {
        ...state,
        accountPayments: action.payload
      };

    default:
      return state;
  }
};

export default accountPaymentReducer;
