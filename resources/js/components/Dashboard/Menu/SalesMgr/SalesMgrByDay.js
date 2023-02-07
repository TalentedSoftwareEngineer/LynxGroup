import React, {useState, useEffect} from "react";
import {
    Box, 
    Grid, 
    Container, 
    Input, 
    InputAdornment, 
    FormControl,
} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import SalesMgrLayout from "./SalesMgrLayout";
import CustomizeTable from "../../../TableComponent/CustomizeTable";
import moment from "moment";
import { getDatesInMonth, setClickDate, setOnlyMonth } from '../../../../service/common';

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

function SalesMgrByDay() {

    const [displayDate, setDisplayDate ] = useState(new Date());
    const [salesDataByDayRows, setSalesDataByDayRows] = useState([]);

    const [val_month, setValMonth] = useState(new Date().getMonth()+1);

    var dates = getDatesInMonth(displayDate);

    useEffect(()=>{
        getReservations();
    }, [displayDate]);

    const getReservations = () => {
        axios
            .get('/api/getReservationsWithNomination')
            .then(res=>{
                setSalesDataByDayRows(res.data);
            });
    }

    rows = dates.map((date_item)=>{
        let total_sales = 0;
        let total_customerNumber = 0;
        let nomination_sales = 0;
        let nomination_customerNumber = 0;
        let fee_perCustomer=0;
        salesDataByDayRows.forEach((item, index)=>{
            if(
                moment(new Date(item.reservation_from)).format("YYYY-MM-DDTHH:mm") >= moment(setClickDate(displayDate, date_item)).format("YYYY-MM-DD") + 'T10:00'
                && moment(new Date(item.reservation_to)).format("YYYY-MM-DDTHH:mm") <= moment(setClickDate(displayDate, date_item+1)).format("YYYY-MM-DD") + 'T06:00'
            ) {
                total_sales += Number(item.fee);
                total_customerNumber++;
                if(item.accountCourse_name != 'フリー') {
                    nomination_sales += Number(item.accountCourse_from);
                    nomination_customerNumber++;
                }
            }
        });
        fee_perCustomer = total_customerNumber != 0 ? Math.floor(total_sales/total_customerNumber) : 0;

        return createSalesDataByDay(moment(setClickDate(displayDate, date_item)).format('M月D日'), total_sales, total_customerNumber, fee_perCustomer, nomination_sales, nomination_customerNumber, 'SalesMgrByDayTable');
    });

    const onChangeMonth = event => {
        if(event.target.value>0 && event.target.value<13 || event.target.value=='') {
            setValMonth(event.target.value);
            if(event.target.value != '') {
                setDisplayDate(prev=>setOnlyMonth(prev, event.target.value));
            }
        }
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={''} isShowPartTitle={false}>
            <SalesMgrLayout title={'日別【売上集計】'}>
                <Container>
                    <Grid container justifyContent={'flex-end'}>
                        <Grid item>
                            <FormControl variant="standard" sx={{ mt: 2 }}>
                                <Input
                                    id="input_month"
                                    name='input_month'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">月</InputAdornment>}
                                    placeholder=""
                                    value={val_month}
                                    onChange={onChangeMonth}
                                />
                            </FormControl>
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

export default SalesMgrByDay
