import { CUSTOMER_REGIST, SET_CUSTOMERMGR_DATA } from "../types";

const initialState = {
  customers: [],
  customerMgrData: [],
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_REGIST:
      return {
        ...state,
        customers: action.payload
      };

    case SET_CUSTOMERMGR_DATA:
      return {
        ...state,
        customerMgrData: action.payload
      };

    default:
      return state;
  }
};

export default customerReducer;
