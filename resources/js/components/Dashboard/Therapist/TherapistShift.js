import React, { useCallback, useEffect, useState } from "react";
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
    Input,
    MenuItem,
    Modal,
    Fade,
    Backdrop,
    AppBar,
    Toolbar,
    ButtonGroup,
    Stack,
    Box
} from "@mui/material";
import moment from "moment";
import MainLayout from "../../MainLayout/MainLayout";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import $ from 'jquery';
import { setTherapistShiftAction, setConfirmedShiftsAction } from '../../../store/actions/therapistAction';
import { setTherapistShiftStoresAction } from '../../../store/actions/storeAction';
import { getWeekDate, plusDate, getStartEnd } from '../../../service/common';
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';
import TherapistShiftTable from "../../TableComponent/TherapistShiftTable";
import './therapist.css';
import TimePicker from 'rc-time-picker';

function createData(
    therapist_id,
    therapist_name,
) {
    return {
        therapist_id,
        therapist_name,
    };
}

function createStoreData(value, label)
{
    return {
        value,
        label
    }
}

var rows = [];
var jQuery_therapist_shift = [];
var jQuery_displayDate = new Date();

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

function TherapistShift() {
    const dispatch = useDispatch();
    const { therapist_shift, confirmedShifts } = useSelector(({therapistStore})=>therapistStore);
    const { therapistShiftStores } = useSelector(({storeStore})=>storeStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);  

    const [doubleClickedShiftId, setDoubleClickedShiftId] = useState(-1);

    const [editTherapistName, setEditTherapistName] = useState('');
    const [editStore, setEditStore] = useState('');
    const [editFromTime, setEditFromTime] = useState('----------T--:-- --');
    const [editToTime, setEditToTime] = useState('----------T--:-- --');

    const [displayDate, setDisplayDate] = useState(new Date());
    
    useEffect(()=>{
        getTherapists();
        getConfirmedShifts();
        getStores();

        setTimeout(()=>{
            jQueryCode();
        }, 2000);
    }, []);

    const jQueryCode = () => {
        $('.btnConfirmShift').each((index, item)=>{
            $(item).click((event)=>{

                let isSuccess = false;

                if(confirm('セラピストのシフトを確定してもよろしいですか？') == true) {
                    for(let i=0;i<7;i++)
                    {
                        if($('#shiftFromTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val() != '' && $('#shiftToTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val() != '' && $('#shiftStore' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).text() != '-') 
                        {
                            const Info = {
                                therapist_id: event.currentTarget.id.split('_')[1],
                                therapist_name: jQuery_therapist_shift.find((item)=> item.id == event.currentTarget.id.split('_')[1]).therapist_name,
                                shift_fromTime: getStartEnd(plusDate(jQuery_displayDate, i), $('#shiftFromTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val(), $('#shiftToTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val())[0],
                                shift_toTime: getStartEnd(plusDate(jQuery_displayDate, i), $('#shiftFromTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val(), $('#shiftToTime' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).val())[1],
                                shift_status: '',
                                shift_store: $('#shiftStore' + '_' + event.currentTarget.id.split('_')[1] + '_' + i).text(),
                            }

                            axios
                            .post('/api/registTherapistShift', Info)
                            .then((res)=>{
                                isSuccess = true;
                            });
                        }
                    }
                } else {
                    isSuccess = false;
                }

                    setTimeout(()=>{
                        if(isSuccess) {
                            toast.success('セラピストのシフトが確定しました。', {
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
                            setTimeout(()=>{window.location.reload();}, 2000);
                            // getConfirmedShifts();
                        } else {
                            toast.error('セラピストのシフトは確定していません。');
                        }
                    }, 2000);

            });
        });
    }

    const getTherapists = () => {
        axios
        .get('/api/getshifttherapists')
        .then((res)=>{
            dispatch(setTherapistShiftAction(res.data));
            jQuery_therapist_shift = res.data;
        });
    }

    const getConfirmedShifts = () => {
        axios
        .get('/api/getConfirmedShifts')
        .then((res)=>{
            dispatch(setConfirmedShiftsAction(res.data));
        });
    }

    const getStores = () => {
        axios
        .get('/api/getstores')
        .then((res)=>{
            dispatch(setTherapistShiftStoresAction(res.data));
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


    const doubleRowClickhandler = ( shift_id, shift_therapist_name, shift_store, shift_fromTime, shift_toTime ) => {
        setDoubleClickedShiftId(shift_id);
        setEditTherapistName(shift_therapist_name);
        setEditStore(shift_store);
        setEditFromTime(shift_fromTime);
        setEditToTime(shift_toTime);
        handleOpen();
    }

    const onEditShift = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let Info = {
            shift_id: doubleClickedShiftId,
            therapist_id: therapist_shift.find((item) => item.therapist_name == formData.get('edit_therapist_name')).id,
            therapist_name: formData.get('edit_therapist_name'),
            shift_fromTime: formData.get('edit_from_time'),
            shift_toTime: formData.get('edit_to_time'),
            shift_status: '',
            shift_store: formData.get('edit_store'),
        };

        if(moment(Info.shift_fromTime).isAfter(Info.shift_toTime)) {
            toast.error('開始時間と終了時間が無効です。');
            return;
        }

        if(confirm('確定したシフトを本当に変更しますか？') == true) {
            axios
                .post('/api/editConfirmedShift', Info)
                .then(res=>{
                    toast.success('シフトが変更されました。', {
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
                    getConfirmedShifts();
                    handleClose();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('シフト変更が失敗しました。');
                    }
                });
        } else {
            toast.error('シフト変更がキャンセルされました。');
        }
    }

    const onConfirmedShiftDelete = (event) => {
        if(confirm('確定したシフトを本当に削除しますか？') == true) {
            axios
                .post('/api/deleteConfirmedShift', {shift_id: doubleClickedShiftId})
                .then(res=>{
                    toast.success('シフトが削除されました。', {
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
                    getConfirmedShifts();
                    handleClose();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('シフト削除が失敗しました。');
                    }
                });
        }
    }

    const weekday = ["(日)","(月)","(火)","(水)","(木)","(金)","(土)"];
    
    const headCells = [
        {
            id: 'therapist_name',
            numeric: false,
            disablePadding: false,
            label: '名前',
        },
        {
          id: 'mon',
          numeric: false,
          disablePadding: false,
          label: moment(plusDate(displayDate, 0)).format('MM月DD日') + weekday[plusDate(displayDate, 0).getDay()],
        //   label:''
        },
        {
          id: 'tue',
          numeric: false,
          disablePadding: false,
          label: moment(plusDate(displayDate, 1)).format('MM月DD日') + weekday[plusDate(displayDate, 1).getDay()],
        //   label:''
        },
        {
          id: 'wed',
          numeric: false,
          disablePadding: false,
          label: moment(plusDate(displayDate, 2)).format('MM月DD日') + weekday[plusDate(displayDate, 2).getDay()],
        //   label:''
        },
        {
            id: 'thu',
            numeric: false,
            disablePadding: false,
            label: moment(plusDate(displayDate, 3)).format('MM月DD日') + weekday[plusDate(displayDate, 3).getDay()],
            // label:''
        },
        {
            id: 'fri',
            numeric: false,
            disablePadding: false,
            label: moment(plusDate(displayDate, 4)).format('MM月DD日') + weekday[plusDate(displayDate, 4).getDay()],
            // label:''
        },
        {
            id: 'sat',
            numeric: false,
            disablePadding: false,
            label: moment(plusDate(displayDate, 5)).format('MM月DD日') + weekday[plusDate(displayDate, 5).getDay()],
            // label:''
        },
        {
            id: 'sun',
            numeric: false,
            disablePadding: false,
            label: moment(plusDate(displayDate, 6)).format('MM月DD日') + weekday[plusDate(displayDate, 6).getDay()],
            // label:''
        },
        {
            id: 'control',
            numeric: false,
            disablePadding: false,
            label: '操作',
        },
    ];

    const [ searchKey, setSearchKey ] = useState('');

    if(searchKey != '') {
        let filterRows = therapist_shift.filter((item) => item.therapist_name.includes(searchKey));
        rows = filterRows.map((item, index)=>{
            return createData(
                item.id, 
                item.therapist_name
            );
        });
    } else {
        rows = therapist_shift.map((item, index)=>{
            return createData(
                item.id, 
                item.therapist_name
            );
        });
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'セラピストのシフト設定'} isShowPartTitle={true}>
            <Container maxWidth={'md'} sx={{mt: 2}}>
                <a href="#partconfirmedShifts">確定したシフト</a>
            </Container>

            <Container maxWidth={'md'} sx={{mt: 10}}>
                <Grid container justifyContent={'center'}>
                    <Grid item sx={{ml: 2, mr: 2}}>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={e=>{
                                setDisplayDate(prev=>{
                                    jQuery_displayDate = plusDate(prev, -7);
                                    return plusDate(prev, -7);
                                });
                            }}
                        >
                            前週
                        </Button>
                    </Grid>
                    <Grid item sx={{
                        ml: 2,
                        mr: 2                        
                    }}>
                            <DatePicker
                                inputFormat="YYYY年MM月DD日"
                                value={displayDate}
                                onChange={(newValue) => {
                                    setDisplayDate(newValue);
                                    jQuery_displayDate = new Date(newValue);
                                }}
                                renderInput={(params) => <TextField style={{textAlign: 'center', fontSize: '24px'}} variant="standard" {...params} />}
                                style={{textAlign: 'center', fontSize: '24px'}}
                            />
                    </Grid>
                    <Grid item sx={{ml: 2, mr: 2}}>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={e=>{
                                setDisplayDate(prev=>{
                                    jQuery_displayDate = plusDate(prev, -7);
                                    return plusDate(prev, 7);
                                });
                            }}
                        >
                            翌週
                        </Button>
                    </Grid>
                </Grid>
            </Container>

            <Container maxWidth={'xl'}>
                <Box sx={{mt: 2, pr: 2, pl: 2}}>
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

                    <Paper className="TherapistShiftTable" sx={{ width: "100%", mb: 2, mt:2 }}>
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

                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={row.therapist_id}
                                            >
                                                <TableCell align="center">
                                                    {row.therapist_name}
                                                </TableCell>

                                                {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                                                    <TableCell key={item}>
                                                        <Stack spacing={0}>
                                                            <TimePicker
                                                                format='HH:mm'
                                                                placeholder='00:00'
                                                                showSecond={false}
                                                                minuteStep={10}
                                                                defaultValue={moment().hour(0).minute(0)}
                                                                id={"shiftFromTime" + "_" + row.therapist_id + "_" + item}
                                                                name={"shiftFromTime" + "_" + row.therapist_id + "_" + item}
                                                             />
                                                            <TimePicker
                                                                format='HH:mm'
                                                                placeholder='00:00'
                                                                showSecond={false}
                                                                minuteStep={10}
                                                                defaultValue={moment().hour(0).minute(0)}
                                                                id={"shiftToTime" + "_" + row.therapist_id + "_" + item}
                                                                name={"shiftToTime" + "_" + row.therapist_id + "_" + item}
                                                             />
                                                            <TextField
                                                                id={"shiftStore" + "_" + row.therapist_id + "_" + item}
                                                                name={"shiftStore" + "_" + row.therapist_id + "_" + item}
                                                                select
                                                                fullWidth
                                                                variant="standard"
                                                                defaultValue={'-'}
                                                            >
                                                                {therapistShiftStores.map((option, index) => (
                                                                    <MenuItem key={index} value={option.store_name}>
                                                                        {option.store_name}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </Stack>
                                                    </TableCell>
                                                ))}

                                                <TableCell>
                                                    <Grid container spacing={1} justifyContent={'center'}>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnConfirmShift" + "_" + row.therapist_id}
                                                                className='btnConfirmShift'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                シフト確定
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
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
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>

                <Box id='partconfirmedShifts' sx={{pr: 2, pl: 2, mt: 8}}>
                    <Paper sx={{ mb: '80px'}}>
                        <TherapistShiftTable  data={confirmedShifts} doubleClick={doubleRowClickhandler} title='確定したシフト' />
                    </Paper>
                </Box>
            </Container>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={{
                        position: 'absolute',
                        top: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50%',
                        bgcolor: 'background.paper',
                        border: '4px solid rgb(215, 208, 197)',
                        borderRadius: '8px',
                        boxShadow: 24,
                        pb: 8,
                    }}>
                        <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>シフト変更と削除</Typography>
                            </Toolbar>
                        </AppBar>
                        <Container maxWidth={'sm'}>
                            <Box component={'form'} onSubmit={onEditShift} sx={{mt: 8}}>
                                <TextField
                                    id='edit_therapist_name'
                                    name='edit_therapist_name'
                                    label="セラピスト名"
                                    select
                                    fullWidth
                                    variant="standard"
                                    sx={{mb: 5}}
                                    value={editTherapistName}
                                    onChange={e => setEditTherapistName(e.target.value)}
                                >
                                    {therapist_shift.map((option, index) => (
                                        <MenuItem key={index} value={option.therapist_name}>
                                            {option.therapist_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id='edit_store'
                                    name='edit_store'
                                    label='店舗'
                                    select
                                    fullWidth
                                    variant="standard"
                                    sx={{mb: 5}}
                                    value={editStore}
                                    onChange={e => setEditStore(e.target.value)}
                                >
                                    {therapistShiftStores.map((option, index) => (
                                        <MenuItem key={index} value={option.store_name}>
                                            {option.store_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    id='edit_from_time'
                                    name='edit_from_time'
                                    label='開始時間'
                                    type="datetime-local"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{step: 300/**5 min */}}
                                    variant="standard"
                                    sx={{mb: 5}}
                                    value={editFromTime}
                                    onChange={e => setEditFromTime(e.target.value)}
                                />

                                <TextField
                                    id='edit_to_time'
                                    name='edit_to_time'
                                    label='終了時間'
                                    type="datetime-local"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{step: 300/**5 min */}}
                                    variant="standard"
                                    sx={{mb: 5}}
                                    value={editToTime}
                                    onChange={e => setEditToTime(e.target.value)}
                                />

                                <ButtonGroup style={{marginTop: '30px'}} fullWidth variant="outlined" aria-label="outlined button group">
                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="secondary"
                                        type={"submit"}
                                    >
                                        編集
                                    </Button>

                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="error"
                                        onClick={onConfirmedShiftDelete}
                                    >
                                        削除
                                    </Button>
                                </ButtonGroup>
                            </Box>
                        </Container>
                    </Box>
                </Fade>
            </Modal>
        </MainLayout>   
    )
}

export default TherapistShift
