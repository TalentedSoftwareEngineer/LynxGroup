import { SET_ACCOUNT_COURSE } from "../types";

const initialState = {
  accountCourses: [],
};

const accountCourseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_COURSE:
      return {
        ...state,
        accountCourses: action.payload
      };

    default:
      return state;
  }
};

export default accountCourseReducer;
