import React, {useState, useEffect} from "react";
import {
    Box, 
    Grid, 
    Typography, 
    Container,
    FormControl,
    Input,
    InputAdornment
} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import SalesMgrLayout from "./SalesMgrLayout";
import CustomizeTable from "../../../TableComponent/CustomizeTable";
import moment from "moment";
import { setOnlyYear, setMonthWithNumber } from '../../../../service/common';
import { useHistory } from "react-router-dom";

var rows = [];

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

function SalesMgrByMonth() {

    const [displayDate, setDisplayDate ] = useState(new Date());
    const [salesDataByMonth, setSalesDataByMonth] = useState([]);

    const [val_year, setValYear] = useState(new Date().getFullYear());

    useEffect(()=>{
        getReservations();
    }, [displayDate]);

    const getReservations = () => {
        axios
            .get('/api/getReservationsWithNomination')
            .then(res=>{
                setSalesDataByMonth(res.data);
            });
    }

    rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month_item)=>{
        let total_sales = 0;
        let total_customerNumber = 0;
        let nomination_sales = 0;
        let nomination_customerNumber = 0;
        let fee_perCustomer=0;
        salesDataByMonth.forEach((item, index)=>{
            if(
                moment(new Date(item.reservation_from)).format('YYYY-MM') == moment(setMonthWithNumber(displayDate, month_item)).format('YYYY-MM') 
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

        return createSalesDataByDay(moment(setMonthWithNumber(displayDate, month_item)).format('YYYY年M月'), total_sales, total_customerNumber, fee_perCustomer, nomination_sales, nomination_customerNumber, 'SalesMgrByDayTable');
    });

    const onChangeYear = (event) => {
        if(event.target.value>1969 && event.target.value<5001 || event.target.value=='') {
            setValYear(event.target.value);
            if(event.target.value != '') {
                setDisplayDate(prev=>setOnlyYear(prev, event.target.value));
            }
        }
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={''} isShowPartTitle={false}>
            <SalesMgrLayout title={'月別【売上集計】'}>
                <Container>
                    <Grid container justifyContent={'flex-end'}>
                        <Grid item>
                            <FormControl variant="standard" sx={{ mt: 2 }}>
                                <Input
                                    id="input_year"
                                    name='input_year'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">年</InputAdornment>}
                                    placeholder=""
                                    value={val_year}
                                    onChange={onChangeYear}
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

export default SalesMgrByMonth
