import { SET_INPUTTERS, SET_GENRES, SET_SCHEDULES } from "../types";

export const setInputtersAction = (Info) => ({
  type: SET_INPUTTERS, 
  payload: Info
});

export const setGenresAction = (Info) => ({
  type: SET_GENRES, 
  payload: Info
});

export const setSchedulesAction = (Info) => ({
  type: SET_SCHEDULES, 
  payload: Info
});