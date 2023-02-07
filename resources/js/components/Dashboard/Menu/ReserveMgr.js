import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
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
    Modal ,
    Fade ,
    Backdrop,
    AppBar,
    Toolbar,
    Icon,
    Badge,
    IconButton,
    Tooltip,
    Chip
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';

import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';

import moment from "moment";
import MainLayout from "../../MainLayout/MainLayout";
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import { 
    setTherapistShiftAction, 
    setTherapistReservationsAction, 
    setConfirmedShiftsAction, 
    setReserveTableShiftsAction, 
    setTherapistAction,
    setReservationFullDataAction
 } from '../../../store/actions/therapistAction';
import { setTherapistShiftStoresAction } from '../../../store/actions/storeAction';
import { setAccountAssignAction } from '../../../store/actions/accountAssignAction';
import { setAccountCourseAction } from '../../../store/actions/accountCourseAction';
import { accountExtendAction } from '../../../store/actions/accountExtendAction';
import { setAccountOptionAction } from '../../../store/actions/accountOptionAction';
import { accountPaymentAction } from '../../../store/actions/accountPaymentAction';
import { customerRegistAction } from '../../../store/actions/customerAction';

import { DatePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import { DateTimePicker } from "@mui/x-date-pickers";
import { setClickDate, plusDate, setToGivenTime, plusMinute } from '../../../service/common';
import './menu.css';

import FilterSortClickTable from '../../TableComponent/FilterSortClickTable';

function createData(
    therapist_id,
    therapist_name,
    shift_store,
) {
    return {
        therapist_id,
        therapist_name,
        shift_store,
    };
}

function createStoreData(value, label)
{
    return {
        value,
        label
    }
}

var stores = [];

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

var g_displayDate = new Date();

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    // backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 'none',
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

function ReserveMgr() {
    const dispatch = useDispatch();
    const { therapists, therapist_shift, therapist_reservations, confirmedShifts, reserveTableShifts, reservationFullDatas } = useSelector(({therapistStore})=>therapistStore);
    const { therapistShiftStores } = useSelector(({storeStore})=>storeStore);
    const { accountAssigns } = useSelector(({accountAssignStore})=>accountAssignStore);
    const { accountCourses } = useSelector(({accountCourseStore})=>accountCourseStore);
    const { accountExtends } = useSelector(({accountExtendStore})=>accountExtendStore);
    const { accountOptions } = useSelector(({accountOptionStore})=>accountOptionStore);
    const { accountPayments } = useSelector(({accountPaymentStore})=>accountPaymentStore);
    const { customers } = useSelector(({customerStore})=>customerStore);

    const [rows, setRows] = useState([]);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    
    useEffect(()=>{
        getTherapistShifts();
        getStores();
        getAccountAssigns();
        getAccountMenus();
        getAccountExtends();
        getAccountOptions();
        getAccountPayments();
        getCustomers();
        getReservations();
        getConfirmedShifts();
        getTherapists();
        getReservationFullData();

        setDatesFunc(new Date());
    }, []);

    useEffect(()=>{
        getReserveTableShifts();
        setTimeAxlePosition();
    }, [displayDate, g_displayDate]);

    useEffect(()=>{
        let tmp_rows = therapists.length == 0 ? [] : reserveTableShifts.map((item, index)=>{
            let find_therapist = therapists.find((therapist_item)=>therapist_item.therapist_name == item.therapist_name);
            if(find_therapist != undefined) {
                return createData(
                    find_therapist.id, 
                    item.therapist_name,
                    item.shift_store,
                );
            } else {
                return createData(
                    -1, 
                    item.therapist_name,
                    item.shift_store,
                );
            }
        });
        setRows(tmp_rows);
    }, [therapists, reserveTableShifts]);

    stores = therapistShiftStores.map((item, index)=>{
        return createStoreData(
            // item.id,
            item.store_name,
            item.store_name
        );
    });

    const onClickTimeCell = (event, clickedTherapist, clickedTime, clickdeStore) => {
        let clickedHour = clickedTime.split(':')[0];
        let clickedMinute = clickedTime.split(':')[1];

        switch(getCellStatus(clickdeStore, Number(clickedTherapist), clickedTime)) {
            case 0:
                break;
            case 1:
                setCellShiftId(getCellShiftId(clickdeStore, Number(clickedTherapist), clickedTime));
                setReserveStore(clickdeStore);
                setValTherapist(clickedTherapist);
                setValStartReservationTime(setToGivenTime(displayDate, clickedHour, clickedMinute));
                setValEndReservationTime(setToGivenTime(displayDate, clickedHour, Number(clickedMinute)+90));

                setFlagClickReserved(false);

                handleOpenModal();
                break;
            case 2:
                let clickedCellDateTime = moment(setToGivenTime(displayDate, clickedHour, clickedMinute)).format('YYYY-MM-DDTHH:mm:ss');
                let reservedInfo = therapist_reservations.find((reserve_item)=>{
                    let isContainReserveTime = moment(clickedCellDateTime).isSame(reserve_item.reservation_from) || moment(clickedCellDateTime).isBetween(reserve_item.reservation_from, reserve_item.reservation_to);
                    return reserve_item.reserve_store == clickdeStore && reserve_item.therapist_id == clickedTherapist && isContainReserveTime;
                });

                setReserveStore(clickdeStore);
                setValTherapist(reservedInfo.therapist_id);
                setValNomination(reservedInfo.nomination_id);
                setValDiscount(reservedInfo.discount);
                setValMenu(reservedInfo.menu_id);
                setValExtend(reservedInfo.extend_id);
                setValOption(reservedInfo.option_id);
                setValMenuPayment(reservedInfo.menu_payment_id);
                setValExtendPayment(reservedInfo.extend_payment_id);
                setValOptionPayment(reservedInfo.option_payment_id);
                setValStartReservationTime(new Date(reservedInfo.reservation_from));
                setValEndReservationTime(new Date(reservedInfo.reservation_to));
                setValFee(reservedInfo.fee);
                setValCustomerName(reservedInfo.customer_name);
                setValCustomerTel(reservedInfo.customer_tel);
                setValNewRepeater(reservedInfo.new_repeater);
                setValCustomerRequest(reservedInfo.customer_req==null ? '' : reservedInfo.customer_req);
                setValTreatment(reservedInfo.treatment_memo==null ? '' : reservedInfo.treatment_memo);
                setValContactMemo(reservedInfo.contact_memo==null ? '' : reservedInfo.contact_memo);

                setFlagClickReserved(true);
                setClickedReservationId(reservedInfo.id);

                handleOpenModal();
                break;
        }
    }

    const getTherapistShifts = () => {
        axios
        .get('/api/getshifttherapists')
        .then((res)=>{
            dispatch(setTherapistShiftAction(res.data));
        });
    }

    const getStores = () => {
        axios
        .get('/api/getstores')
        .then((res)=>{
            dispatch(setTherapistShiftStoresAction(res.data));
        });
    }

    const getAccountAssigns = () => {
        axios
        .get('/api/getAccountAssgin')
        .then((res)=>{
            dispatch(setAccountAssignAction(res.data));
        });
    }

    const getAccountMenus = () => {
        axios
        .get('/api/getAccountCourses')
        .then((res)=>{
            dispatch(setAccountCourseAction(res.data));
        });
    }

    const getAccountExtends = () => {
        axios
        .get('/api/getAccountExtend')
        .then((res)=>{
            dispatch(accountExtendAction(res.data));
        });
    }

    const getAccountOptions = () => {
        axios
        .get('/api/getAccountOption')
        .then((res)=>{
            dispatch(setAccountOptionAction(res.data));
        });
    }

    const getAccountPayments = () => {
        axios
        .get('/api/getAccountPayment')
        .then((res)=>{
            dispatch(accountPaymentAction(res.data));
        });
    }

    const getCustomers = () => {
        axios
        .get('/api/getcustomers')
        .then((res)=>{
            dispatch(customerRegistAction(res.data));
        });
    }

    const getReservations = () => {
        axios
            .get('/api/getReservations')
            .then(res=>{
                dispatch(setTherapistReservationsAction(res.data));
            });
    }

    const getConfirmedShifts = () => {
        axios
        .get('/api/getConfirmedShifts')
        .then((res)=>{
            dispatch(setConfirmedShiftsAction(res.data));
        });
    }

    const getReserveTableShifts = () => {
        axios
        .post('/api/getReserveTableShifts', {
            dayStartDateTime: moment(g_displayDate).format('YYYY-MM-DD') + 'T10:00',
            dayEndDateTime: moment(plusDate(g_displayDate, 1)).format('YYYY-MM-DD') + 'T06:00',
        })
        .then((res)=>{
            console.log(res.data);
            dispatch(setReserveTableShiftsAction(res.data));
        });
    }

    const getTherapists = () => {
        axios
        .get('/api/gettherapists')
        .then((res)=>{
            dispatch(setTherapistAction(res.data));
        });
    }

    const getReservationFullData = () => {
        axios
        .get('/api/getReservationFullData')
        .then((res)=>{
            dispatch(setReservationFullDataAction(res.data));
        });
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };
    
    const headCells = [
        {
          id: 'up_down',
          numeric: true,
          disablePadding: false,
          label: '',
        },        
        {
          id: 'shift_store',
          numeric: true,
          disablePadding: false,
          label: '店舗',
        },
        {
            id: 'therapist_name',
            numeric: false,
            disablePadding: false,
            label: '名前',
        },
        {
            id: '10clock',
            numeric: false,
            disablePadding: false,
            label: '10:00',
        },
        {
            id: '11clock',
            numeric: false,
            disablePadding: false,
            label: '11:00',
        },
        {
            id: '12clock',
            numeric: false,
            disablePadding: false,
            label: '12:00',
        },
        {
            id: '13clock',
            numeric: false,
            disablePadding: false,
            label: '13:00',
        },
        {
            id: '14clock',
            numeric: false,
            disablePadding: false,
            label: '14:00',
        },
        {
            id: '15clock',
            numeric: false,
            disablePadding: false,
            label: '15:00',
        },
        {
            id: '16clock',
            numeric: false,
            disablePadding: false,
            label: '16:00',
        },
        {
            id: '17clock',
            numeric: false,
            disablePadding: false,
            label: '17:00',
        },
        {
            id: '18clock',
            numeric: false,
            disablePadding: false,
            label: '18:00',
        },
        {
            id: '19clock',
            numeric: false,
            disablePadding: false,
            label: '19:00',
        },
        {
            id: '20clock',
            numeric: false,
            disablePadding: false,
            label: '20:00',
        },
        {
            id: '21clock',
            numeric: false,
            disablePadding: false,
            label: '21:00',
        },
        {
            id: '22clock',
            numeric: false,
            disablePadding: false,
            label: '22:00',
        },
        {
            id: '23clock',
            numeric: false,
            disablePadding: false,
            label: '23:00',
        },
        {
            id: '0clock',
            numeric: false,
            disablePadding: false,
            label: '0:00',
        },
        {
            id: '1clock',
            numeric: false,
            disablePadding: false,
            label: '1:00',
        },
        {
            id: '2clock',
            numeric: false,
            disablePadding: false,
            label: '2:00',
        },
        {
            id: '3clock',
            numeric: false,
            disablePadding: false,
            label: '3:00',
        },
        {
            id: '4clock',
            numeric: false,
            disablePadding: false,
            label: '4:00',
        },
        {
            id: '5clock',
            numeric: false,
            disablePadding: false,
            label: '5:00',
        },
    ];

    const status = [
        {
            value: '未定',
            label: '未定',
        },
        {
            value: '出勤',
            label: '出勤',
        },
        {
            value: '休み',
            label: '休み',
        },
        {
            value: 'TEL確認',
            label: 'TEL確認',
        },
        {
            value: '受付終了',
            label: '受付終了',
        },
        {
            value: 'ご予約満了',
            label: 'ご予約満了',
        },
    ];

    const [displayDate, setDisplayDate] = useState(new Date());
    const [dates, setDates] = useState([]);

    const setDatesFunc = (i_date) => {
        let current_month = new Date(i_date).getMonth();
        let tmp_date = new Date(i_date);
        tmp_date.setDate(29);
        if(tmp_date.getMonth() != current_month)
        {
            setDates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);
        } else {
            tmp_date.setDate(31);
            if(tmp_date.getMonth() != current_month) {
                setDates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
            } else {
                setDates([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
            }
        }
    }

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        
        setValTherapist(-1);
        setValNomination(6);
        setValDiscount(0);
        setValMenu(-1);
        setValExtend(-1);
        setValOption(-1);
        setValMenuPayment(2);
        setValExtendPayment(2);
        setValOptionPayment(2);
        setValStartReservationTime(dayjs());
        setValEndReservationTime(dayjs());
        setValFee(0);
        setValCustomerName('');
        setValCustomerTel('');
        setValNewRepeater('新規');
        setValCustomerRequest('');
        setValTreatment('');
        setValContactMemo('');
    };

    const [openChildModal, setOpenChildModal] = React.useState(false);
    const handleOpenChildModal = () => {setOpenChildModal(true);};
    const handleCloseChildModal = () => {setOpenChildModal(false);};
  
    const [cellShiftId, setCellShiftId] = useState(-1);
    const [reserveStore, setReserveStore] = useState('');
    const [val_therapist, setValTherapist] = useState(-1);
    const [val_nomination ,setValNomination] = useState(6);
    const [val_discount, setValDiscount] = useState(0);
    const [val_menu, setValMenu] = useState(-1);
    const [val_menuPayment, setValMenuPayment] = useState(2);
    const [val_extend, setValExtend] = useState(-1);
    const [val_extendPayment, setValExtendPayment] = useState(2);
    const [val_option, setValOption] = useState(-1);
    const [val_optionPayment, setValOptionPayment] = useState(2);
    const [val_cardFee, setValCardFee] = useState(0);
    const [val_startReservationTime, setValStartReservationTime] = useState(dayjs());
    const [val_endReservationTime, setValEndReservationTime] = useState(dayjs());
    const [val_fee, setValFee] = useState(0);
    const [val_customerName, setValCustomerName] = useState('');
    const [val_customerTel, setValCustomerTel] = useState('');
    const [val_new_repeater, setValNewRepeater] = useState('新規');
    const [val_customerRequest, setValCustomerRequest] = useState('');
    const [val_treatment, setValTreatment] = useState('');
    const [val_contactMemo, setValContactMemo] = useState('');

    const [flag_clickReserved, setFlagClickReserved] = useState(false);
    const [clickedReservationId, setClickedReservationId] = useState(-1);

    const [timeAxleLeft, setTimeAxleLeft] = useState(263);

    const setTimeAxlePosition = () => {
        let displayStartDateTime = setToGivenTime(displayDate, 10, 0).getTime();
        let displayEndDateTime = setToGivenTime(displayDate, 30, 0).getTime();
        let nowTime = new Date().getTime();

        if(nowTime < displayStartDateTime) {
            setTimeAxleLeft(263);
        } else if(nowTime>displayStartDateTime && nowTime<displayEndDateTime) {
            setTimeAxleLeft(263+(nowTime-displayStartDateTime)*(150/3600000));
        } else if(nowTime>displayEndDateTime) {
            setTimeAxleLeft(263);
        }
    }

    const onSaveReservation = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let Info = {
            shift_id: cellShiftId,
            therapist: val_therapist,
            reserve_store: reserveStore,
            nomination: formData.get('nomination'),
            discount: formData.get('discount'),
            menu: formData.get('menu'),
            extend: formData.get('extend'),
            input_option: formData.get('input_option'),
            menu_payment: formData.get('menu_payment'),
            extend_payment: formData.get('extend_payment'),
            option_payment: formData.get('option_payment'),
            card_fee: val_cardFee,
            startReservationTime: moment(new Date(val_startReservationTime)).format('YYYY-MM-DDTHH:mm:ss'),
            endReservationTime: moment(new Date(val_endReservationTime)).format('YYYY-MM-DDTHH:mm:ss'),
            fee: formData.get('fee'),
            customer_name: formData.get('customer_name'),
            customer_tel: formData.get('customer_tel'),
            new_repeater: formData.get('new_repeater'),
            customer_req: formData.get('customer_req'),
            treatment: formData.get('treatment'),
            contact_memo: formData.get('contact_memo'),
        };

        if(confirm('現在の内容で予約を保存します。本当によろしいですか？') == true) {
            axios
                .post('/api/registReservation', Info)
                .then(res=>{
                    toast.success('成果的に予約されました。', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                    getReservations();
                    getReservationFullData();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('予約が失敗しました。\nもう一度お試しください。');
                    }
                });
        } else {
            toast.error('予約はキャンセルされました。');
        }
    }

    const onReservationEdit = (event) => {
        let Info = {
            reservationId: clickedReservationId,
            therapist: val_therapist,
            reserve_store: reserveStore,
            nomination: val_nomination,
            discount: val_discount,
            menu: val_menu,
            extend: val_extend,
            input_option: val_option,
            menu_payment: val_menuPayment,
            extend_payment: val_extendPayment,
            option_payment: val_optionPayment,
            card_fee: val_cardFee,
            startReservationTime: moment(new Date(val_startReservationTime)).format('YYYY-MM-DDTHH:mm:ss'),
            endReservationTime: moment(new Date(val_endReservationTime)).format('YYYY-MM-DDTHH:mm:ss'),
            fee: val_fee,
            customer_name: val_customerName,
            customer_tel: val_customerTel,
            new_repeater: val_new_repeater,
            customer_req: val_customerRequest,
            treatment: val_treatment,
            contact_memo: val_contactMemo
        };

        if(confirm('現在の内容で予約を保存します。本当によろしいですか？') == true) {
            axios
                .post('/api/editReservation', Info)
                .then(res=>{
                    toast.success('予約内容が変更されました。', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                    getReservations();
                    getReservationFullData();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('予約変更が失敗しました。');
                    }
                });
        } else {
            toast.error('予約変更をキャンセルしました。');
        }
    }

    const onReservationDelete = (event) => {
        if(confirm('この予約をキャンセルします。本当によろしいですか？') == true) {
            axios
                .post('/api/deleteReservation', {reservationId: clickedReservationId})
                .then(res=>{
                    toast.success('予約はキャンセルされました。', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                        transition: Flip,
                    });
                    getReservations();
                    getReservationFullData();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('予約キャンセルに失敗しました。');
                    }
                });
        }
    }

    const doubleClickhandler = (name, tel) => {
        setValCustomerName(name);
        setValCustomerTel(tel);
        handleCloseChildModal();
    };

    const onClickUp = (event, index) => {
        let tmp_rows = [];
        if(index>0) {
            // exchange element by index in array
            let tmp_item = rows[index];
            rows[index] = rows[index-1];
            rows[index-1] = tmp_item;

            rows.forEach(item=>{
                tmp_rows.push(item);
            });
            setRows(tmp_rows);
        }
    }

    const onClickDown = (event, index) => {
        let tmp_rows = [];
        if(index<rows.length-1) {
            // exchange element by index in array
            let tmp_item = rows[index];
            rows[index] = rows[index+1];
            rows[index+1] = tmp_item;

            rows.forEach(item=>{
                tmp_rows.push(item);
            });
            setRows(tmp_rows);
        }
    }

    const onClickFirst = (event, index) => {
        let tmp_rows = [];

        let move_elemnt = rows.splice(index, 1);
        rows.unshift(...move_elemnt);

        rows.forEach(item=>{
            tmp_rows.push(item);
        });
        setRows(tmp_rows);
    }

    const onClickLast = (event, index) => {
        let tmp_rows = [];

        let move_elemnt = rows.splice(index, 1);
        rows.push(...move_elemnt);

        rows.forEach(item=>{
            tmp_rows.push(item);
        });
        setRows(tmp_rows);
    }

    // const isReserved = (i_therapistId, i_time) => {
    //     let flag_isReserved = false;
    //     let hour = i_time.split(':')[0];
    //     let minute = i_time.split(':')[1];
    //     let piece_time = moment(setToGivenTime(displayDate, hour, minute)).format('YYYY-MM-DDTHH:mm:ss');

    //     for(let i=0; i<therapist_reservations.length; i++)
    //     {
    //         if(i_therapistId == therapist_reservations[i].therapist_id) {
    //             if(moment(piece_time).isSame(therapist_reservations[i].reservation_from) || moment(piece_time).isBetween(therapist_reservations[i].reservation_from, therapist_reservations[i].reservation_to)) {
    //                 flag_isReserved = true;
    //                 break;
    //             }
    //         }
    //     }

    //     return flag_isReserved;
    // }

    // const onClickBtnPlus = (event) => {
    //     setFlagClickReserved(false);
    //     handleOpenModal();
    // }

    const getTherapistMemo = (therapist_id) => {
        let therapist_memo = '';
        for(let i=0; i<therapist_shift.length; i++) {
            if(therapist_id == therapist_shift[i].id ) {
                therapist_memo = therapist_shift[i].therapist_memo == null ? '' : therapist_shift[i].therapist_memo;
                break;
            }
        }
        return therapist_memo == null ? '' : therapist_memo;
    }

    const getCustomerMemo = (customer_name) => {
        let selectedCustomer = customers.find(customer_item=>customer_item.customer_name == customer_name);
        if(selectedCustomer != undefined) {
            return selectedCustomer.customer_memo == null ? '' : selectedCustomer.customer_memo;
        } else {
            return '';
        }
    }

    const getCellStatus = (cell_store, cell_therapist, cell_time) => {
        //0: absent, 1: work, 2: reserved
        let cell_status = 0;

        let hour = cell_time.split(':')[0];
        let minute = cell_time.split(':')[1];
        let piece_time = moment(setToGivenTime(displayDate, hour, minute)).format('YYYY-MM-DDTHH:mm:ss');
        let cell_shift = confirmedShifts.find((shift_item)=>{
            let isContainShiftTime = moment(piece_time).isSame(shift_item.shift_fromTime) || moment(piece_time).isBetween(shift_item.shift_fromTime, shift_item.shift_toTime);
            return shift_item.shift_store == cell_store && shift_item.therapist_id == cell_therapist && isContainShiftTime;
        });

        if(cell_shift != undefined) {
            cell_status = 1;
            let cell_reservation = therapist_reservations.find((reserve_item)=>{
                let isContainReserveTime = moment(piece_time).isSame(reserve_item.reservation_from) || moment(piece_time).isBetween(reserve_item.reservation_from, reserve_item.reservation_to);
                return reserve_item.reserve_store == cell_store && reserve_item.therapist_id == cell_therapist && isContainReserveTime;
            });

            if(cell_reservation!=undefined) {
                cell_status = 2;
            }
        }

        return cell_status;
    }
    
    const getReservationByStartCell = (cell_store, cell_therapist, start_cell_time) => {

        let hour = start_cell_time.split(':')[0];
        let minute = start_cell_time.split(':')[1];
        let piece_time = moment(setToGivenTime(displayDate, hour, minute)).format('YYYY-MM-DDTHH:mm:ss');

        let start_cell_reservation = reservationFullDatas.find((reserve_item)=>{
            let isContainReserveTime = moment(piece_time).isSame(reserve_item.reservation_from);
            return reserve_item.reserve_store == cell_store && reserve_item.therapist_id == cell_therapist && isContainReserveTime;
        });

        return start_cell_reservation;
    }

    const getCellShiftId = (cell_store, cell_therapist, cell_time) => {

        let hour = cell_time.split(':')[0];
        let minute = cell_time.split(':')[1];
        let piece_time = moment(setToGivenTime(displayDate, hour, minute)).format('YYYY-MM-DDTHH:mm:ss');
        let cell_shift = confirmedShifts.find((shift_item)=>{
            let isContainShiftTime = moment(piece_time).isSame(shift_item.shift_fromTime) || moment(piece_time).isBetween(shift_item.shift_fromTime, shift_item.shift_toTime);
            return shift_item.shift_store == cell_store && shift_item.therapist_id == cell_therapist && isContainShiftTime;
        });

        if(cell_shift != undefined) {
            return cell_shift.id;
        } else {
            return -1;
        }
    }

    const setClassNameToCell = (cell_store, cell_therapist, cell_time) => {
        switch(getCellStatus(cell_store, cell_therapist, cell_time)) {
            case 0:
                return 'absent_cell';
                break;
            case 1:
                return 'shift_cell';
                break;
            case 2:
                return 'reserve_cell';
                break;
        }
    }

    const getRequestFeeFromNominationId = (i_nominationId) => {
        if(i_nominationId == -1) {
            return 0;
        } else {
            if(accountAssigns.find((item)=>item.id==i_nominationId) != undefined) {
                return Number(accountAssigns.find((item)=>item.id==i_nominationId).accountCourse_from);
            } else {
                return 0;
            }
        }
    }

    const getRequestFeeFromMenuId = (i_menuId, i_menuPaymentId) => {
        if(i_menuId == -1) {
            return [0, 0];
        } else {
            let find_menu = accountCourses.find((item)=>item.id==i_menuId);
            let find_payment = accountPayments.find((item)=>item.id==i_menuPaymentId);
            if(find_menu != undefined && find_payment != undefined) {
                if(find_payment.accountCourse_name.includes('カード')) {
                    return [
                        Number(find_menu.accountCourse_from) * 1.1, 
                        Number(find_menu.accountCourse_from) * 0.1
                    ];
                } else {
                    return [Number(find_menu.accountCourse_from), 0];
                }
            } else {
                return [0, 0];
            }
        }
    }

    const getRequestFeeFromExtendId = (i_id, i_extendPaymentId) => {
        if(i_id == -1) {
            return [0, 0];
        } else {
            let find_extend = accountExtends.find((item)=>item.id==i_id);
            let find_payment = accountPayments.find((item)=>item.id==i_extendPaymentId);
            if(find_extend != undefined && find_payment != undefined) {
                if(find_payment.accountCourse_name.includes('カード')) {
                    return [
                        Number(find_extend.accountCourse_from) * 1.1,
                        Number(find_extend.accountCourse_from) * 0.1
                    ];
                } else {
                    return [
                        Number(find_extend.accountCourse_from),
                        0
                    ];
                }
            } else {
                return [0, 0];
            }
        }
    }

    const getRequestFeeFromOptionId = (i_id, i_optionPaymentId) => {
        if(i_id == -1) {
            return [0, 0];
        } else {
            let find_option = accountOptions.find((item)=>item.id==i_id);
            let find_payment = accountPayments.find((item)=>item.id==i_optionPaymentId);
            if(find_option != undefined && find_payment != undefined) {
                if(find_payment.accountCourse_name.includes('カード')) {
                    return [
                        Number(find_option.accountCourse_from) * 1.1,
                        Number(find_option.accountCourse_from) * 0.1
                    ];
                } else {
                    return [
                        Number(find_option.accountCourse_from),
                        0
                    ]
                }
            } else {
                return [0, 0];
            }
        }
    }

    const getReservationFeeCardFee = (
        i_nominationId, i_menuId, i_menuPaymentId, i_extendId, i_extendPaymentId, i_optionId, i_optionPaymentId, i_discount
    ) => ([
        /* Fee */
        getRequestFeeFromNominationId(i_nominationId)
        + getRequestFeeFromMenuId(i_menuId, i_menuPaymentId)[0]
        + getRequestFeeFromExtendId(i_extendId, i_extendPaymentId)[0]
        + getRequestFeeFromOptionId(i_optionId, i_optionPaymentId)[0]
        - Number(i_discount),
        /* Card Fee */
        getRequestFeeFromMenuId(i_menuId, i_menuPaymentId)[1]
        + getRequestFeeFromExtendId(i_extendId, i_extendPaymentId)[1]
        + getRequestFeeFromOptionId(i_optionId, i_optionPaymentId)[1]
    ])

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

    return (
        <MainLayout title={"LynxGroup"} partTitle={'予約管理'} isShowPartTitle={true}>
            <Container maxWidth={'xl'}>
                <Box sx={{marginTop: '40px', pr: 2, pl: 2}}>
                    <Grid container spacing={3} justifyContent={'center'}>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button 
                                variant="outlined" 
                                size="medium" 
                                onClick={e=>{
                                    setDisplayDate(prev=>{
                                        setDatesFunc(plusDate(prev, -1)); 
                                        g_displayDate = plusDate(prev, -1);
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
                                    g_displayDate = new Date(newValue);
                                    setDatesFunc(newValue);
                                }}
                                renderInput={(params) => <TextField style={{textAlign: 'center', fontSize: '24px'}} variant="standard" {...params} />}
                                style={{textAlign: 'center', fontSize: '24px'}}
                            />
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button 
                                variant="outlined" 
                                size="medium" 
                                onClick={e=>{
                                    setDisplayDate(prev=>{
                                        setDatesFunc(plusDate(prev, 1));
                                        g_displayDate = plusDate(prev, 1);
                                        return plusDate(prev, 1);
                                    });
                                }}
                            >
                                翌日
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Paper sx={{marginTop: '40px', overflow: 'auto'}}>
                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} justifyContent="space-between">
                        {
                            dates.map((item, index)=>{
                                let isSelectedDate = item == new Date(displayDate).getDate();
                                let reservationNumber = 0;
                                therapist_reservations.forEach((reservation_item, index)=>{
                                    if(
                                        moment(new Date(reservation_item.reservation_from)).format("YYYY-MM-DDTHH:mm") >= moment(setClickDate(displayDate, item)).format("YYYY-MM-DD") + 'T10:00'
                                        && moment(new Date(reservation_item.reservation_to)).format("YYYY-MM-DDTHH:mm") <= moment(setClickDate(displayDate, item+1)).format("YYYY-MM-DD") + 'T06:00'
                                    ) {
                                        reservationNumber++;
                                    }
                                });
                                return(
                                    <Stack key={index} direction={'column'} sx={{position: 'relative'}}>
                                        <Box sx={{ mt: 1, mb: 1, ml: 'auto', mr: 'auto', width: '25px', height: '25px', textAlign: 'center', backgroundColor: 'rgb(46, 204, 135)', color: 'white', borderRadius: '50%' }} >{reservationNumber}</Box>
                                        <Typography
                                            sx={{
                                                fontSize: '18px', 
                                                width: '46px',
                                                textAlign: 'center',
                                                pt: '12px',
                                                pb: '12px',
                                                backgroundColor: isSelectedDate?'#8cff92':getColorDate(item),
                                                color: isSelectedDate?'white':'black',
                                                "&:hover": {
                                                    backgroundColor: 'rgba(0,0,0,0.1)',
                                                    cursor: "pointer",
                                                }
                                            }}
                                            onClick={e => {
                                                setDisplayDate(prev=>{
                                                    setDatesFunc(setClickDate(prev, item));
                                                    g_displayDate = setClickDate(prev, item);
                                                    return setClickDate(prev, item);
                                                });
                                            }}
                                        >
                                            {item}
                                        </Typography>
                                    </Stack>
                                )
                            })
                        }
                    </Stack>
                </Paper>
            </Container>

            <Container maxWidth={'xl'}>
                <Box sx={{marginTop: '40px'}}>
                    <Paper className="reservationTable" sx={{ width: "100%", mb: 2, mt: 8 }}>
                        <TableContainer>
                            <Table
                                sx={{
                                    width: '100%'
                                }}
                                aria-labelledby="tableTitle"
                                size="medium"
                            >
                                <TableHead>
                                    <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align='center'
                                            className="storeTherapistName"
                                            padding={headCell.disablePadding ? 'none' : 'normal'}
                                            sortDirection={orderBy === headCell.id ? order : false}
                                            sx={{
                                                pt: 1,
                                                pb: 1
                                            }}
                                        >
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={createSortHandler(headCell.id)}
                                            >
                                                {headCell.label}
                                                {orderBy === headCell.id ? (
                                                <Box component="span" sx={visuallyHidden}>
                                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody sx={{position: 'relative'}}>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                tabIndex={-1}
                                                key={index}
                                            >
                                                <TableCell align="center" 
                                                    style={{
                                                        height: '51px',
                                                        position: 'sticky',
                                                        left: '0',
                                                        zIndex: '9',
                                                        border: '2px solid rgba(224, 224, 224, 1)',
                                                        padding: '5px 0px',
                                                    }}
                                                >
                                                    <Stack 
                                                        className="vertical_horizon_center" 
                                                        spacing={0} 
                                                        direction={'row'} 
                                                        sx={{
                                                            width: '100%', 
                                                            height: '100%',
                                                            backgroundColor: 'white',
                                                            pl: '5px'
                                                        }}
                                                    >
                                                        <Stack direction={'column'} spacing={0}>
                                                            <IconButton
                                                                color="warning" 
                                                                aria-label="up_arrow" 
                                                                component="label" 
                                                                sx={{p: 0}}
                                                                onClick={event=> onClickUp(event, index)}
                                                            >
                                                                <KeyboardArrowUpOutlinedIcon />
                                                            </IconButton>

                                                            <IconButton 
                                                                color="warning" 
                                                                aria-label="down_arrow" 
                                                                component="label" 
                                                                sx={{p: 0}}
                                                                onClick={event=> onClickDown(event, index)}
                                                            >
                                                                <KeyboardArrowDownOutlinedIcon />
                                                            </IconButton>
                                                        </Stack>

                                                        <Stack direction={'column'} spacing={0}>
                                                            <IconButton
                                                                color="warning" 
                                                                aria-label="first_arrow" 
                                                                component="label" 
                                                                sx={{p: 0}}
                                                                onClick={event=> onClickFirst(event, index)}
                                                            >
                                                                <KeyboardDoubleArrowUpOutlinedIcon />
                                                            </IconButton>

                                                            <IconButton 
                                                                color="warning" 
                                                                aria-label="last_arrow" 
                                                                component="label" 
                                                                sx={{p: 0}}
                                                                onClick={event=> onClickLast(event, index)}
                                                            >
                                                                <KeyboardDoubleArrowDownOutlinedIcon />
                                                            </IconButton>
                                                        </Stack>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell
                                                    id={labelId}
                                                    align="center"
                                                    style={{border: '2px solid rgba(224, 224, 224, 1)', padding: '0px'}}
                                                    sx={{
                                                        height: '51px',
                                                        position: 'sticky',
                                                        left: '60px',
                                                        zIndex: '9',
                                                    }}
                                                >
                                                    <Typography sx={{
                                                        width: "100px", 
                                                        height: '51px',
                                                        overflow: 'hidden',
                                                        fontSize: {xs: '11px', md: '12px', lg: '1rem'}, 
                                                        backgroundColor: 'white',
                                                        lineHeight: 1,
                                                        paddingTop: '10px'
                                                    }}>
                                                        {row.shift_store}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell 
                                                    className="storeTherapistName" 
                                                    align="center" 
                                                    style={{border: '2px solid rgba(224, 224, 224, 1)', padding: '0px'}}
                                                    sx={{
                                                        height: '51px',
                                                        position: 'sticky',
                                                        left: '162px',
                                                        zIndex: '9',
                                                    }}
                                                >
                                                    <Typography sx={{
                                                        width: "100px", 
                                                        height: '51px',
                                                        overflow: 'hidden',
                                                        fontSize: {xs: '11px', md: '12px', lg: '1rem'}, 
                                                        backgroundColor: 'white',
                                                        lineHeight: 1,
                                                        paddingTop: '10px'
                                                    }}>
                                                        {row.therapist_name}
                                                    </Typography>
                                                </TableCell>
                                                {['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', 
                                                '21', '22', '23', '24', '25', '26', '27', '28', '29'].map((hour_item)=>(
                                                    <TableCell key={hour_item} align="center" sx={{p: 0}}>
                                                        <Grid container sx={{width: '150px'}}>
                                                            {['00', '10', '20', '30', '40', '50'].map((minute_item)=>{
                                                                
                                                                let cell_status = getCellStatus(row.shift_store, row.therapist_id, hour_item + ':' + minute_item);
                                                                let startCellReservation = getReservationByStartCell(row.shift_store, row.therapist_id, hour_item + ':' + minute_item);
                                                                let tooltip_title = '';

                                                                if(cell_status == 2) {
                                                                    let cellDateTime = moment(setToGivenTime(displayDate, hour_item, minute_item)).format('YYYY-MM-DDTHH:mm:ss');
                                                                    let reservedInfo = reservationFullDatas.find((reserve_item)=>{
                                                                        let isContainReserveTime = moment(cellDateTime).isSame(reserve_item.reservation_from) || moment(cellDateTime).isBetween(reserve_item.reservation_from, reserve_item.reservation_to);
                                                                        return reserve_item.reserve_store == row.shift_store && reserve_item.therapist_id == row.therapist_id && isContainReserveTime;
                                                                    });
                                                                    if(reservedInfo != undefined) {
                                                                        tooltip_title = <React.Fragment>
                                                                                            <Typography>[時間] {moment(new Date(reservedInfo.reservation_from)).format('HH:mm')} ~ {moment(new Date(reservedInfo.reservation_to)).format('HH:mm')}</Typography>
                                                                                            <Typography>[コース] {reservedInfo.menu_name}</Typography>
                                                                                            <Typography>[指名] {reservedInfo.nomination_name}</Typography>
                                                                                            <Typography>[料金] {reservedInfo.fee}</Typography>
                                                                                            <Typography>[お客様名] {reservedInfo.customer_name}</Typography>
                                                                                            <Typography>[TEL] {reservedInfo.customer_tel}</Typography>
                                                                                            <Typography>[連絡用備考] {reservedInfo.contact_memo == null ? '' : reservedInfo.contact_memo}</Typography>
                                                                                        </React.Fragment>
                                                                    } else {
                                                                        tooltip_title = '';
                                                                    }
                                                                } else {
                                                                    tooltip_title = '';
                                                                }

                                                                return  <HtmlTooltip 
                                                                            key={hour_item + ':' + minute_item} 
                                                                            title={
                                                                                tooltip_title
                                                                            } 
                                                                            TransitionProps={{ timeout: 600 }}
                                                                            sx={{whiteSpace: 'pre-wrap'}} 
                                                                            arrow
                                                                            followCursor
                                                                        >
                                                                            <Grid item 
                                                                                sx={{position: 'relative'}}
                                                                                id={"timePiece" + "_" + row.therapist_id + "_" + hour_item + ':' + minute_item + "_" + row.shift_store}
                                                                                className={`timePiece ${setClassNameToCell(row.shift_store, row.therapist_id, hour_item + ':' + minute_item)}`}
                                                                                onClick={event=>onClickTimeCell(event, row.therapist_id, hour_item + ':' + minute_item, row.shift_store)}
                                                                            >
                                                                                {startCellReservation != undefined &&
                                                                                    <Box 
                                                                                        sx={{
                                                                                            position: 'absolute',
                                                                                            zIndex: '1',
                                                                                            backgroundColor: 'rgb(225, 245, 235)',
                                                                                            border: '1px solid rgb(155, 199, 178)',
                                                                                            width: 100 * ((new Date(startCellReservation.reservation_to).getTime()-new Date(startCellReservation.reservation_from).getTime())/600000) + '%',
                                                                                            height: '100%',
                                                                                            pl: 1,
                                                                                            overflow: 'hidden',
                                                                                        }}
                                                                                    >
                                                                                        <Typography sx={{p:0, textAlign: 'left', fontSize: '13px', lineHeight: '2'}}>[{startCellReservation.customer_name}]</Typography>
                                                                                        <Stack direction={'row'} span={2} sx={{p:0, textAlign: 'left', fontSize: '13px', lineHeight: '2'}}>
                                                                                            {startCellReservation.nomination_name == '本指名' &&
                                                                                                <Chip label="本指名" color="success" size="small" sx={{fontSize: '12px', height: '20px'}} />
                                                                                            }
                                                                                            {startCellReservation.nomination_name == '写真指名' &&
                                                                                                <Chip label="指名" color="primary" size="small" sx={{fontSize: '12px', height: '20px'}} />
                                                                                            }
                                                                                            {startCellReservation.nomination_name == 'フリー' &&
                                                                                                <Chip label="フリー" color="warning" variant="outlined" size="small" sx={{fontSize: '12px', height: '20px'}} />
                                                                                            }
                                                                                            {startCellReservation.nomination_name != 'フリー' 
                                                                                                && startCellReservation.nomination_name != '写真指名' 
                                                                                                && startCellReservation.nomination_name != '本指名' &&
                                                                                                <Typography sx={{p:0, textAlign: 'left', fontSize: '13px', lineHeight: '2'}}>[{startCellReservation.nomination_name}]</Typography>
                                                                                            }
                                                                                            <Typography sx={{p:0, textAlign: 'left', fontSize: '13px', lineHeight: '2'}}>[{startCellReservation.menu_name}]</Typography>
                                                                                        </Stack>
                                                                                    </Box>
                                                                                }
                                                                            </Grid>
                                                                        </HtmlTooltip>
                                                            })}
                                                        </Grid>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: 53 * emptyRows
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                    <tr style={{ left: timeAxleLeft + 'px' }} className='nowTimeAxle' ></tr>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[50, 100, 125]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </Container>

            {/* <Button
                variant="outlined" 
                size="medium"  
                sx={{
                    mt: 4,
                    mb:3,
                    mr: 3,
                    float: "right"
                }}
                onClick={onClickBtnPlus}
            >
                <AddToPhotosOutlinedIcon />
            </Button> */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openModal}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 1000,
                }}
            >
                <Fade in={openModal}>
                    <Box sx={{
                            position: 'absolute',
                            top: '2%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '90%',
                            bgcolor: 'background.paper',
                            border: '4px solid rgb(215, 208, 197)',
                            borderRadius: '8px',
                            boxShadow: 24,
                            pb: 1,
                        }}
                        component={'form'}
                        onSubmit={onSaveReservation}
                    >
                        <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>予約登録</Typography>
                            </Toolbar>
                        </AppBar>

                        <Container maxWidth={'xl'} sx={{mt: 2}}>
                            <Stack direction="row" spacing={0}>
                                <Stack spacing={2} sx={{width: '50%', pl: 5, pr: 5}}>
                                    <TextField
                                        id="therapist"
                                        name="therapist"
                                        select
                                        fullWidth
                                        label='セラピスト'
                                        variant="standard"
                                        disabled
                                        value={val_therapist}
                                        onChange={e => setValTherapist(e.target.value)}
                                        helperText=""
                                    >
                                        <MenuItem value={-1}>
                                            なし
                                        </MenuItem>
                                        {therapist_shift.map((option, index) => (
                                            <MenuItem key={index} value={option.id}>
                                                {option.therapist_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        id="nomination"
                                        name="nomination"
                                        select
                                        fullWidth
                                        label='指名'
                                        variant="standard"
                                        value={val_nomination}
                                        onChange={e => {
                                            setValNomination(e.target.value);
                                            setValFee(getReservationFeeCardFee(e.target.value, val_menu, val_menuPayment, val_extend, val_extendPayment, val_option, val_optionPayment, val_discount)[0]);
                                        }}
                                        helperText=""
                                    >
                                        {accountAssigns.map((option, index) => (
                                            <MenuItem key={index} value={option.id}>
                                                {option.accountCourse_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                        <InputLabel htmlFor="discount">割引き</InputLabel>
                                        <Input
                                            id="discount"
                                            name='discount'
                                            type="number"
                                            endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                            inputProps={{
                                            'aria-label': '割引き',
                                            }}
                                            label='割引き'
                                            placeholder="割引き"
                                            value={val_discount}
                                            onChange={e => {
                                                setValDiscount(e.target.value);
                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, val_extendPayment, val_option, val_optionPayment, e.target.value)[0]);
                                            }}
                                        />
                                    </FormControl>

                                    <Stack direction={'row'}>
                                        <TextField
                                            id="menu"
                                            name="menu"
                                            select
                                            fullWidth
                                            label='メニュー'
                                            variant="standard"
                                            value={val_menu}
                                            onChange={e => {
                                                setValMenu(e.target.value);
                                                setValEndReservationTime(prev=>{
                                                    let find_course = accountCourses.find((menu_item)=>menu_item.id==e.target.value);
                                                    let find_extend = accountExtends.find((extend_item)=>extend_item.id==val_extend);
                                                    if(find_course != undefined) {
                                                        if(find_extend != undefined) {
                                                            return plusMinute(new Date(val_startReservationTime), Number(find_course.accountCourse_during) + Number(find_extend.extend_during));
                                                        } else {
                                                            return plusMinute(new Date(val_startReservationTime), Number(find_course.accountCourse_during));
                                                        }
                                                    } else {
                                                        if(find_extend != undefined) {
                                                            return plusMinute(new Date(val_startReservationTime), 90 + Number(find_extend.extend_during));
                                                        } else {
                                                            return plusMinute(new Date(val_startReservationTime), 90);
                                                        }
                                                    }
                                                });

                                                setValFee(getReservationFeeCardFee(val_nomination, e.target.value, val_menuPayment, val_extend, val_extendPayment, val_option, val_optionPayment, val_discount)[0]);
                                            }}
                                            helperText=""
                                        >
                                            <MenuItem value={-1}>
                                                なし
                                            </MenuItem>
                                            {accountCourses.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            id="menu_payment"
                                            name="menu_payment"
                                            select
                                            fullWidth
                                            label='支払方法'
                                            variant="standard"
                                            value={val_menuPayment}
                                            onChange={e => {
                                                setValMenuPayment(e.target.value);
                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, e.target.value, val_extend, val_extendPayment, val_option, val_optionPayment, val_discount)[0]);
                                                setValCardFee(getReservationFeeCardFee(val_nomination, val_menu, e.target.value, val_extend, val_extendPayment, val_option, val_optionPayment, val_discount)[1]);
                                            }}
                                            helperText=""
                                        >
                                            {accountPayments.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                    </Stack>

                                    <Stack direction={'row'}>
                                        <TextField
                                            id="extend"
                                            name="extend"
                                            select
                                            fullWidth
                                            label='延長'
                                            variant="standard"
                                            value={val_extend}
                                            onChange={e => {
                                                setValExtend(e.target.value);
                                                setValEndReservationTime(prev=>{
                                                    let find_extend = accountExtends.find((item)=>item.id==e.target.value);
                                                    let find_course = accountCourses.find((item)=>item.id==val_menu);
                                                    if(find_extend != undefined) {
                                                        if(find_course !=undefined) {
                                                            return plusMinute(new Date(val_startReservationTime), Number(find_extend.extend_during) + Number(find_course.accountCourse_during));
                                                        } else {
                                                            return plusMinute(new Date(val_startReservationTime), 90 + Number(find_extend.extend_during));
                                                        }
                                                    } else {
                                                        if(find_course !=undefined) {
                                                            return plusMinute(new Date(val_startReservationTime), Number(find_course.accountCourse_during));
                                                        } else {
                                                            return plusMinute(new Date(val_startReservationTime), 90);
                                                        }
                                                    }
                                                });

                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, e.target.value, val_extendPayment, val_option, val_optionPayment, val_discount)[0]);
                                            }}
                                            helperText=""
                                        >
                                            <MenuItem value={-1}>
                                                なし
                                            </MenuItem>
                                            {accountExtends.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            id="extend_payment"
                                            name="extend_payment"
                                            select
                                            fullWidth
                                            label='支払方法'
                                            variant="standard"
                                            value={val_extendPayment}
                                            onChange={e => {
                                                setValExtendPayment(e.target.value);
                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, e.target.value, val_option, val_optionPayment, val_discount)[0]);
                                                setValCardFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, e.target.value, val_option, val_optionPayment, val_discount)[1]);
                                            }}
                                            helperText=""
                                        >
                                            {accountPayments.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>

                                    <Stack direction={'row'}>
                                        <TextField
                                            id="input_option"
                                            name="input_option"
                                            select
                                            fullWidth
                                            label='オプション'
                                            variant="standard"
                                            value={val_option}
                                            onChange={e => {
                                                setValOption(e.target.value);
                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, val_extendPayment, e.target.value, val_optionPayment, val_discount)[0]);
                                            }}
                                            helperText=""
                                        >
                                            <MenuItem value={-1}>
                                                なし
                                            </MenuItem>
                                            {accountOptions.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        
                                        <TextField
                                            id="option_payment"
                                            name="option_payment"
                                            select
                                            fullWidth
                                            label='支払方法'
                                            variant="standard"
                                            value={val_optionPayment}
                                            onChange={e => {
                                                setValOptionPayment(e.target.value);
                                                setValFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, val_extendPayment, val_option, e.target.value, val_discount)[0]);
                                                setValCardFee(getReservationFeeCardFee(val_nomination, val_menu, val_menuPayment, val_extend, val_extendPayment, val_option, e.target.value, val_discount)[1]);
                                            }}
                                            helperText=""
                                        >
                                            {accountPayments.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.accountCourse_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>

                                    <TextField
                                        disabled
                                        id="card_fee"
                                        name="card_fee"
                                        fullWidth
                                        label="カード手数料"
                                        variant="standard"
                                        value={val_cardFee}
                                        onChange={e => setValCardFee(e.target.value)}
                                        helperText=""
                                    />

                                    <Grid container spacing={1} justifyContent={'center'}>
                                        <Grid item>
                                            <DateTimePicker
                                                inputFormat="YYYY年MM月DD日 HH時mm分"
                                                renderInput={(params) => <TextField variant="standard" {...params} />}
                                                label="開始予約時間"
                                                value={val_startReservationTime}
                                                onChange={(newValue) => {
                                                    setValStartReservationTime(newValue);
                                                }}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Typography sx={{ fontSize: '18px', mt: 2 }}>~</Typography>
                                        </Grid>

                                        <Grid item>
                                            <DateTimePicker
                                                inputFormat="YYYY年MM月DD日 HH時mm分"
                                                renderInput={(params) => <TextField variant="standard" {...params} />}
                                                label="終了予約時間"
                                                value={val_endReservationTime}
                                                onChange={(newValue) => {
                                                    setValEndReservationTime(newValue);
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>

                                <Stack spacing={2} sx={{width: '50%', pl: 5, pr: 5}}>
                                    <FormControl variant="standard" fullWidth sx={{ mt: 0 }}>
                                        <InputLabel htmlFor="fee">料金</InputLabel>
                                        <Input
                                            id="fee"
                                            name='fee'
                                            type="number"
                                            endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                            inputProps={{
                                            'aria-label': '料金',
                                            }}
                                            placeholder="料金"
                                            value={val_fee}
                                            onChange={e => setValFee(e.target.value)}
                                        />
                                    </FormControl>

                                    <Grid container spacing={2} style={{margin: 0, padding: 0}}>
                                        <Grid item style={{margin: 0, padding: 0, flexGrow: 1}}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="customer_name"
                                                name="customer_name"
                                                label="お客様の名前"
                                                placeholder="お客様の名前"
                                                variant="standard"
                                                multiline
                                                value={val_customerName}
                                                onChange={e => setValCustomerName(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Button 
                                                variant="outlined" 
                                                size="medium" 
                                                sx={{ mt: 1 }}
                                                onClick={handleOpenChildModal}
                                            >
                                                顧客検索
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} style={{margin: 0, padding: 0}}>
                                        <Grid item style={{margin: 0, padding: 0, flexGrow: 1}}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="customer_tel"
                                                name="customer_tel"
                                                label="お客様　TEL"
                                                placeholder="お客様　TEL"
                                                variant="standard"
                                                multiline
                                                value={val_customerTel}
                                                onChange={e => setValCustomerTel(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Button 
                                                variant="outlined" 
                                                size="medium" 
                                                sx={{ mt: 1 }}
                                                onClick={e=>{
                                                    handleOpenChildModal();
                                                }}
                                            >
                                                顧客検索
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    
                                    <TextField
                                        id="new_repeater"
                                        name="new_repeater"
                                        select
                                        fullWidth
                                        label='新規/リピーター'
                                        variant="standard"
                                        value={val_new_repeater}
                                        onChange={e => {
                                            setValNewRepeater(e.target.value);
                                        }}
                                        helperText=""
                                    >
                                        {['新規', 'リピーター'].map((option, index) => (
                                            <MenuItem key={index} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <FormControl variant="standard" fullWidth sx={{ mt: 0 }}>
                                        <InputLabel htmlFor="customer_req" sx={{ transform: 'translateY(1px)' }}>お客様 要望</InputLabel>
                                        <TextareaAutosize
                                            id="customer_req"
                                            name='customer_req'
                                            aria-label="minimum height"
                                            maxRows={2}
                                            placeholder="(お客様がご予約の際にご入力された情報)"
                                            style={{
                                                backgroundColor: "transparent",
                                                width: '100%',
                                                outline: 'none',
                                                marginTop: "30px",
                                                borderRadius: '5px',
                                                fontSize: '18px'
                                            }}
                                            value={getCustomerMemo(val_customerName)}
                                            onChange={e => setValCustomerRequest(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl variant="standard" fullWidth sx={{ mt: 0 }}>
                                        <InputLabel htmlFor="customer_req" sx={{ transform: 'translateY(1px)' }}>セラピスト要望</InputLabel>
                                        <TextareaAutosize
                                            id="treatment"
                                            name='treatment'
                                            aria-label="minimum height"
                                            maxRows={2}
                                            placeholder="(セラピスト要望)"
                                            style={{
                                                backgroundColor: "transparent",
                                                width: '100%',
                                                outline: 'none',
                                                marginTop: "30px",
                                                borderRadius: '5px',
                                                fontSize: '18px'
                                            }}
                                            disabled
                                            value={getTherapistMemo(val_therapist)}
                                            onChange={e => setValTreatment(e.target.value)}
                                        />
                                    </FormControl>

                                    <FormControl variant="standard" fullWidth sx={{ mt: 0 }}>
                                        <InputLabel htmlFor="contact_memo" sx={{ transform: 'translateY(1px)' }}>連絡用備考</InputLabel>
                                        <TextareaAutosize
                                            id="contact_memo"
                                            name='contact_memo'
                                            aria-label="minimum height"
                                            maxRows={2}
                                            placeholder="(連絡用備考)"
                                            style={{
                                                backgroundColor: "transparent",
                                                width: '100%',
                                                outline: 'none',
                                                marginTop: "30px",
                                                borderRadius: '5px',
                                                fontSize: '18px'
                                            }}
                                            value={val_contactMemo}
                                            onChange={e => setValContactMemo(e.target.value)}
                                        />
                                    </FormControl>
                                </Stack>
                            </Stack>

                            <Grid container justifyContent="flex-end">
                                {!flag_clickReserved &&
                                    <Grid item>
                                        <Button
                                            sx={{marginTop: '30px'}}
                                            size="medium"
                                            variant="outlined"
                                            color="success"
                                            type={"submit"}
                                        >
                                            この内容で保存する
                                        </Button>
                                    </Grid>
                                }

                                {flag_clickReserved &&
                                    <Grid item>
                                        <Stack direction="row" spacing={2} sx={{marginTop: '30px'}}>
                                            <Button
                                                variant="outlined" 
                                                color="success" 
                                                size="medium"
                                                onClick={onReservationEdit}
                                            >
                                                予約内容の変更を保存する
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="medium"
                                                onClick={onReservationDelete}
                                            >
                                                予約をキャンセル
                                            </Button>
                                        </Stack>
                                    </Grid>
                                }

                            </Grid>
                        </Container>

                        <Modal
                            hideBackdrop
                            open={openChildModal}
                            onClose={handleCloseChildModal}
                            aria-labelledby="child-modal-title"
                            aria-describedby="child-modal-description"
                        >
                            <Box sx={{  
                                        position: 'absolute',
                                        top: '100px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '70%',
                                        height: '620px',
                                        bgcolor: 'background.paper',
                                        border: '4px solid rgb(215, 208, 197)',
                                        borderRadius: '8px',
                                        boxShadow: 24,
                                        pb: 1,
                                        overflow: "auto",
                                    }}
                            >
                                <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                                    <Toolbar>
                                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>顧客マスター</Typography>
                                        <Button onClick={handleCloseChildModal}><CancelPresentationRoundedIcon style={{ color: 'white', fontSize: '48px' }} /></Button>
                                    </Toolbar>
                                    
                                </AppBar>

                                <Container maxWidth={'md'} style={{marginTop: '20px'}}>
                                    <FilterSortClickTable data={customers} doubleClick={doubleClickhandler} title='顧客検索' />
                                </Container>
                            </Box>
                        </Modal>
                    </Box>
                </Fade>
            </Modal>
        </MainLayout>
    )
}

export default ReserveMgr
