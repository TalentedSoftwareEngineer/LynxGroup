import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
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
    Select
} from "@mui/material";
import { visuallyHidden } from '@mui/utils';

import {setReservationFullDataAction} from "../../../store/actions/therapistAction";
import { customerRegistAction, setCustomerMgrDataAction } from '../../../store/actions/customerAction';

import MainLayout from "../../MainLayout/MainLayout";
import moment from "moment";

function createCustomerData(reserve_id, usage_date, customer_name, therapist_name, ok_ng, customer_tel, memo) {
    return {
      reserve_id, usage_date, customer_name, therapist_name, ok_ng, customer_tel, memo
    };
  }
  
  var rows = [];
  
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
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
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
  
  const headCells = [
    {
      id: 'usage_date',
      numeric: false,
      disablePadding: true,
      label: 'ご利用日',
    },
    {
      id: 'customer_name',
      numeric: false,
      disablePadding: false,
      label: '名前',
    },
    {
      id: 'therapist_name',
      numeric: false,
      disablePadding: false,
      label: 'セラピスト名',
    },
    {
      id: 'ok_ng',
      numeric: false,
      disablePadding: false,
      label: '(OK・NG)',
    },
    {
      id: 'customer_tel',
      numeric: false,
      disablePadding: false,
      label: '電話番号',
    },
  ];
  
  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
                <TableCell
                    key={headCell.id}
                    align='center'
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
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
    );
  }

function CustomerMgr() {
    const dispatch = useDispatch();
    const {reservationFullDatas} = useSelector(({ therapistStore }) => therapistStore);
    const { customers, customerMgrData } = useSelector(({customerStore})=>customerStore);

    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('usage_date');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
  
    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
  
    const handleRowClick = (event, name) => {
        
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(()=>{
      getCustomers();
      getReservationFullData();
      getCustomerMgrData();
    }, []);

    const getCustomers = () => {
        axios
        .get('/api/getcustomers')
        .then((res)=>{
            dispatch(customerRegistAction(res.data));
        });
    }

    const getReservationFullData = () => {
        axios
        .get('/api/getReservationFullData')
        .then((res)=>{
            dispatch(setReservationFullDataAction(res.data));
        });
    }

    const getCustomerMgrData = () => {
        axios
        .get('/api/getCustomerMgrData')
        .then((res)=>{
            dispatch(setCustomerMgrDataAction(res.data));
        });
    }

    const onChangeOkNg = (event, i_reserve_id, i_usage_date, i_customer_name, i_therapist_name) => {
        axios.post("/api/handleCustomerMgrData", {
          reserve_id: i_reserve_id,
          usage_date: i_usage_date,
          customer_name: i_customer_name,
          therapist_name: i_therapist_name,
          ok_ng: event.target.value,
          memo: '',
        }).then((res) => {
            getCustomerMgrData();
        });
    }

    const [ searchKey, setSearchKey ] = useState('');

    if(searchKey != '') {
        let filterRows = reservationFullDatas.filter((item) => (
          item.customer_name.includes(searchKey) 
          || item.customer_tel.includes(searchKey)
          || moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm').includes(searchKey)
          || item.therapist_name.includes(searchKey)
        ));
        
        rows = filterRows.map((item)=>(
          createCustomerData(
            item.id,
            moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm'),
            item.customer_name,
            item.therapist_name,
            customerMgrData.length==0 ? 'OK' :
            customerMgrData.find((customerData_item)=>(
              Number(customerData_item.reserve_id)==item.id 
              && customerData_item.usage_date==moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm') 
              && customerData_item.customer_name==item.customer_name 
              && customerData_item.therapist_name==item.therapist_name
            )) == undefined ? 'OK' : 
            customerMgrData.find((customerData_item)=>(
              Number(customerData_item.reserve_id)==item.id 
              && customerData_item.usage_date==moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm') 
              && customerData_item.customer_name==item.customer_name 
              && customerData_item.therapist_name==item.therapist_name
            )).ok_ng,
            item.customer_tel,
            item.treatment_memo
          )
        ));
    } else {
      rows = reservationFullDatas.map((item)=>(
        createCustomerData(
          item.id,
          moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm'),
          item.customer_name,
          item.therapist_name,
          customerMgrData.length==0 ? 'OK' :
          customerMgrData.find((customerData_item)=>(
            Number(customerData_item.reserve_id)==item.id 
            && customerData_item.usage_date==moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm') 
            && customerData_item.customer_name==item.customer_name 
            && customerData_item.therapist_name==item.therapist_name
          )) == undefined ? 'OK' : 
          customerMgrData.find((customerData_item)=>(
            Number(customerData_item.reserve_id)==item.id 
            && customerData_item.usage_date==moment(new Date(item.reservation_from)).format('YYYY年MM月DD日 HH:mm') 
            && customerData_item.customer_name==item.customer_name 
            && customerData_item.therapist_name==item.therapist_name
          )).ok_ng,
          item.customer_tel,
          item.treatment_memo
        )
      ));
    }


    return (
        <MainLayout title={"LynxGroup"}>
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
                    顧客管理
                </Typography>
            </Container>

            <Container maxWidth={'xl'}>
                <Box sx={{ width: '100%', mt: 5 }}>
                    <Grid container justifyContent={'flex-end'}>
                        <Grid item>
                            <TextField
                                margin="normal"
                                id="search_key"
                                name="search_key"
                                label="検索"
                                placeholder="検索"
                                variant="standard"
                                // sx={{}}
                                value={searchKey}
                                onChange={e => setSearchKey(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
                        <TableContainer>
                            <Table
                                sx={{ width: '100%' }}
                                aria-labelledby="tableTitle"
                                size="medium"
                            >
                                <EnhancedTableHead
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleRowClick(event, '')}
                                                tabIndex={-1}
                                                key={index}
                                            >
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.usage_date}
                                                </TableCell>
                                                <TableCell align="center">{row.customer_name}</TableCell>
                                                <TableCell align="center">{row.therapist_name}</TableCell>
                                                <TableCell align="center">
                                                  <Select
                                                      variant="standard"
                                                      value={row.ok_ng}
                                                      onChange={(event) => onChangeOkNg(event, row.reserve_id, row.usage_date, row.customer_name, row.therapist_name)}
                                                      input={<Input name={"ok_ng_select" + '-' + row.reserve_id} id={"ok_ng_select" + '-' + row.reserve_id} />}
                                                      autoWidth
                                                  >
                                                      {['OK', 'NG'].map((option, index) => (
                                                          <MenuItem key={index} value={option}>
                                                              {option}
                                                          </MenuItem>
                                                      ))}
                                                  </Select>
                                                </TableCell>
                                                <TableCell align="center">{row.customer_tel}</TableCell>
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
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[50, 100, 125]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage='ページごとの行数'
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>

            </Container>
        </MainLayout>
    )
}

export default CustomerMgr
