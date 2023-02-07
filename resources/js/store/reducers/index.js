import { combineReducers } from "redux";
import customerReducer from "./customerReducer";
import storeReducer from './storeReducer';
import therapistReducer from './therapistReducer';
import accountMenuReducer from './accountMenuReducer';
import accountCourseReducer from "./accountCourseReducer";
import accountAssignReducer from './accountAssignReducer';
import accountOptionReducer from "./accountOptionReducer";
import accountPaymentReducer from "./accountPaymentReducer";
import accountExtendReducer from "./accountExtendReducer";
import referrerReducer from "./referrerReducer";
import userReducer from "./userReducer";
import therapistServiceReducer from './therapistServiceReducer';
import scheduleReducer from './scheduleReducer';

export default combineReducers({
  customerStore: customerReducer,
  storeStore: storeReducer,
  therapistStore: therapistReducer,
  accountMenuStore: accountMenuReducer,
  accountCourseStore: accountCourseReducer,
  accountAssignStore: accountAssignReducer,
  accountOptionStore: accountOptionReducer,
  accountPaymentStore: accountPaymentReducer,
  accountExtendStore: accountExtendReducer,
  referrerStore: referrerReducer,
  userStore: userReducer,
  therapistServiceStore: therapistServiceReducer,
  scheduleStore: scheduleReducer
});
