import { CUSTOMER_REGIST, SET_CUSTOMERMGR_DATA } from "../types";

export const customerRegistAction = (customerInfo) => ({
  type: CUSTOMER_REGIST, 
  payload: customerInfo
});

export const setCustomerMgrDataAction = (Info) => ({
  type: SET_CUSTOMERMGR_DATA, 
  payload: Info
});
