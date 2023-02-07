import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import {Box, Grid, Typography, Container} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import SalesMgrLayout from "./SalesMgrLayout";
import CustomizeTable from "../../../TableComponent/CustomizeTable";
import { setTherapistReservationsAction } from '../../../../store/actions/therapistAction';
import moment from "moment";
import { plusDate } from '../../../../service/common';

function createTodaySalesData(totalSales, totalCustomerNumber, tableName) {
    return {
        totalSales,
        totalCustomerNumber,
        tableName,
    };
}

function createWeekSalesData(
    totalSales_0,
    totalCustomerNumber_0,
    totalSales_1,
    totalCustomerNumber_1,
    totalSales_2,
    totalCustomerNumber_2,
    totalSales_3,
    totalCustomerNumber_3,
    totalSales_4,
    totalCustomerNumber_4,
    totalSales_5,
    totalCustomerNumber_5,
    totalSales_6,
    totalCustomerNumber_6,
    tableName,
) {
    return {
        totalSales_0,
        totalCustomerNumber_0,
        totalSales_1,
        totalCustomerNumber_1,
        totalSales_2,
        totalCustomerNumber_2,
        totalSales_3,
        totalCustomerNumber_3,
        totalSales_4,
        totalCustomerNumber_4,
        totalSales_5,
        totalCustomerNumber_5,
        totalSales_6,
        totalCustomerNumber_6,
        tableName,
    }
}

var todaySalesRows = [];
var weekSalesRows = [];

function SalesMgr() {
    const dispatch = useDispatch();
    const { therapist_reservations } = useSelector(({therapistStore})=>therapistStore);

    const [displayDate, setDisplayDate ] = useState(new Date());
    const [totalSales, setTotalSales] = useState(0);
    const [totalCustomerNumber, setTotalCustomerNumber] = useState(0);

    const [ weekSalesData_0, setWeekSalesData_0 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_1, setWeekSalesData_1 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_2, setWeekSalesData_2 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_3, setWeekSalesData_3 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_4, setWeekSalesData_4 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_5, setWeekSalesData_5 ] = useState({ sales: 0, customerNumber: 0 });
    const [ weekSalesData_6, setWeekSalesData_6 ] = useState({ sales: 0, customerNumber: 0 });

    useEffect(()=>{
        getReservations();
    }, []);

    const getReservations = () => {
        axios
            .get('/api/getReservations')
            .then(res=>{
                dispatch(setTherapistReservationsAction(res.data));
                res.data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(new Date(displayDate)).format('YYYY-MM-DD') ) {
                        setTotalSales(prev=>{
                            prev += Number(item.fee);
                            return prev;
                        });
                        setTotalCustomerNumber(prev=>{
                            prev++;
                            return prev;
                        });
                    }
                });

                setWeeklyData(res.data, 0);
                setWeeklyData(res.data, 1);
                setWeeklyData(res.data, 2);
                setWeeklyData(res.data, 3);
                setWeeklyData(res.data, 4);
                setWeeklyData(res.data, 5);
                setWeeklyData(res.data, 6);
            });
    }

    const setWeeklyData = (backend_data, i_plus_date) => {
        switch(i_plus_date)
        {
            case 0:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_0(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 1:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_1(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 2:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_2(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 3:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_3(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 4:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_4(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 5:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_5(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
            case 6:
                backend_data.forEach((item, index)=>{
                    if(moment(new Date(item.reservation_from)).format('YYYY-MM-DD') == moment(plusDate(displayDate, i_plus_date)).format('YYYY-MM-DD') ) {
                        setWeekSalesData_6(prev=>({
                            ...prev,
                            sales: prev.sales + Number(item.fee),
                            customerNumber: prev.customerNumber + 1,
                        }));
                    }
                });
                break;
        }
    }

    todaySalesRows = [ createTodaySalesData(totalSales, totalCustomerNumber, 'todaySalesTable') ];
    weekSalesRows = [ createWeekSalesData(
        weekSalesData_0.sales, 
        weekSalesData_0.customerNumber,
        weekSalesData_1.sales, 
        weekSalesData_1.customerNumber,
        weekSalesData_2.sales, 
        weekSalesData_2.customerNumber,
        weekSalesData_3.sales, 
        weekSalesData_3.customerNumber,
        weekSalesData_4.sales, 
        weekSalesData_4.customerNumber,
        weekSalesData_5.sales, 
        weekSalesData_5.customerNumber,
        weekSalesData_6.sales, 
        weekSalesData_6.customerNumber,
        'weekSalesTable'
    ) ];

    return (
        <MainLayout title={"LynxGroup"} partTitle={''} isShowPartTitle={false}>
            <SalesMgrLayout title={'売上集計'}>
                <Container maxWidth={'md'}>
                    <Box>
                        <Typography
                            component={'h2'}
                            sx={{
                                fontSize: '20px',
                                letterSpacing: '3px',
                                color: '#fff',
                                textShadow: '4px 5px 6px #000',
                                mb: 5,
                            }}
                        >
                            【本日の売上】
                        </Typography>
                        
                        <CustomizeTable rows={todaySalesRows} headCells={[{label: '総売上'}, {label: '総客数'}]} />
                    </Box>
                    <Box sx={{ mt: 5 }}>
                        <Typography
                            component={'h2'}
                            sx={{
                                fontSize: '20px',
                                letterSpacing: '3px',
                                color: '#fff',
                                textShadow: '4px 5px 6px #000',
                                mb: 5,
                            }}
                        >
                            【週間売上】
                        </Typography>
                        
                        <CustomizeTable 
                            rows={weekSalesRows} 
                            headCells={
                                [
                                    {label: moment(plusDate(displayDate, 0)).format('M月D日')}, 
                                    {label: moment(plusDate(displayDate, 1)).format('M月D日')},
                                    {label: moment(plusDate(displayDate, 2)).format('M月D日')},
                                    {label: moment(plusDate(displayDate, 3)).format('M月D日')},
                                    {label: moment(plusDate(displayDate, 4)).format('M月D日')},
                                    {label: moment(plusDate(displayDate, 5)).format('M月D日')},
                                    {label: moment(plusDate(displayDate, 6)).format('M月D日')}
                                ]
                            } 
                         />
                    </Box>
                </Container>
            </SalesMgrLayout>
        </MainLayout>
    )
}

export default SalesMgr
