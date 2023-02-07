import { SET_THERAPIST_SERVICE } from "../types";

const initialState = {
  therapistServices: [],
};

const therapistServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THERAPIST_SERVICE:
      return {
        ...state,
        therapistServices: action.payload
      };

    default:
      return state;
  }
};

export default therapistServiceReducer;
