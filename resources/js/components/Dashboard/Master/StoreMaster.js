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
import { setStoresAction } from '../../../store/actions/storeAction';

function createData(store_id, date, time, store_name, store_area, store_memo) {
    return {
        store_id,
        date,
        time,
        store_name,
        store_area,
        store_memo
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
      id: 'store_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    {
      id: 'store_name',
      numeric: false,
      disablePadding: false,
      label: '店舗名',
    },
    {
      id: 'store_area',
      numeric: false,
      disablePadding: false,
      label: 'エリア'
    },
    {
        id: 'store_memo',
        numeric: false,
        disablePadding: false,
        label: 'メモ',
    },
    {
        id: 'store_control',
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

function StoreMaster() {
    const dispatch = useDispatch();
    const { stores } = useSelector(({storeStore})=>storeStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('store_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const store_name_input = useRef(null);
    const store_area_input = useRef(null);
    const store_memo_input = useRef(null);

    const [ edit_store_id, setEditStoreId ] = useState(0);
    const [ edit_store_name, setEditStoreName ] = useState('');
    const [edit_store_area, setEditStoreArea] = useState('');
    const [ edit_store_memo, setEditStoreMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getStores();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = stores.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.store_name,
            item.store_area,
            item.store_memo
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteStore').each((index, item) => {
            $(item).click((event)=>{
                let deleteStoreId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deletestore', {storeId: deleteStoreId})
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

                        // getStores();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditStore').each(( index, item )=>{
            $(item).click((event)=>{
                let editStoreId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editStoreName = event.currentTarget.id.split(':*_*:')[2];
                let editStoreMemo = event.currentTarget.id.split(':*_*:')[3];
                let editStoreArea = event.currentTarget.id.split(':*_*:')[4];

                setEditStoreId(editStoreId);
                setEditStoreName(editStoreName);
                setEditStoreArea(editStoreArea);
                setEditStoreMemo(editStoreMemo);
                handleOpen();
            });
        });
    }

    const getStores = () => {
        axios
        .get('/api/getstores')
        .then((res)=>{
            dispatch(setStoresAction(res.data));
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

        const storeInfo = {
            store_name: formData.get('store_name'),
            store_area: formData.get('store_area'),
            store_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registstore', storeInfo)
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

                // getStores();
                window.location.reload();

                store_name_input.current.value = '';
                store_area_input.current.value = '';
                store_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEditStore = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const storeInfo = {
            store_id: edit_store_id,
            store_name: formData.get('edit_store_name'),
            store_area: formData.get('edit_store_area'),
            store_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/editstore', storeInfo)
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

                // getStores();
                window.location.reload();
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'店舗マスター'} isShowPartTitle={true}>
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
                            id="store_name"
                            label="店舗名"
                            name="store_name"
                            autoComplete="store_name"
                            variant="standard"
                            placeholder="店舗名"
                            multiline
                            autoFocus
                            inputRef={store_name_input}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="store_area"
                            name="store_area"
                            label="エリア"
                            placeholder="エリア"
                            variant="standard"
                            inputRef={store_area_input}
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
                            ref={store_memo_input}
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
                                            key={row.store_id}
                                            >
                                                <TableCell
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.store_id}
                                                </TableCell>
                                                <TableCell align="center">{row.store_name}</TableCell>
                                                <TableCell align="center">{row.store_area}</TableCell>
                                                <TableCell align="center">{row.store_memo}</TableCell>
                                                <TableCell align="center">
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Button
                                                                id={
                                                                    "btnEditStore" + ":*_*:"
                                                                    + row.store_id + ":*_*:"
                                                                    + row.store_name + ":*_*:"
                                                                    + row.store_memo + ":*_*:"
                                                                    + row.store_area
                                                                } 
                                                                className='btnEditStore'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                編集
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnDeleteStore_" + row.store_id} 
                                                                className='btnDeleteStore'
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
                        <Box component={'form'} onSubmit={onEditStore}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="edit_store_name"
                                label="店舗名"
                                name="edit_store_name"
                                autoComplete="edit_store_name"
                                variant="standard"
                                placeholder="店舗名"
                                multiline
                                autoFocus
                                value={edit_store_name}
                                onChange={e => setEditStoreName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="edit_store_area"
                                name="edit_store_area"
                                label="エリア"
                                placeholder="エリア"
                                variant="standard"
                                value={edit_store_area}
                                onChange={e => setEditStoreArea(e.target.value)}
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
                                value={edit_store_memo}
                                onChange={e => setEditStoreMemo(e.target.value)}
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

export default StoreMaster
