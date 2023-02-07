import moment from "moment";

export const getWeekDate = (i_date, i_day) => {
    let tmp_date = new Date(i_date);
    tmp_date.setDate(tmp_date.getDate() - tmp_date.getDay() + i_day);
    return new Date(tmp_date);
}

export const plusDate = (i_date, i_day) => {
    let tmp_date = new Date(i_date);
    tmp_date.setDate(tmp_date.getDate()+i_day);
    return new Date(tmp_date);
}

export const plusHour = (i_date, i_hour) => {
    let tmp_date = new Date(i_date);
    tmp_date.setHours(tmp_date.getHours()+i_hour);
    return new Date(tmp_date);
}

export const plusMinute = (i_date, i_minute) => {
    let tmp_date = new Date(i_date);
    tmp_date.setMinutes(tmp_date.getMinutes()+i_minute);
    return new Date(tmp_date);
}

export const setClickDate = (i_date, i_day) => {
    let tmp_date = new Date(i_date);
    tmp_date.setDate(i_day);
    return new Date(tmp_date);
}

export const setOnlyMonth = (i_date, i_month) => {
    let tmp_date = new Date(i_date);
    tmp_date.setMonth(i_month-1);
    return new Date(tmp_date);
}

export const setOnlyYear = (i_date, i_year) => {
    let tmp_date = new Date(i_date);
    tmp_date.setFullYear(i_year);
    return new Date(tmp_date);
}

export const setMonthWithNumber = (i_date, i_month) => {
    let tmp_date = new Date(i_date);
    tmp_date.setMonth(i_month);
    return new Date(tmp_date);
}

export const setToGivenTime = (i_date, given_hour, given_minute) => {
    let tmp_date = new Date(i_date);
    tmp_date.setHours(given_hour, given_minute, 0);
    return new Date(tmp_date);
}


export const getDatesInMonth = (i_date) => {
    let current_month = new Date(i_date).getMonth();
    let tmp_date = new Date(i_date);
    tmp_date.setDate(29);
    if(tmp_date.getMonth() != current_month)
    {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    } else {
        tmp_date.setDate(31);
        if(tmp_date.getMonth() != current_month) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        } else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        }
    }
}

export const getStartEnd = (i_date, i_fromTime, i_toTime) => {
    let tmp_date = new Date(i_date);
    if(moment('1970-01-01T' + i_fromTime).isAfter('1970-01-01T' + i_toTime, 'time') || moment('1970-01-01T' + i_fromTime).isSame('1970-01-01T' + i_toTime, 'time')) {
        return [
            moment(tmp_date).format('YYYY-MM-DD') + 'T' + i_fromTime,
            moment(plusDate(tmp_date, 1)).format('YYYY-MM-DD') + 'T' + i_toTime,
        ];
    } else {
        return [
            moment(tmp_date).format('YYYY-MM-DD') + 'T' + i_fromTime,
            moment(tmp_date).format('YYYY-MM-DD') + 'T' + i_toTime,
        ]
    }
}