import React, { useEffect } from "react";
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
    MenuItem
} from "@mui/material";
import MainLayout from "../../MainLayout/MainLayout";
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import { setTherapistManagementAction } from '../../../store/actions/therapistAction';

function createData(therapist_id, therapist_name, shift_display_rank, shift_isHiden, shift_first_day, nomination_fee, main_nomination_fee, shift_total_main_nomination, therapist_memo) {
    return {
        therapist_id,
        therapist_name,
        shift_display_rank,
        shift_isHiden,
        shift_first_day,
        nomination_fee,
        main_nomination_fee,
        shift_total_main_nomination,
        therapist_memo
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


const headCells = [
    {
      id: 'therapist_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    {
      id: 'therapist_name',
      numeric: false,
      disablePadding: false,
      label: '名前',
    },
    {
      id: 'shift_display_rank',
      numeric: false,
      disablePadding: false,
      label: '表示順位',
    },
    {
      id: 'shift_isHiden',
      numeric: false,
      disablePadding: false,
      label: '掲載',
    },
    {
        id: 'shift_first_day',
        numeric: false,
        disablePadding: false,
        label: '勤務初日',
    },
    {
        id: 'fee',
        numeric: false,
        disablePadding: false,
        label: '指名料',
    },
    {
        id: 'shift_total_main_nomination',
        numeric: false,
        disablePadding: false,
        label: 'トータル本指名数',
    },
    {
        id: 'therapist_memo',
        numeric: false,
        disablePadding: false,
        label: 'メモ',
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

function TherapistManagement() {
    const dispatch = useDispatch();
    const { therapist_mgr } = useSelector(({therapistStore})=>therapistStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('therapist_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    
    useEffect(()=>{
        getTherapists();
    }, []);

    rows = therapist_mgr.map((item, index)=>{
        return createData(
            item.id, 
            item.therapist_name, 
            item.shift_display_rank, 
            item.shift_isHiden,
            item.shift_first_day,
            item.nomination_fee,
            item.main_nomination_fee,
            item.shift_total_main_nomination,
            item.therapist_memo
        );
    });

    const jQueryCode = () => {

    }

    const getTherapists = () => {
        axios
        .get('/api/gettherapists')
        .then((res)=>{
            dispatch(setTherapistManagementAction(res.data));
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

    const onSaveChange = event => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if(confirm('本当に変更してもよろしいですか？') == true) {
            therapist_mgr.forEach((element, index) => {
                window.axios
                    .post('/api/editTherapistManagement', {
                        therapist_id: element.id,
                        shift_isHiden: formData.get("shiftIsHiden" + "_" + element.id),
                        shift_display_rank: formData.get("shiftDisplayRank" + "_" + element.id),
                    })
                    .then(res=>{
                        toast.success('成果的に変更されました。', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'dark',
                            transition: Flip,
                        });

                        window.location.reload();
                    })
                    .catch(err=>{
                        toast.error('変更が失敗しました。');
                    });
            });
        }
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'セラピスト管理'} isShowPartTitle={true}>
            <Container maxWidth={'lg'}>
                <Box
                    sx={{marginTop: '40px'}}
                    component={"form"} 
                    onSubmit={onSaveChange}
                >
                    <Grid
                        container 
                        align="center" 
                        justifyContent={"center"} 
                        alignItems="center"
                        sx={{
                            mt:8
                        }}
                    >
                        <Grid item>
                            <Button
                                type={"submit"}
                                variant="outlined"
                                color="success"
                                size="large"
                            >
                                表示順位・掲載を保存
                            </Button>
                        </Grid>
                    </Grid>
                    <Paper sx={{ width: "100%", mb: 2, mt: 8 }}>
                        <TableContainer>
                            <Table
                                sx={{
                                    width: '100%'
                                }}
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
                                            tabIndex={-1}
                                            key={row.therapist_id}
                                            >
                                                <TableCell
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.therapist_id}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.therapist_name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <FormControl variant="outlined" fullWidth>
                                                        <Input
                                                            variant="outlined"
                                                            id={"shiftDisplayRank" + "_" + row.therapist_id}
                                                            name={"shiftDisplayRank" + "_" + row.therapist_id}
                                                            type="number"
                                                            defaultValue={row.shift_display_rank}
                                                        />
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        id={"shiftIsHiden" + "_" + row.therapist_id}
                                                        name={"shiftIsHiden" + "_" + row.therapist_id}
                                                        select
                                                        fullWidth
                                                        defaultValue={row.shift_isHiden}
                                                        variant="standard"
                                                        style={{
                                                            paddingTop:'0px',
                                                            paddingBottom: '0px',
                                                        }}
                                                    >
                                                        <MenuItem value={2}>
                                                            表示
                                                        </MenuItem>
                                                        <MenuItem value={1}>
                                                            非表示
                                                        </MenuItem>
                                                    </TextField>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.shift_first_day}
                                                </TableCell>
                                                <TableCell align="center" sx={{pt: 0, pb: 0}}>
                                                    <Typography><span>指名料 : </span>{row.nomination_fee}</Typography>
                                                    <Typography><span>本指名料 : </span>{row.main_nomination_fee}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.shift_total_main_nomination}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {row.therapist_memo}
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
            </Container>
        </MainLayout>   
    )
}

export default TherapistManagement
