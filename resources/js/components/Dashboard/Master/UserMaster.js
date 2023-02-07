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
    MenuItem
} from "@mui/material";
import MainLayout from "../../MainLayout/MainLayout";
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import moment from "moment";
import $ from 'jquery';
import { setUserAction } from '../../../store/actions/userAction'

function createData(user_id, user_name, user_email, user_psw, user_authority, user_memo) {
    return {
        user_id,
        user_name,
        user_email,
        user_psw,
        user_authority,
        user_memo
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
      id: 'user_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    {
      id: 'user_name',
      numeric: false,
      disablePadding: false,
      label: '名前',
    },
    {
      id: 'user_email',
      numeric: false,
      disablePadding: false,
      label: 'ID',
    },
    {
      id: 'user_psw',
      numeric: false,
      disablePadding: false,
      label: 'パスワード',
    },
    {
      id: 'user_authority',
      numeric: false,
      disablePadding: false,
      label: '権限',
    },
    {
        id: 'user_memo',
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

function UserMaster() {
    const dispatch = useDispatch();
    const { users } = useSelector(({userStore})=>userStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('user_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const username_input = useRef(null);
    const email_input = useRef(null);
    const password_input = useRef(null);
    const [authority, setAuthority] = useState(1);
    const memo_input = useRef(null);

    const [ edit_user_id, setEditUserId ] = useState(0);
    const [ edit_username, setEditUsername ] = useState('');
    const [ edit_email, setEditEmail ] = useState('');
    const [ edit_password, setEditPassword ] = useState('');
    const [ edit_authority, setEditAuthority ] = useState(1);
    const [ edit_memo, setEditMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getUsers();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = users.map((item, index)=>{
        return createData(
            item.id, 
            item.name,
            item.email,
            item.psw,
            item.authority,
            item.memo
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteUser').each((index, item) => {
            $(item).click((event)=>{
                let deleteId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deleteuser', {userId: deleteId})
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

                        // getUsers();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditUser').each(( index, item )=>{
            $(item).click((event)=>{
                let editId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editName = event.currentTarget.id.split(':*_*:')[2];
                let editEmail = event.currentTarget.id.split(':*_*:')[3];
                let editPsw = event.currentTarget.id.split(':*_*:')[4];
                let editAuthority = event.currentTarget.id.split(':*_*:')[5];
                let editMemo = event.currentTarget.id.split(':*_*:')[6];

                setEditUserId(editId);
                setEditUsername(editName);
                setEditEmail(editEmail);
                setEditPassword(editPsw);
                setEditAuthority(editAuthority);
                setEditMemo(editMemo);

                handleOpen();
            });
        });
    }

    const getUsers = () => {
        axios
        .get('/api/getusers')
        .then((res)=>{
            dispatch(setUserAction(res.data));
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
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            authority: formData.get('authority'),
            memo: formData.get('memo')
        };

        await window.axios
            .post('/api/signup', Info)
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

                // getUsers();
                window.location.reload();

                username_input.current.value = '';
                email_input.current.value = '';
                password_input.current.value = '';
                setAuthority(1);
                memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEdit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            user_id: edit_user_id,
            username: formData.get('edit_username'),
            email: formData.get('edit_email'),
            password: formData.get('edit_password'),
            authority: formData.get('edit_authority'),
            memo: formData.get('edit_memo'),
        };

        await window.axios
            .post('/api/edituser', Info)
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

                // getUsers();
                window.location.reload();
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'管理・利用者マスター'} isShowPartTitle={true}>
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
                            variant="standard"
                            required
                            fullWidth
                            id="username"
                            label="名前"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            inputRef={username_input}
                        />
                        <TextField
                            margin="normal"
                            variant="standard"
                            required
                            fullWidth
                            id="email"
                            label="ID"
                            name="email"
                            autoComplete="email"
                            inputRef={email_input}
                        />
                        <TextField
                            margin="normal"
                            variant="standard"
                            required
                            fullWidth
                            name="password"
                            label="パスワード"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={password_input}
                        />
                        <TextField
                            id="authority"
                            name='authority'
                            select
                            fullWidth
                            label="権限"
                            value={authority}
                            onChange={e => setAuthority(e.target.value)}
                            variant="standard"
                            sx={{ mt: 3 }}
                        >
                            <MenuItem value={1}>
                                一般利用者
                            </MenuItem>
                            <MenuItem value={2}>
                                管理者
                            </MenuItem>
                        </TextField>
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
                            ref={memo_input}
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
                                            key={row.user_id}
                                            >
                                                <TableCell
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.user_id}
                                                </TableCell>
                                                <TableCell align="center">{row.user_name}</TableCell>
                                                <TableCell align="center">{row.user_email}</TableCell>
                                                <TableCell align="center">{row.user_psw}</TableCell>
                                                <TableCell align="center">{row.user_authority}</TableCell>
                                                <TableCell align="center">{row.user_memo}</TableCell>
                                                <TableCell align="center">
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Button
                                                                id={
                                                                    "btnEditUser" + ":*_*:"
                                                                    + row.user_id + ":*_*:"
                                                                    + row.user_name + ":*_*:"
                                                                    + row.user_email + ":*_*:"
                                                                    + row.user_psw + ":*_*:"
                                                                    + row.user_authority + ":*_*:"
                                                                    + row.user_memo
                                                                } 
                                                                className='btnEditUser'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                編集
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnDeleteUser_" + row.user_id} 
                                                                className='btnDeleteUser'
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
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="edit_username"
                                label="名前"
                                name="edit_username"
                                autoComplete="edit_username"
                                autoFocus
                                value={edit_username}
                                onChange={e=>setEditUsername(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                id="edit_email"
                                label="ID"
                                name="edit_email"
                                autoComplete="edit_email"
                                value={edit_email}
                                onChange={e=>setEditEmail(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                margin="normal"
                                required
                                fullWidth
                                name="edit_password"
                                label="パスワード"
                                type="password"
                                id="edit_password"
                                autoComplete="current-password"
                                value={edit_password}
                                onChange={e=>setEditPassword(e.target.value)}
                            />
                            <TextField
                                variant="standard"
                                id="edit_authority"
                                name='edit_authority'
                                select
                                fullWidth
                                label="権限"
                                value={edit_authority}
                                onChange={e => setEditAuthority(e.target.value)}
                                sx={{ mt: 3 }}
                            >
                                <MenuItem value={1}>
                                    一般利用者
                                </MenuItem>
                                <MenuItem value={2}>
                                    管理者
                                </MenuItem>
                            </TextField>
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
                                    fontSize: '20px'
                                }}
                                value={edit_memo}
                                onChange={e=>setEditMemo(e.target.value)}
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

export default UserMaster
