import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, 
    Grid, 
    Container,
    Stack,
    Typography,
    TextField
} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import SalesMgrLayout from "./SalesMgrLayout";
import CustomizeTable from "../../../TableComponent/CustomizeTable";
import { setTherapistReservationsAction } from '../../../../store/actions/therapistAction';
import moment from "moment";
import { getDatesInMonth, plusDate, setClickDate, setMonthWithNumber } from '../../../../service/common';
import { setTherapistShiftAction } from '../../../../store/actions/therapistAction';
import { DateTimePicker, DatePicker } from "@mui/x-date-pickers";

function createSalesDataByDay(salesDate, totalSales, totalCustomerNumber, feePerCustomer, totalNominationFee, nominationNumber, tableName) {
    return {
        salesDate, 
        totalSales, 
        totalCustomerNumber, 
        feePerCustomer, 
        totalNominationFee, 
        nominationNumber, 
        tableName
    };
}

var rows = [];

function SalesMgrByTherapist() {
    const dispatch = useDispatch();
    const { therapist_shift } = useSelector(({therapistStore})=>therapistStore);

    const [salesDataByDayRows, setSalesDataByDayRows] = useState([]);

    const [val_startTime, setValStartTime] = useState(new Date());
    const [val_endTime, setValEndTime] = useState(new Date());

    useEffect(()=>{
        getTherapists();
        getReservations();
    }, [val_startTime, val_endTime]);

    const getReservations = () => {
        axios
            .get('/api/getReservationsWithNomination')
            .then(res=>{
                setSalesDataByDayRows(res.data);
            });
    }

    const getTherapists = () => {
        axios
        .get('/api/getshifttherapists')
        .then((res)=>{
            dispatch(setTherapistShiftAction(res.data));
        });
    }
    
    rows = therapist_shift.map(therapist_item=>{
        let total_sales = 0;
        let total_customerNumber = 0;
        let nomination_sales = 0;
        let nomination_customerNumber = 0;
        let fee_perCustomer=0;
        salesDataByDayRows.forEach((item, index)=>{
            if(therapist_item.id == item.therapist_id) {
                let start = moment(new Date(val_startTime)).format("YYYY-MM-DD") + 'T10:00';
                let end = moment(new Date(val_endTime)).format("YYYY-MM-DD") + 'T06:00';
                let reserve_start = moment(new Date(item.reservation_from)).format("YYYY-MM-DDTHH:mm");
                let reserve_end = moment(new Date(item.reservation_to)).format("YYYY-MM-DDTHH:mm");
                if(
                    reserve_start >= start
                    && reserve_end <= end
                ) {
                    total_sales += Number(item.fee);
                    total_customerNumber++;
                    if(item.accountCourse_name != 'フリー') {
                        nomination_sales += Number(item.accountCourse_from);
                        nomination_customerNumber++;
                    }
                }
            }
        });
        fee_perCustomer = total_customerNumber != 0 ? Math.floor(total_sales/total_customerNumber) : 0;

        return createSalesDataByDay(therapist_item.therapist_name, total_sales, total_customerNumber, fee_perCustomer, nomination_sales, nomination_customerNumber, 'SalesMgrByDayTable');
    });

    return (
        <MainLayout title={"LynxGroup"} partTitle={''} isShowPartTitle={false}>
            <SalesMgrLayout title={'セラピスト別【売上集計】'}>
                <Container>
                    <Grid container justifyContent={'flex-end'}>
                        <Grid item>
                            <Stack
                                direction={"row"}
                                spacing={2}
                                justifyContent={"space-around"}
                            >
                                <DatePicker
                                    inputFormat="YYYY年MM月DD日"
                                    renderInput={(params) => (
                                        <TextField variant="standard" {...params} />
                                    )}
                                    label="開始時間"
                                    value={val_startTime}
                                    onChange={(newValue) => {
                                        setValStartTime(newValue);
                                    }}
                                />
                                <Typography sx={{ fontSize: "18px", mt: 0 }}>
                                    ~
                                </Typography>
                                <DatePicker
                                    inputFormat="YYYY年MM月DD日"
                                    renderInput={(params) => (
                                        <TextField variant="standard" {...params} />
                                    )}
                                    label="終了時間"
                                    value={val_endTime}
                                    onChange={(newValue) => {
                                        setValEndTime(newValue);
                                    }}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{pt: 5, pb: 5}}>
                        <CustomizeTable 
                            rows={rows}
                            headCells={[
                                {label: ''}, 
                                {label: '総売上'}, 
                                {label: '総客数'}, 
                                {label: '客単価'}, 
                                {label: '指名売上'}, 
                                {label: '指名数'}, 
                            ]}
                        />
                    </Box>
                </Container>
            </SalesMgrLayout>
        </MainLayout>
    )
}

export default SalesMgrByTherapist
