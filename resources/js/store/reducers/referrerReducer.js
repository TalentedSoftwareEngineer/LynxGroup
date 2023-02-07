import { SET_REFERRER } from "../types";

const initialState = {
  referrers: [],
};

const referrerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REFERRER:
      return {
        ...state,
        referrers: action.payload
      };

    default:
      return state;
  }
};

export default referrerReducer;
