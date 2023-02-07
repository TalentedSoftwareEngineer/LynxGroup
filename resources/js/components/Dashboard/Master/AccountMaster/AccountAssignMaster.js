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
    Modal,
    FormControl,
    Input,
    InputAdornment,
    Stack,
    FormControlLabel,
    Switch,
} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import AccountLayout from './AccountLayout';
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import moment from "moment";
import $ from 'jquery';
import { setAccountAssignAction } from '../../../../store/actions/accountAssignAction';

function createData(account_id, date, time, account_name, account_from_customer, account_to_therapist, account_memo) {
    return {
        account_id,
        date,
        time,
        account_name,
        account_from_customer,
        account_to_therapist,
        account_memo
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
      id: 'account_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    {
      id: 'account_name',
      numeric: false,
      disablePadding: false,
      label: '指名の種類',
    },
    {
      id: 'account_from_customer',
      numeric: false,
      disablePadding: false,
      label: 'お客様へ請求する金額の式',
    },
    {
      id: 'account_to_therapist',
      numeric: false,
      disablePadding: false,
      label: 'セラピストへ支払われる金額の式',
    },
    {
        id: 'account_memo',
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

function AccountAssignMaster() {
    const dispatch = useDispatch();
    const { accountAssigns } = useSelector(({accountAssignStore})=>accountAssignStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('account_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const account_name_input = useRef(null);
    const account_from_customer_input = useRef(null);
    const account_to_therapist_input = useRef(null);
    const account_memo_input = useRef(null);

    const [ edit_account_id, setEditAccountId ] = useState(0);
    const [ edit_account_name, setEditAccountName ] = useState('');
    const [ edit_account_from_customer, setEditAccountFromCustomer ] = useState('');
    const [ edit_account_to_therapist, setEditAccountToTherapist ] = useState('');
    const [ edit_account_memo, setEditAccountMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const [flagManual, setFlagManual] = useState(true);
    const [editFlagManual, setEditFlagManual] = useState(true);
    
    useEffect(()=>{
        getAccounts();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = accountAssigns.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.accountCourse_name,
            item.accountCourse_from,
            item.accountCourse_to,
            item.accountCourse_memo,
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteAccountCourse').each((index, item) => {
            $(item).click((event)=>{
                let deleteAccountId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deleteAccountAssgin', {id: deleteAccountId})
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

                        // getAccounts();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditAccountCourse').each(( index, item )=>{
            $(item).click((event)=>{
                let editAccountId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editAccountName = event.currentTarget.id.split(':*_*:')[2];
                let editAccountFrom = event.currentTarget.id.split(':*_*:')[3];
                let editAccountTo = event.currentTarget.id.split(':*_*:')[4];
                let editAccountMemo = event.currentTarget.id.split(':*_*:')[5];

                setEditAccountId(editAccountId);
                setEditAccountName(editAccountName);
                setEditAccountFromCustomer(editAccountFrom);
                setEditAccountToTherapist(editAccountTo);
                setEditAccountMemo(editAccountMemo);
                handleOpen();
            });
        });
    }

    const getAccounts = () => {
        axios
        .get('/api/getAccountAssgin')
        .then((res)=>{
            dispatch(setAccountAssignAction(res.data));
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

        const accountInfo = {
            account_name: formData.get('account_name'),
            account_from: formData.get('account_from_customer'),
            account_to: flagManual ? formData.get('account_to_therapist') : '1000+parseInt(mainNominationCount/5)*500',
            account_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registAccountAssgin', accountInfo)
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

                // getAccounts();
                window.location.reload();

                account_name_input.current.value = '';
                account_from_customer_input.current.value = '';
                account_to_therapist_input.current.value = '';
                account_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEditAccount = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const accountInfo = {
            account_id: edit_account_id,
            account_name: formData.get('edit_account_name'),
            account_from: formData.get('edit_account_from_customer'),
            account_to: editFlagManual ? formData.get('edit_account_to_therapist') : '1000+parseInt(mainNominationCount/5)*500',
            account_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/editAccountAssgin', accountInfo)
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

                // getAccounts();
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
                title={'指名'}
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
                                id="account_name"
                                label="指名の種類"
                                name="account_name"
                                autoComplete="account_name"
                                variant="standard"
                                placeholder="指名の種類"
                                multiline
                                autoFocus
                                inputRef={account_name_input}
                            />
                            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                <Input
                                    id="account_from_customer"
                                    name='account_from_customer'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                    inputProps={{
                                    'aria-label': 'お客様へ請求する金額',
                                    }}
                                    label='お客様へ請求する金額'
                                    placeholder="お客様へ請求する金額"
                                    inputRef={account_from_customer_input}
                                />
                            </FormControl>
                            <Stack spacing={1} direction={'row'} sx={{ mt: 4 }}>
                                <FormControlLabel
                                    value="start"
                                    control={
                                        <Switch 
                                            color="primary"
                                            checked={flagManual}
                                            onChange={e=> setFlagManual(event.target.checked)}
                                         />
                                    }
                                    label={'スライド'}
                                    labelPlacement="start"
                                />
                                {flagManual &&
                                    <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                        <Input
                                            id="account_to_therapist"
                                            name='account_to_therapist'
                                            type="number"
                                            endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                            inputProps={{
                                                'aria-label': 'セラピストへ支払われる金額',
                                            }}
                                            label='セラピストへ支払われる金額'
                                            placeholder="セラピストへ支払われる金額"
                                            inputRef={account_to_therapist_input}
                                        />
                                    </FormControl>
                                }
                                {!flagManual &&
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            fontSize: '18px',
                                            letterSpacing: '3px',
                                            color: 'grey',
                                            textShadow: '4px 5px 6px #fff',
                                        }}
                                    >
                                        1,000円～本指名５本ごとに500円アップ
                                    </Typography>
                                }
                            </Stack>
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
                                ref={account_memo_input}
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
                                                key={row.account_id}
                                                >
                                                    <TableCell
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        align="center"
                                                    >
                                                        {row.account_id}
                                                    </TableCell>
                                                    <TableCell align="center">{row.account_name}</TableCell>
                                                    <TableCell align="center">{row.account_from_customer}</TableCell>
                                                    <TableCell align="center">{row.account_to_therapist}</TableCell>
                                                    <TableCell align="center">{row.account_memo}</TableCell>
                                                    <TableCell align="center">
                                                        <Grid container spacing={1}>
                                                            <Grid item>
                                                                <Button
                                                                    id={
                                                                        "btnEditAccountCourse" + ":*_*:"
                                                                        + row.account_id + ":*_*:"
                                                                        + row.account_name + ":*_*:"
                                                                        + row.account_from_customer + ":*_*:"
                                                                        + row.account_to_therapist + ":*_*:"
                                                                        + row.account_memo
                                                                    } 
                                                                    className='btnEditAccountCourse'
                                                                    variant="outlined" 
                                                                    color="success" 
                                                                    size="small"
                                                                >
                                                                    編集
                                                                </Button>
                                                            </Grid>
                                                            <Grid item>
                                                                <Button
                                                                    id={"btnDeleteAccountCourse" + "_" + row.account_id} 
                                                                    className='btnDeleteAccountCourse'
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
                        <Box component={'form'} onSubmit={onEditAccount}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="edit_account_name"
                                label="指名の種類"
                                name="edit_account_name"
                                autoComplete="edit_account_name"
                                variant="standard"
                                placeholder="指名の種類"
                                multiline
                                autoFocus
                                value={edit_account_name}
                                onChange={e => setEditAccountName(e.target.value)}
                            />
                            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                <Input
                                    id="edit_account_from_customer"
                                    name='edit_account_from_customer'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                    inputProps={{
                                    'aria-label': 'お客様へ請求する金額',
                                    }}
                                    label='お客様へ請求する金額'
                                    placeholder="お客様へ請求する金額"
                                    value={edit_account_from_customer}
                                    onChange={e => setEditAccountFromCustomer(e.target.value)}
                                />
                            </FormControl>
                            <Stack spacing={1} direction={'row'} sx={{ mt: 4 }}>
                                <FormControlLabel
                                    value="start"
                                    control={
                                        <Switch 
                                            color="primary"
                                            checked={editFlagManual}
                                            onChange={e=> setEditFlagManual(event.target.checked)}
                                         />
                                    }
                                    label={'スライド'}
                                    labelPlacement="start"
                                />
                                {editFlagManual && 
                                    <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                        <Input
                                            id="edit_account_to_therapist"
                                            name='edit_account_to_therapist'
                                            type="number"
                                            endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                            inputProps={{
                                            'aria-label': 'セラピストへ支払われる金額',
                                            }}
                                            label='セラピストへ支払われる金額'
                                            placeholder="セラピストへ支払われる金額"
                                            value={edit_account_to_therapist}
                                            onChange={e => setEditAccountToTherapist(e.target.value)}
                                        />
                                    </FormControl>
                                }
                                {!editFlagManual &&
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            fontSize: '18px',
                                            letterSpacing: '3px',
                                            color: 'grey',
                                            textShadow: '4px 5px 6px #fff',
                                        }}
                                    >
                                        1,000円～本指名５本ごとに500円アップ
                                    </Typography>
                                }
                            </Stack>
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
                                value={edit_account_memo}
                                onChange={e => setEditAccountMemo(e.target.value)}
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

export default AccountAssignMaster
