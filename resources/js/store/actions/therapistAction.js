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

export const setTherapistAction = (info) => ({
  type: SET_THERAPIST,
  payload: info,
})

export const setTherapistManagementAction = (info) => ({
  type: SET_THERAPIST_MANAGEMENT,
  payload: info,
})

export const setTherapistShiftAction = (info) => ({
  type: SET_THERAPIST_SHIFT,
  payload: info,
})

export const setDisplayDateAction = (info) => ({
  type: SET_DISPLAY_DATE,
  payload: info,
})

export const setTherapistReservationsAction = (info) => ({
  type: SET_THERAPIST_RESERVATOIN,
  payload: info,
})

export const setConfirmedShiftsAction = (info) => ({
  type: SET_CONFIRMED_SHIFTS,
  payload: info,
})

export const setReserveTableShiftsAction = (info) => ({
  type: SET_RESERVETABLESHIFTS,
  payload: info,
})

export const setDailyReportDataAction = (info) => ({
  type: SET_DAILYREPORTDATA,
  payload: info,
})

export const setTherapistTallyDataAction = (info) => ({
  type: SET_THERAPISTTALLYDATA,
  payload: info,
})

export const setTallyInputDataAction = (info) => ({
  type: SET_TALLY_INPUT_DATA,
  payload: info,
})

export const setReservationFullDataAction = (info) => ({
  type: SET_RESERVATION_FULL_DATA,
  payload: info,
})