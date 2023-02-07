import { SET_ACCOUNT_MENU } from "../types";

const initialState = {
  accountMenus: [],
};

const accountMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_MENU:
      return {
        ...state,
        accountMenus: action.payload
      };

    default:
      return state;
  }
};

export default accountMenuReducer;
