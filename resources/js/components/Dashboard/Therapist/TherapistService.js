import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
    Grid, 
    Typography, 
    Container, 
    TextField, 
    TextareaAutosize, 
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
    Modal
} from "@mui/material";
import MainLayout from "../../MainLayout/MainLayout";
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import moment from "moment";
import $ from 'jquery';
import { setTherapistServicesAction } from '../../../store/actions/therapistServiceAction'

function createData(therapistService_id, date, time, therapist_serv_name, therapist_serv_memo) {
    return {
        therapistService_id,
        date,
        time,
        therapist_serv_name,
        therapist_serv_memo
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
      id: 'therapistService_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    {
      id: 'date',
      numeric: false,
      disablePadding: false,
      label: '日付',
    },
    {
      id: 'time',
      numeric: false,
      disablePadding: false,
      label: '時間',
    },
    {
      id: 'therapist_serv_name',
      numeric: false,
      disablePadding: false,
      label: 'サービス名',
    },
    {
        id: 'therapist_serv_memo',
        numeric: false,
        disablePadding: false,
        label: 'メモ',
    },
    {
        id: 'control',
        numeric: false,
        disablePadding: false,
        label: '操作',
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

function TherapistService() {
    const dispatch = useDispatch();
    const { therapistServices } = useSelector(({therapistServiceStore})=>therapistServiceStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('therapistService_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const therapist_serv_name_input = useRef(null);
    const therapist_serv_memo_input = useRef(null);

    const [ edit_therapist_serv_id, setEditTherapistServiceId ] = useState(0);
    const [ edit_therapist_serv_name, setEditTherapistServiceName ] = useState('');
    const [ edit_therapist_serv_memo, setEditTherapistServiceMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getTherapistServices();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = therapistServices.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.therapist_serv_name,
            item.therapist_serv_memo
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteTherapistService').each((index, item) => {
            $(item).click((event)=>{
                let deleteId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deleteTherapistService', {therapistServiceId: deleteId})
                    .then((res)=>{
                        toast.success('成果的に削除されました。', {
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

                        // getTherapistServices();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditTherapistService').each(( index, item )=>{
            $(item).click((event)=>{
                let editId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editName = event.currentTarget.id.split(':*_*:')[2];
                let editMemo = event.currentTarget.id.split(':*_*:')[3];

                setEditTherapistServiceId(editId);
                setEditTherapistServiceName(editName);
                setEditTherapistServiceMemo(editMemo);
                handleOpen();
            });
        });
    }

    const getTherapistServices = () => {
        axios
        .get('/api/getTherapistServices')
        .then((res)=>{
            dispatch(setTherapistServicesAction(res.data));
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            therapist_serv_name: formData.get('therapist_serv_name'),
            therapist_serv_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registTherapistService', Info)
            .then((response) => {
                toast.success('成果的に登録されました。', {
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

                // getTherapistServices();
                window.location.reload();

                therapist_serv_name_input.current.value = '';
                therapist_serv_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEdit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            therapistService_id: edit_therapist_serv_id,
            therapist_serv_name: formData.get('edit_therapist_serv_name'),
            therapist_serv_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/editTherapistService', Info)
            .then((response) => {
                toast.success('編集が成果的に進められました。', {
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

                // getTherapistServices();
                window.location.reload();
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'セラピストのサービスマスター'} isShowPartTitle={true}>
            <Container maxWidth={'md'}>
                <Box component={"form"} onSubmit={handleSubmit}>
                    <Typography
                        component={'h2'}
                        sx={{
                            fontSize: '20px',
                            letterSpacing: '3px',
                            color: '#fff',
                            textShadow: '4px 5px 6px #000',
                        }}
                    >
                        【新規登録】
                    </Typography>

                    <Container maxWidth={'sm'}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="therapist_serv_name"
                            label="サービス名"
                            name="therapist_serv_name"
                            autoComplete="therapist_serv_name"
                            variant="standard"
                            placeholder="サービス名"
                            multiline
                            autoFocus
                            inputRef={therapist_serv_name_input}
                        />
                        <TextareaAutosize
                            id="memo"
                            name='memo'
                            aria-label="minimum height"
                            minRows={3}
                            placeholder="メモ"
                            label="メモ"
                            style={{
                                backgroundColor: "transparent",
                                width: '100%',
                                outline: 'none',
                                marginTop: "30px",
                                borderRadius: '5px',
                                fontSize: '20px'
                            }}
                            ref={therapist_serv_memo_input}
                        />
                        <Button
                            sx={{
                                marginTop: '30px'
                            }}
                            size="medium"
                            fullWidth
                            variant="outlined"
                            color="success"
                            type={"submit"}
                        >
                            保存
                        </Button>
                    </Container>
                </Box>

                <Box
                    sx={{marginTop: '40px'}}
                >
                    <Typography
                        component={'h2'}
                        sx={{
                            fontSize: '20px',
                            letterSpacing: '3px',
                            color: '#fff',
                            textShadow: '4px 5px 6px #000',
                            marginBottom: '30px'
                        }}
                    >
                        【登録済み一覧】
                    </Typography>
                    <Paper sx={{ width: "100%", mb: 2 }}>
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
                                            key={row.therapistService_id}
                                            >
                                                <TableCell
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.therapistService_id}
                                                </TableCell>
                                                <TableCell align="center">{row.date}</TableCell>
                                                <TableCell align="center">{row.time}</TableCell>
                                                <TableCell align="center">{row.therapist_serv_name}</TableCell>
                                                <TableCell align="center">{row.therapist_serv_memo}</TableCell>
                                                <TableCell align="center">
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Button
                                                                id={
                                                                    "btnEditTherapistService" + ":*_*:"
                                                                    + row.therapistService_id + ":*_*:"
                                                                    + row.therapist_serv_name + ":*_*:"
                                                                    + row.therapist_serv_memo
                                                                } 
                                                                className='btnEditTherapistService'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                編集
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnDeleteTherapistService_" + row.therapistService_id} 
                                                                className='btnDeleteTherapistService'
                                                                variant="outlined"
                                                                color="error"
                                                                size="small"
                                                            >
                                                                削除
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
            </Container>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper 
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        border: '4px solid rgb(215, 208, 197)',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px'
                    }}
                >
                    <Container maxWidth={'md'}>
                        <Box component={'form'} onSubmit={onEdit}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="edit_therapist_serv_name"
                                label="サービス名"
                                name="edit_therapist_serv_name"
                                autoComplete="edit_therapist_serv_name"
                                variant="standard"
                                placeholder="サービス名"
                                multiline
                                autoFocus
                                value={edit_therapist_serv_name}
                                onChange={e => setEditTherapistServiceName(e.target.value)}
                            />
                            <TextareaAutosize
                                id="edit_memo"
                                name='edit_memo'
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="メモ"
                                label="メモ"
                                style={{
                                    backgroundColor: "transparent",
                                    width: '100%',
                                    outline: 'none',
                                    marginTop: "30px",
                                    borderRadius: '5px',
                                    fontSize: '18px'
                                }}
                                value={edit_therapist_serv_memo}
                                onChange={e => setEditTherapistServiceMemo(e.target.value)}
                            />
                            <Button
                                sx={{
                                    marginTop: '30px'
                                }}
                                size="medium"
                                fullWidth
                                variant="outlined"
                                color="success"
                                type={"submit"}
                            >
                                保存
                            </Button>
                        </Box>
                    </Container>
                </Paper>
            </Modal>
        </MainLayout>   
    )
}

export default TherapistService
