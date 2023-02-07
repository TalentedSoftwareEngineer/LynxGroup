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
import MainLayout from "../../../MainLayout/MainLayout";
import AccountLayout from './AccountLayout';
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import moment from "moment";
import $ from 'jquery';
import { setAccountMenuAction } from '../../../../store/actions/accountMenuAction';

function createData(accountMenu_id, date, time, accountMenu_name, accountMenu_memo) {
    return {
        accountMenu_id,
        date,
        time,
        accountMenu_name,
        accountMenu_memo
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
      id: 'accountMenu_id',
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
      id: 'accountMenu_name',
      numeric: false,
      disablePadding: false,
      label: 'コース名',
    },
    {
        id: 'accountMenu_memo',
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

function AccountMenuMaster() {
    const dispatch = useDispatch();
    const { accountMenus } = useSelector(({accountMenuStore})=>accountMenuStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('accountMenu_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const accountMenu_name_input = useRef(null);
    const accountMenu_memo_input = useRef(null);

    const [ edit_accountMenu_id, setEditStoreId ] = useState(0);
    const [ edit_accountMenu_name, setEditStoreName ] = useState('');
    const [ edit_accountMenu_memo, setEditStoreMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getStores();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = accountMenus.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.accountMenu_name,
            item.accountMenu_memo
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteAccountMenu').each((index, item) => {
            $(item).click((event)=>{
                let deleteStoreId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deleteAccountMenu', {id: deleteStoreId})
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

                setEditStoreId(editStoreId);
                setEditStoreName(editStoreName);
                setEditStoreMemo(editStoreMemo);
                handleOpen();
            });
        });
    }

    const getStores = () => {
        axios
        .get('/api/getAccountMenus')
        .then((res)=>{
            dispatch(setAccountMenuAction(res.data));
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
            accountMenu_name: formData.get('accountMenu_name'),
            accountMenu_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registAccountMenu', storeInfo)
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

                accountMenu_name_input.current.value = '';
                accountMenu_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEditStore = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const storeInfo = {
            accountMenu_id: edit_accountMenu_id,
            accountMenu_name: formData.get('edit_accountMenu_name'),
            accountMenu_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/editAccountMenu', storeInfo)
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
        <MainLayout title={"LynxGroup"} partTitle={''} isShowPartTitle={false}>
            <AccountLayout
                title={'コース(メニュー表記)'}
            >
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
                                id="accountMenu_name"
                                label="コース名"
                                name="accountMenu_name"
                                autoComplete="accountMenu_name"
                                variant="standard"
                                placeholder="コース名"
                                multiline
                                autoFocus
                                inputRef={accountMenu_name_input}
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
                                ref={accountMenu_memo_input}
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
                                                key={row.accountMenu_id}
                                                >
                                                    <TableCell
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        align="center"
                                                    >
                                                        {row.accountMenu_id}
                                                    </TableCell>
                                                    <TableCell align="center">{row.date}</TableCell>
                                                    <TableCell align="center">{row.time}</TableCell>
                                                    <TableCell align="center">{row.accountMenu_name}</TableCell>
                                                    <TableCell align="center">{row.accountMenu_memo}</TableCell>
                                                    <TableCell align="center">
                                                        <Grid container spacing={1}>
                                                            <Grid item>
                                                                <Button
                                                                    id={
                                                                        "btnEditStore" + ":*_*:"
                                                                        + row.accountMenu_id + ":*_*:"
                                                                        + row.accountMenu_name + ":*_*:"
                                                                        + row.accountMenu_memo
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
                                                                    id={"btnDeleteAccountMenu_" + row.accountMenu_id} 
                                                                    className='btnDeleteAccountMenu'
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

            </AccountLayout>
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
                                id="edit_accountMenu_name"
                                label="コース名"
                                name="edit_accountMenu_name"
                                autoComplete="edit_accountMenu_name"
                                variant="standard"
                                placeholder="コース名"
                                multiline
                                autoFocus
                                value={edit_accountMenu_name}
                                onChange={e => setEditStoreName(e.target.value)}
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
                                value={edit_accountMenu_memo}
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

export default AccountMenuMaster
