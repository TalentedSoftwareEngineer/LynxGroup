import { SET_INPUTTERS, SET_GENRES, SET_SCHEDULES } from "../types";

const initialState = {
    inputters: [],
    genres: [],
    schedules: [],
};

const scheduleReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INPUTTERS:
      return {
        ...state,
        inputters: action.payload
      };

    case SET_GENRES:
      return {
        ...state,
        genres: action.payload
      };

    case SET_SCHEDULES:
      return {
        ...state,
        schedules: action.payload
      };

    default:
      return state;
  }
};

export default scheduleReducer;
