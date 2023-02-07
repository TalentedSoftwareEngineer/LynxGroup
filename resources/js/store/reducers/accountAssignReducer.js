import { SET_ACCOUNT_ASSIGN } from "../types";

const initialState = {
  accountAssigns: [],
};

const accountAssignReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_ASSIGN:
      return {
        ...state,
        accountAssigns: action.payload
      };

    default:
      return state;
  }
};

export default accountAssignReducer;
