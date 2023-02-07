import { SET_ACCOUNT_OPTION } from "../types";

const initialState = {
  accountOptions: [],
};

const accountOptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_OPTION:
      return {
        ...state,
        accountOptions: action.payload
      };

    default:
      return state;
  }
};

export default accountOptionReducer;
