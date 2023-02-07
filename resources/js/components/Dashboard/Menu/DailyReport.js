import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Grid,
    Typography,
    Container,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableSortLabel,
    TableBody,
    TablePagination,
    Paper,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    TextareaAutosize,
    MenuItem,
    Stack,
    Divider,
    Modal,
    Fade,
    Backdrop,
    AppBar,
    Toolbar,
    Icon,
    Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import MainLayout from "../../MainLayout/MainLayout";
import {
    setClickDate,
    plusDate,
    setToGivenTime,
} from "../../../service/common";
import {
    setTherapistShiftAction,
    setTherapistReservationsAction,
    setDailyReportDataAction,
    setTherapistTallyDataAction,
    setConfirmedShiftsAction,
    setTallyInputDataAction,
    setReservationFullDataAction,
    setTherapistAction
} from "../../../store/actions/therapistAction";
import { setStoresAction } from '../../../store/actions/storeAction';
import { setReferrerAction } from '../../../store/actions/referrerAction';
import "./menu.css";
import axios from "axios";
import { Fragment } from "react";
import { parse } from "postcss";

var jquery_displayDate = new Date();
var jquery_therapist_reservations = [];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

function createDailyReportData(
    reservation_id,
    store,
    time,
    therapist,
    new_repeater,
    customer_name,
    option,
    menu,
    nomination,
    card_fee,
    extend,
    account_from,
    account_to,
    sb,
    profits,
    isOptionCard,
    isMenuCard,
    isExtendCard,
) {
    return {
        reservation_id,
        store,
        time,
        therapist,
        new_repeater,
        customer_name,
        option,
        menu,
        nomination,
        card_fee,
        extend,
        account_from,
        account_to,
        sb,
        profits,
        isOptionCard,
        isMenuCard,
        isExtendCard,
    };
}

function createTherapistTallyData(
    tally_therapist,
    tally_store,
    tally_shiftTime,
    tally_mainNomination,
    tally_nomination,
    tally_free,
    tally_dm,
    tally_sum,
    tally_toFee,
    tally_sales,
    tally_check,
    tally_remarks,
    tally_unpaid,
) {
    return {
        tally_therapist,
        tally_store,
        tally_shiftTime,
        tally_mainNomination,
        tally_nomination,
        tally_free,
        tally_dm,
        tally_sum,
        tally_toFee,
        tally_sales,
        tally_check,
        tally_remarks,
        tally_unpaid,
    }
}

