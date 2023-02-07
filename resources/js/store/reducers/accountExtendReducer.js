import { SET_ACCOUNT_EXTEND } from "../types";

const initialState = {
  accountExtends: [],
};

const accountExtendReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_EXTEND:
      return {
        ...state,
        accountExtends: action.payload
      };

    default:
      return state;
  }
};

export default accountExtendReducer;
