import { SET_ACCOUNT_PAYMENT } from "../types";

export const accountPaymentAction = (Info) => ({
  type: SET_ACCOUNT_PAYMENT, 
  payload: Info
});