function DailyReport() {
    const dispatch = useDispatch();
    const { 
        therapist_shift, 
        therapist_reservations, 
        dailyReportDatas, 
        therapistTallyDatas, 
        confirmedShifts, 
        tallyInputDatas,
        reservationFullDatas,
        therapists
     } = useSelector(({ therapistStore }) => therapistStore);
     const { stores } = useSelector(({storeStore})=>storeStore);
     const { referrers } = useSelector(({referrerStore})=>referrerStore);

    let initDate = new Date().setMinutes(0);
    const [val_startSimpleConfirmTime, setValStartSimpleConfirmTime] =
        useState(initDate);
    const [val_endSimpleConfirmTime, setValEndSimpleConfirmTime] =
        useState(initDate);
    const [val_startReferrerConfirmTime, setValStartReferrerConfirmTime] =
        useState(initDate);
    const [val_endReferrerConfirmTime, setValEndReferrerConfirmTime] =
        useState(initDate);
    const [val_startTherapistConfirmTime, setValStartTherapistConfirmTime] =
        useState(initDate);
    const [val_endTherapistConfirmTime, setValEndTherapistConfirmTime] =
        useState(initDate);

    const [displayDate, setDisplayDate] = useState(new Date());
    const [dates, setDates] = useState([]);

    useEffect(() => {
        getTherapists();
        getReservations();
        getConfirmedShifts();
        getTallyInputData();
        getStores();
        getReservationFullData();
        getTherapistsInfo();
        getReferrers();

        setDatesFunc(new Date());
    }, []);

    useEffect(()=>{
        getDailyReportData();
        getTherapistTallyData();
    }, [displayDate]);

    const getTherapists = () => {
        axios.get("/api/getshifttherapists").then((res) => {
            dispatch(setTherapistShiftAction(res.data));
        });
    };

    const getReservations = () => {
        axios.get("/api/getReservations").then((res) => {
            dispatch(setTherapistReservationsAction(res.data));
            jquery_therapist_reservations = res.data;
        });
    };

    const getDailyReportData = () => {
        axios.post("/api/getDailyReportData", {
            dayStartDateTime: moment(displayDate).format('YYYY-MM-DD') + 'T10:00',
            dayEndDateTime: moment(plusDate(displayDate, 1)).format('YYYY-MM-DD') + 'T06:00',
        }).then((res) => {
            dispatch(setDailyReportDataAction(res.data));
        });
    };

    const getTherapistTallyData = () => {
        axios.post("/api/getTherapistTallyData", {
            dayStartDateTime: moment(displayDate).format('YYYY-MM-DD') + 'T10:00',
            dayEndDateTime: moment(plusDate(displayDate, 1)).format('YYYY-MM-DD') + 'T06:00',
        }).then((res) => {
            dispatch(setTherapistTallyDataAction(res.data));
        });
    };

    const getConfirmedShifts = () => {
        axios
        .get('/api/getConfirmedShifts')
        .then((res)=>{
            dispatch(setConfirmedShiftsAction(res.data));
        });
    }

    const getTallyInputData = () => {
        axios
        .get('/api/getTherapistTallyInput')
        .then((res)=>{
            dispatch(setTallyInputDataAction(res.data));
        });
    }

    const getStores = () => {
        axios
        .get('/api/getstores')
        .then((res)=>{
            dispatch(setStoresAction(res.data));
        });
    }

    const getReservationFullData = () => {
        axios
        .get('/api/getReservationFullData')
        .then((res)=>{
            dispatch(setReservationFullDataAction(res.data));
        });
    }

    const getTherapistsInfo = () => {
        axios
        .get('/api/gettherapists')
        .then((res)=>{
            dispatch(setTherapistAction(res.data));
        });
    }

    const getReferrers = () => {
        axios
        .get('/api/getReferrers')
        .then((res)=>{
            dispatch(setReferrerAction(res.data));
        });
    }

    const getReferrerFee = (referrerFee_title, therapistFee, therapist_ShiftCount) => {
        switch(referrerFee_title) {
            case '1件につき2000円':
                return 2000;
                break;
            case '1件につき2500円':
                return 2500;
                break;
            case '1件につき3000円':
                return 3000;
                break;
            case '「セラピスト報酬」の15％+出勤日数×1000円':
                return Number(therapistFee) * 0.15 + therapist_ShiftCount*1000;
                break;
            case '「セラピスト報酬」の15％':
                return Number(therapistFee) * 0.15;
                break;
            case '':
                return 0;
                break;
        }
    }
    
    const getTallyShiftTime = (therapist_reservations) => {
        let shiftTimes = [];
        therapist_reservations.forEach((therapist_reservations_item)=>{
            let shift = confirmedShifts.find((confirmedShifts_item)=>(
                therapist_reservations_item.therapist_name==confirmedShifts_item.therapist_name 
                && therapist_reservations_item.reservation_from>=confirmedShifts_item.shift_fromTime 
                && therapist_reservations_item.reservation_to<=confirmedShifts_item.shift_toTime
            ));

            if(shift != undefined) {
                if(shiftTimes.find((shiftTime_item)=>(
                    shiftTime_item[0]==moment(new Date(shift.shift_fromTime)).format('HH:mm') 
                    && shiftTime_item[1] == moment(new Date(shift.shift_toTime)).format('HH:mm')
                )) == undefined) {
                    shiftTimes.push([moment(new Date(shift.shift_fromTime)).format('HH:mm'), moment(new Date(shift.shift_toTime)).format('HH:mm')]);
                }
            }
        });
        return shiftTimes;
    }

    const getTherapistDailySalary = (reserves) => {
        let dailySalary = 0;

        reserves.forEach((reserves_item)=>{
            dailySalary += Number(reserves_item.menu_toFee) + Number(reserves_item.extend_toFee) + Number(reserves_item.option_toFee);
        });
        
        return dailySalary;
    }

    const getTallySales = (reserves) => {
        let payAmount = 0;

        reserves.forEach((reserves_item)=>{
            payAmount += Number(reserves_item.fee);
        });

        return payAmount - getTherapistDailySalary(reserves);
    }

    const getSaleByStore = (store_name) => {
        let store_sales = 0;
        reservationFullDatas.forEach((item) => {
            if(
                item.reserve_store == store_name 
                && item.reservation_from >= moment(new Date(val_startSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                store_sales += Number(item.fee);
            }
        });

        return store_sales;
    }

    const getProfitByStore = (store_name) => {
        let store_profit = 0;
        let card_paymentCount = 0;

        if(reservationFullDatas.length>0) {
            reservationFullDatas.forEach(item=>{
                if(
                    item.reserve_store == store_name 
                    && item.menu_payment_name.includes('50円あり')
                    && item.reservation_from >= moment(new Date(val_startSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                    && item.reservation_to <= moment(new Date(val_endSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                ) {
                    card_paymentCount ++;
                }
    
                if(
                    item.reserve_store == store_name 
                    && item.extend_payment_name.includes('50円あり')
                    && item.reservation_from >= moment(new Date(val_startSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                    && item.reservation_to <= moment(new Date(val_endSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                ) {
                    card_paymentCount ++;
                }
    
                if(
                    item.reserve_store == store_name 
                    && item.option_payment_name?.includes('50円あり')
                    && item.reservation_from >= moment(new Date(val_startSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                    && item.reservation_to <= moment(new Date(val_endSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                ) {
                    card_paymentCount ++;
                }
            });

            reservationFullDatas.forEach((item) => {
                if(
                    item.reserve_store == store_name 
                    && item.reservation_from >= moment(new Date(val_startSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                    && item.reservation_to <= moment(new Date(val_endSimpleConfirmTime)).format("YYYY-MM-DDTHH:mm")
                ) {
                    // 利益＝売上-（セラピスト報酬 + SB + カード会社に支払う手数料【6.5％】+（50円×カード決済の本数））
                    store_profit += parseInt(
                        Number(item.fee) /* 売上 */
                        - ( 
                            (Number(item.menu_toFee) + Number(item.extend_toFee) + Number(item.option_toFee)) /* セラピスト報酬 */
                            + getReferrerFee(item.referrer_fee, (Number(item.menu_toFee) + Number(item.extend_toFee) + Number(item.option_toFee)), 0) /* SB */
                            + (Number(item.fee) * 0.065) /* カード会社に支払う手数料【6.5％】 */
                            + (50 * card_paymentCount) /* （50円×カード決済の本数） */
                         )
                    );
                }
            });
        }

        return store_profit;
    }

    const getTotalSaleByStore = () => {
        let totalSale = 0;

        stores.forEach((item)=>{
            totalSale += getSaleByStore(item.store_name);
        });

        return totalSale;
    }

    const getTotalProfitByStore = () => {
        let totalProfit = 0;

        stores.forEach((item)=>{
            totalProfit += getProfitByStore(item.store_name);
        });

        return totalProfit;
    }

    const getShiftCount = (therapist_name) => {
        let shift_count = 0;
        
        confirmedShifts.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.shift_fromTime >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.shift_toTime <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                shift_count++;
            }
        });

        return shift_count;
    }

    const getCustomerCount = (therapist_name) => {
        let customer_count = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.reservation_from >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                customer_count++;
            }
        });

        return customer_count;
    }

    const getFreeCount = (therapist_name) => {
        let free_count = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.nomination_name == 'フリー'
                && item.reservation_from >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                free_count++;
            }
        });

        return free_count;
    }

    const getNominationCount = (therapist_name) => {
        let count = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.nomination_name == '写真指名'
                && item.reservation_from >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                count++;
            }
        });

        return count;
    }

    const getMainNominationCount = (therapist_name) => {
        let count = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.nomination_name == '本指名'
                && item.reservation_from >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                count++;
            }
        });

        return count;
    }

    const getDMCount = (therapist_name) => {
        let count = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.therapist_name ==  therapist_name
                && item.nomination_name == 'DM指名'
                && item.reservation_from >= moment(new Date(val_startTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endTherapistConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                count++;
            }
        });

        return count;
    }

    const getReferrerReward = (referrer_name) => {
        let referrer_reward = 0;

        reservationFullDatas.forEach((item)=>{
            if(
                item.referrer_name ==  referrer_name
                && item.reservation_from >= moment(new Date(val_startReferrerConfirmTime)).format("YYYY-MM-DDTHH:mm")
                && item.reservation_to <= moment(new Date(val_endReferrerConfirmTime)).format("YYYY-MM-DDTHH:mm")
            ) {
                referrer_reward += getReferrerFee(item.referrer_fee, (Number(item.menu_toFee) + Number(item.extend_toFee) + Number(item.option_toFee)), 0);
            }
        });

        return referrer_reward;
    }

    const rows = useMemo(()=>(
        new Date().getDate() - new Date(displayDate).getDate() == 1 
        && moment(new Date()).isBefore(setToGivenTime(new Date(), 6, 0)) ?
        [] : 
        dailyReportDatas.filter(item=>(
            moment(new Date(item.reservation_from)).isBefore(setToGivenTime(new Date(), 6, 0))
        )).map((reservation_item, index)=>{
            return createDailyReportData(
                reservation_item.id,
                stores.find(store_item => reservation_item.reserve_store==store_item.store_name)==undefined
                ? ''
                : stores.find(store_item => reservation_item.reserve_store==store_item.store_name).store_area,
                moment(new Date(reservation_item.reservation_from)).format('HH:mm'),
                reservation_item.therapist_name,
                reservation_item.new_repeater,
                reservation_item.customer_name,
                reservation_item.option_name,
                reservation_item.menu_name,
                reservation_item.nomination_name,
                reservation_item.card_fee,
                reservation_item.extend_name,
                reservation_item.fee,
                Number(reservation_item.menu_toFee) + Number(reservation_item.extend_toFee) + Number(reservation_item.option_toFee),
                getReferrerFee(reservation_item.referrer_fee, Number(reservation_item.menu_toFee) + Number(reservation_item.extend_toFee) + Number(reservation_item.option_toFee), 0),
                reservation_item.fee - (Number(reservation_item.menu_toFee) + Number(reservation_item.extend_toFee) + Number(reservation_item.option_toFee)) - getReferrerFee(reservation_item.referrer_fee, Number(reservation_item.menu_toFee) + Number(reservation_item.extend_toFee) + Number(reservation_item.option_toFee), 0),
                reservation_item.option_payment_name == null ? 'なし' : reservation_item.option_payment_name.includes('カード') ? 'あり':'なし',
                reservation_item.menu_payment_name == null ? 'なし' : reservation_item.menu_payment_name.includes('カード') ? 'あり':'なし',
                reservation_item.extend_payment_name == null ? 'なし' : reservation_item.extend_payment_name.includes('カード') ? 'あり':'なし',
            );
        })
    ), [displayDate, dailyReportDatas]);

    const therapistTally_rows = useMemo(()=>{
        if(dailyReportDatas.length==0 || confirmedShifts.length==0 || rows.length==0) {
            return [];
        } else {
            return therapistTallyDatas.map((tally_item, index)=>{
                return createTherapistTallyData(
                    tally_item.therapist_name,
                    dailyReportDatas.find((dailyReport_item)=>(dailyReport_item.therapist_name==tally_item.therapist_name)) == undefined ? '' : dailyReportDatas.find((dailyReport_item)=>(dailyReport_item.therapist_name==tally_item.therapist_name)).reserve_store,
                    getTallyShiftTime(dailyReportDatas.filter((dailyReport_item)=>(dailyReport_item.therapist_name==tally_item.therapist_name))),
                    dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name && dailyReport_item.nomination_name=='本指名').length,
                    dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name && dailyReport_item.nomination_name=='写真指名').length,
                    dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name && dailyReport_item.nomination_name=='フリー').length,
                    dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name && dailyReport_item.nomination_name=='DM指名').length,
                    dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name).length,
                    getTherapistDailySalary(dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name)),
                    getTallySales(dailyReportDatas.filter(dailyReport_item=>dailyReport_item.therapist_name==tally_item.therapist_name)) - 
                    (tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )) == undefined ? 0 : Number(tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )).tally_unpaid)),
                    tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )) == undefined ? false : tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )).tally_check,
                    tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )) == undefined ? '' : tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )).tally_remarks,
                    tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )) == undefined ? 0 : tallyInputDatas.find(item=>(
                        item.tally_therapist==tally_item.therapist_name 
                        && item.tally_date == moment(new Date(displayDate)).format('YYYY-MM-DD')
                    )).tally_unpaid,
                );
            })
        }
    }, [dailyReportDatas, confirmedShifts, rows]);

    const setDatesFunc = (i_date) => {
        let current_month = new Date(i_date).getMonth();
        let tmp_date = new Date(i_date);
        tmp_date.setDate(29);
        if (tmp_date.getMonth() != current_month) {
            setDates([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
            ]);
        } else {
            tmp_date.setDate(31);
            if (tmp_date.getMonth() != current_month) {
                setDates([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                ]);
            } else {
                setDates([
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                ]);
            }
        }
    };

    const getColorDate = (item_number) => {
        let item_date = setClickDate(displayDate, item_number);
        switch(item_date.getDay()) {
            case 0:
                return '#F8E0E0';
            case 6:
                return '#CEECF5';
            default:
                return 'transparent';
        }
    }

    const onChangeUnpaid = (event) => {
        axios.post("/api/handleTallyUnpaid", {
            tally_therapist: event.target.id.split('_')[1],
            tally_date: event.target.id.split('_')[2],
            tally_unpaid: event.target.value,
        }).then((res) => {
            getTallyInputData();
        });
    }

    const onChangeCheck = (event) => {
        axios.post("/api/handleTallyCheck", {
            tally_therapist: event.target.id.split('_')[1],
            tally_date: event.target.id.split('_')[2],
            tally_check: event.target.checked,
        }).then((res) => {

        });
    }

    const onChangeRemarks = (event) => {
        axios.post("/api/handleTallyRemarks", {
            tally_therapist: event.target.id.split('_')[1],
            tally_date: event.target.id.split('_')[2],
            tally_remarks: event.target.value,
        }).then((res) => {

        });
    }

    return (
        <MainLayout title={"LynxGroup"}>
            <Container maxWidth={'xl'}>
                <Stack direction={'row'} spacing={3} sx={{mt: 5}} justifyContent={'center'}>
                    <Typography
                        sx={{
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: {xs: '10px', md:"20px"},
                            letterSpacing: {xs: '0px', md:"3px"},
                            color: "#fff",
                            textShadow: "4px 5px 6px #000",
                            textDecoration: "none",
                        }}
                    >
                        店舗別売上と利益
                    </Typography>

                    <Stack
                        direction={"row"}
                        spacing={2}
                        justifyContent={"space-around"}
                    >
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="開始時間"
                            value={val_startSimpleConfirmTime}
                            onChange={(newValue) => {
                                setValStartSimpleConfirmTime(newValue);
                            }}
                        />
                        <Typography sx={{ letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}, mt: 0 }}>
                            ~
                        </Typography>
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="終了時間"
                            value={val_endSimpleConfirmTime}
                            onChange={(newValue) => {
                                setValEndSimpleConfirmTime(newValue);
                            }}
                        />
                    </Stack>
                </Stack>
                {moment(new Date(val_startSimpleConfirmTime)).isBefore(new Date(val_endSimpleConfirmTime)) &&
                    <Paper sx={{ width: '100%', mt: 2 }}>
                        <TableContainer>
                            <Table className="simpleConfirmTable">
                                <TableHead>
                                    <TableRow>
                                        {stores.map((store, index) => (
                                            <TableCell key={index} align="center" colSpan={2}>
                                                <Typography>{store.store_name}</Typography>
                                            </TableCell>
                                        ))}
                                        <TableCell align="center" colSpan={2}>
                                            <Typography>合計</Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        {stores.map((store, index) => (
                                            <Fragment key={index}>
                                                <TableCell align="center">
                                                    <Typography>売上</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography>利益</Typography>
                                                </TableCell>
                                            </Fragment>
                                        ))}
                                        <TableCell align="center">
                                            <Typography>売上</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography>利益</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    <TableRow>
                                        {stores.map((store, index) => (
                                            <Fragment key={index}>
                                                <TableCell  align="center">
                                                    <Typography>{getSaleByStore(store.store_name)}円</Typography>
                                                </TableCell>
                                                <TableCell  align="center">
                                                    <Typography>{getProfitByStore(store.store_name)}円</Typography>
                                                </TableCell>
                                            </Fragment>
                                        ))}
                                        
                                        <TableCell  align="center">
                                            <Typography>{getTotalSaleByStore()}円</Typography>
                                        </TableCell>
                                        <TableCell  align="center">
                                            <Typography>{getTotalProfitByStore()}円</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                }
            </Container>

            <Container maxWidth={'xl'}>
                <Stack direction={'row'} spacing={3} sx={{mt: 5}} justifyContent={'center'}>
                    <Typography
                        sx={{
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: {xs: '10px', md: "20px"},
                            letterSpacing: {xs: '0px', md: "3px"},
                            color: "#fff",
                            textShadow: "4px 5px 6px #000",
                            textDecoration: "none",
                        }}
                    >
                        セラピスト別詳細
                    </Typography>

                    <Stack
                        direction={"row"}
                        spacing={2}
                        justifyContent={"space-around"}
                    >
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="開始時間"
                            value={val_startTherapistConfirmTime}
                            onChange={(newValue) => {
                                setValStartTherapistConfirmTime(newValue);
                            }}
                        />
                        <Typography sx={{ letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}, mt: 0 }}>
                            ~
                        </Typography>
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="終了時間"
                            value={val_endTherapistConfirmTime}
                            onChange={(newValue) => {
                                setValEndTherapistConfirmTime(newValue);
                            }}
                        />
                    </Stack>
                </Stack>

                {moment(new Date(val_startTherapistConfirmTime)).isBefore(new Date(val_endTherapistConfirmTime)) && 
                    <TableContainer component={Paper} sx={{mt: 2}}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">セラピスト</StyledTableCell>
                                    <StyledTableCell align="center">出勤数</StyledTableCell>
                                    <StyledTableCell align="center">総接客数</StyledTableCell>
                                    <StyledTableCell align="center">フリー</StyledTableCell>
                                    <StyledTableCell align="center">写真指名</StyledTableCell>
                                    <StyledTableCell align="center">本指名</StyledTableCell>
                                    <StyledTableCell align="center">DM</StyledTableCell>
                                    <StyledTableCell align="center">本指名率</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {therapists.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="center">{row.therapist_name}</StyledTableCell>
                                        <StyledTableCell align="center">{getShiftCount(row.therapist_name)}日</StyledTableCell>
                                        <StyledTableCell align="center">{getCustomerCount(row.therapist_name)}人</StyledTableCell>
                                        <StyledTableCell align="center">{getFreeCount(row.therapist_name)}</StyledTableCell>
                                        <StyledTableCell align="center">{getNominationCount(row.therapist_name)}</StyledTableCell>
                                        <StyledTableCell align="center">{getMainNominationCount(row.therapist_name)}</StyledTableCell>
                                        <StyledTableCell align="center">{getDMCount(row.therapist_name)}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            {
                                                getCustomerCount(row.therapist_name)==0 ? 
                                                '0.00' : 
                                                (getMainNominationCount(row.therapist_name)/getCustomerCount(row.therapist_name)*100).toFixed(2)
                                            }%
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Container>

            <Container maxWidth={'xl'}>
                <Stack direction={'row'} spacing={3} sx={{mt: 5}} justifyContent={'center'}>
                    <Typography
                        sx={{
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            fontSize: {xs: '10px', md: "20px"},
                            letterSpacing: {xs: '0px', md: "3px"},
                            color: "#fff",
                            textShadow: "4px 5px 6px #000",
                            textDecoration: "none",
                        }}
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;紹介者報酬
                    </Typography>

                    <Stack
                        direction={"row"}
                        spacing={2}
                        justifyContent={"space-around"}
                    >
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="開始時間"
                            value={val_startReferrerConfirmTime}
                            onChange={(newValue) => {
                                setValStartReferrerConfirmTime(newValue);
                            }}
                        />
                        <Typography sx={{ letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}, mt: 0 }}>
                            ~
                        </Typography>
                        <DatePicker
                            className="confirm-DatePicker"
                            inputFormat="YYYY年MM月DD日"
                            renderInput={(params) => (
                                <TextField variant="standard" sx={{letterSpacing: {xs: '0px', md: "2px"}, fontSize: {xs: '10px', md: "18px"}}} {...params} />
                            )}
                            label="終了時間"
                            value={val_endReferrerConfirmTime}
                            onChange={(newValue) => {
                                setValEndReferrerConfirmTime(newValue);
                            }}
                        />
                    </Stack>
                </Stack>

                {moment(new Date(val_startReferrerConfirmTime)).isBefore(new Date(val_endReferrerConfirmTime)) &&
                    <TableContainer component={Paper} sx={{mt: 2}}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">紹介者名</StyledTableCell>
                                    <StyledTableCell align="center">紹介者報酬</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {referrers.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell align="center">{row.referrer_name}</StyledTableCell>
                                        <StyledTableCell align="center">{getReferrerReward(row.referrer_name)}円</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Container>

            <Container maxWidth={"lg"}>
                <Stack justifyContent={'center'}>
                    <Typography
                        sx={{
                            top: "104px",
                            fontFamily: "Roboto",
                            fontStyle: "normal",
                            fontWeight: "normal",
                            lineHeight: "24px",
                            fontSize: {xs: '10px', md: "18px"},
                            letterSpacing: {xs: '0px', md: "3px"},
                            color: "#ff0606",
                            textShadow: "4px 5px 6px #000",
                            textAlign: 'center',
                            textDecoration: "none",
                            width: "100%",
                            paddingBottom: "15px",
                            mt: 10,
                        }}
                    >
                        ※当日のデータは、翌AM6時間に更新されます。
                    </Typography>
                </Stack>

                <Typography
                    sx={{
                        top: "104px",
                        fontFamily: "Roboto",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        lineHeight: "24px",
                        fontSize: "28px",
                        letterSpacing: "3px",
                        color: "#fff",
                        textShadow: "4px 5px 6px #000",
                        margin: "16px 0px",
                        textDecoration: "none",
                        width: "100%",
                        paddingBottom: "15px",
                        borderBottom: "2px solid white",
                        mt: 10,
                    }}
                >
                    日報
                </Typography>
            </Container>

            <Container maxWidth={"xl"}>
                <Box sx={{ marginTop: "40px", pr: 2, pl: 2 }}>
                    <Grid container spacing={3} justifyContent={"center"}>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={(e) => {
                                    setDisplayDate((prev) => {
                                        setDatesFunc(plusDate(prev, -1));
                                        jquery_displayDate = plusDate(prev, -1);
                                        return plusDate(prev, -1);
                                    });
                                }}
                            >
                                前日
                            </Button>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                            <DatePicker
                                inputFormat="YYYY年MM月DD日"
                                value={displayDate}
                                onChange={(newValue) => {
                                    setDisplayDate(newValue);
                                    jquery_displayDate = new Date(newValue);
                                    setDatesFunc(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        style={{
                                            textAlign: "center",
                                            fontSize: "24px",
                                        }}
                                        variant="standard"
                                        {...params}
                                    />
                                )}
                                style={{
                                    textAlign: "center",
                                    fontSize: "24px",
                                }}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={(e) => {
                                    setDisplayDate((prev) => {
                                        setDatesFunc(plusDate(prev, 1));
                                        jquery_displayDate = plusDate(prev, 1);
                                        return plusDate(prev, 1);
                                    });
                                }}
                            >
                                翌日
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Paper sx={{ marginTop: "40px", overflow: 'auto' }}>
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        justifyContent="space-between"
                    >
                        {dates.map((item, index) => {
                            let isSelectedDate = item == new Date(displayDate).getDate();
                            let reservationNumber = 0;
                            therapist_reservations.forEach((reservation_item, index) => {
                                if (
                                    moment(new Date(reservation_item.reservation_from)).format("YYYY-MM-DDTHH:mm") >= moment(setClickDate(displayDate, item)).format("YYYY-MM-DD") + 'T10:00'
                                    && moment(new Date(reservation_item.reservation_to)).format("YYYY-MM-DDTHH:mm") <= moment(setClickDate(displayDate, item+1)).format("YYYY-MM-DD") + 'T06:00'
                                ) {
                                    reservationNumber++;
                                }
                            });
                            return (
                                <Stack
                                    key={index}
                                    direction={"column"}
                                    sx={{ position: "relative" }}
                                >
                                    <Box
                                        sx={{
                                            mt: 1,
                                            mb: 1,
                                            ml: 'auto',
                                            mr: 'auto',
                                            width: "25px",
                                            height: "25px",
                                            textAlign: "center",
                                            backgroundColor:
                                                "rgb(46, 204, 135)",
                                            color: "white",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        {reservationNumber}
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                            width: "46px",
                                            textAlign: "center",
                                            pt: "12px",
                                            pb: "12px",
                                            backgroundColor: isSelectedDate
                                                ? "#8cff92"
                                                : getColorDate(item),
                                            color: isSelectedDate
                                                ? "white"
                                                : "black",
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(0,0,0,0.1)",
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={(e) => {
                                            setDisplayDate((prev) => {
                                                setDatesFunc(
                                                    setClickDate(prev, item)
                                                );
                                                jquery_displayDate =
                                                    setClickDate(prev, item);
                                                return setClickDate(prev, item);
                                            });
                                        }}
                                    >
                                        {item}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Paper>

                <Box sx={{ mt: 5, mb: 5 }}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>エリア</StyledTableCell>
                                    <StyledTableCell align="right">
                                        時間
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        セラピスト
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        新規/リピーター
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        お客様名
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        オプション
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        オプション電子マネー使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        オプションカード使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        コース
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        コース電子マネー使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        コースカード使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        指名
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        延長
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        延長電子マネー使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        延長カード使用
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        お支払い額
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        セラピスト報酬
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        SB
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        利益
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.store}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.time}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.therapist}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.new_repeater}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.customer_name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.option}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <input type={'checkbox'}/>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.isOptionCard}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.menu}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <input type={'checkbox'}/>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.isMenuCard}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.nomination}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.extend}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            <input type={'checkbox'}/>
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.isExtendCard}
                                        </StyledTableCell>
                                        {/* <StyledTableCell align="right">
                                            <input type="checkbox" id={'flagElectronicMoney' + '_' + row.reservation_id} name={'flagElectronicMoney' + '_' + row.reservation_id} />
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.isCard}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.card_fee}
                                        </StyledTableCell> */}
                                        <StyledTableCell align="right">
                                            {row.account_from}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.account_to}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.sb}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {row.profits}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>

            <Container maxWidth={"lg"}>
                <Typography
                    sx={{
                        top: "104px",
                        fontFamily: "Roboto",
                        fontStyle: "normal",
                        fontWeight: "normal",
                        lineHeight: "24px",
                        fontSize: "28px",
                        letterSpacing: "3px",
                        color: "#fff",
                        textShadow: "4px 5px 6px #000",
                        margin: "16px 0px",
                        textDecoration: "none",
                        width: "100%",
                        paddingBottom: "15px",
                        borderBottom: "2px solid white",
                        mt: 10,
                    }}
                >
                    セラピスト集計
                </Typography>
            </Container>
            <Container maxWidth={'xl'}>
                <Box sx={{ mt: 5, mb: 5 }}>
                    <TableContainer component={Paper}>
                        <Table
                            sx={{ minWidth: 700 }}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        セラピスト
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        場所
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        待機時間
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        本指名
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        写真指名
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        フリー
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        DM
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        合計
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        セラピスト報酬
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        未払い金
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        封筒入金額
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        封筒チェック
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        備考
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {therapistTally_rows.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {row.tally_therapist}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_store}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_shiftTime.map((item, shiftTime_index)=>(
                                                <Typography key={shiftTime_index}>
                                                    {item[0] + ' ~ ' + item[1]}
                                                </Typography>
                                            ))}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_mainNomination}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_nomination}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_free}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_dm}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_sum}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_toFee}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <FormControl variant="standard" sx={{width: '100px'}}>
                                                <Input
                                                    id={'unpaidTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')}
                                                    name={'unpaidTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')}
                                                    type="number"
                                                    endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                                    defaultValue={row.tally_unpaid}
                                                    onChange={onChangeUnpaid}
                                                />
                                            </FormControl>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.tally_sales}
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            <input 
                                                type="checkbox" 
                                                id={'checkTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')} 
                                                name={'checkTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')}
                                                defaultChecked={row.tally_check} 
                                                onChange={onChangeCheck}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <input 
                                                type="text" 
                                                id={'remarksTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')} 
                                                name={'remarksTherapistTally' + '_' + row.tally_therapist + '_' + moment(new Date(displayDate)).format('YYYY-MM-DD')}
                                                style={{ backgroundColor: "transparent", border: 'none', outline: 'none' }}
                                                placeholder='備考を入力してください。'
                                                defaultValue={row.tally_remarks} 
                                                onChange={onChangeRemarks}
                                            />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        </MainLayout>
    );
}

export default DailyReport;
