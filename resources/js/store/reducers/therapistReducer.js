import {
  SET_THERAPIST,
  SET_THERAPIST_MANAGEMENT,
  SET_THERAPIST_SHIFT,
  SET_DISPLAY_DATE,
  SET_THERAPIST_RESERVATOIN,
  SET_CONFIRMED_SHIFTS,
  SET_RESERVETABLESHIFTS,
  SET_DAILYREPORTDATA,
  SET_THERAPISTTALLYDATA,
  SET_TALLY_INPUT_DATA,
  SET_RESERVATION_FULL_DATA
} from '../types'

const initialState = {
  therapists: [],
  therapist_mgr: [],
  therapist_shift: [],
  displayDate: new Date(),
  therapist_reservations: [],
  confirmedShifts: [],
  reserveTableShifts: [],
  dailyReportDatas: [],
  therapistTallyDatas: [],
  tallyInputDatas: [],
  reservationFullDatas: [],
}

const therapistReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THERAPIST:
      return {
        ...state,
        therapists: action.payload,
      }

    case SET_THERAPIST_MANAGEMENT:
      return {
        ...state,
        therapist_mgr: action.payload,
      }

    case SET_THERAPIST_SHIFT:
      return {
        ...state,
        therapist_shift: action.payload,
      }

    case SET_DISPLAY_DATE:
      return {
        ...state,
        displayDate: action.payload,
      }

    case SET_THERAPIST_RESERVATOIN:
      return {
        ...state,
        therapist_reservations: action.payload,
      }

    case SET_CONFIRMED_SHIFTS:
      return {
        ...state,
        confirmedShifts: action.payload,
      }

    case SET_RESERVETABLESHIFTS:
      return {
        ...state,
        reserveTableShifts: action.payload,
      }

    case SET_DAILYREPORTDATA:
      return {
        ...state,
        dailyReportDatas: action.payload,
      }
    case SET_THERAPISTTALLYDATA:
      return {
        ...state,
        therapistTallyDatas: action.payload,
      }
    case SET_TALLY_INPUT_DATA:
      return {
        ...state,
        tallyInputDatas: action.payload,
      }
    case SET_RESERVATION_FULL_DATA:
      return {
        ...state,
        reservationFullDatas: action.payload,
      }

    default:
      return state
  }
}

export default therapistReducer
