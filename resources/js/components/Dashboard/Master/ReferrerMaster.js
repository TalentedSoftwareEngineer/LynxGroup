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
import { setReferrerAction } from '../../../store/actions/referrerAction';

function createData(referrer_id, date, time, referrer_name, referrer_fee, referrer_memo) {
    return {
        referrer_id,
        date,
        time,
        referrer_name,
        referrer_fee,
        referrer_memo
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
      id: 'referrer_id',
      numeric: true,
      disablePadding: false,
      label: 'id',
    },
    // {
    //   id: 'date',
    //   numeric: false,
    //   disablePadding: false,
    //   label: '日付',
    // },
    // {
    //   id: 'time',
    //   numeric: false,
    //   disablePadding: false,
    //   label: '時間',
    // },
    {
      id: 'referrer_name',
      numeric: false,
      disablePadding: false,
      label: '名前',
    },
    {
        id: 'referrer_fee',
        numeric: false,
        disablePadding: false,
        label: '手数料',
    },
    {
        id: 'referrer_memo',
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

function ReferrerMaster() {
    const dispatch = useDispatch();
    const { referrers } = useSelector(({referrerStore})=>referrerStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('referrer_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const referrer_name_input = useRef(null);
    const [ referrer_fee, setReferrerFee ] = useState(2000);
    const referrer_memo_input = useRef(null);

    const [ edit_referrer_id, setEditReferrerId ] = useState(0);
    const [ edit_referrer_name, setEditReferrerName ] = useState('');
    const [ edit_referrer_fee, setEditReferrerFee ] = useState(2000);
    const [ edit_referrer_memo, setEditReferrerMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getReferrers();
        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = referrers.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.referrer_name,
            item.referrer_fee,
            item.referrer_memo
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteReferrer').each((index, item) => {
            $(item).click((event)=>{
                let deleteId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deleteReferrer', {referrerId: deleteId})
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

                        // getReferrers();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditReferrer').each(( index, item )=>{
            $(item).click((event)=>{
                let editId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editName = event.currentTarget.id.split(':*_*:')[2];
                let editFee = event.currentTarget.id.split(':*_*:')[3];
                let editMemo = event.currentTarget.id.split(':*_*:')[4];

                setEditReferrerId(editId);
                setEditReferrerName(editName);
                setEditReferrerFee(editFee);
                setEditReferrerMemo(editMemo);
                handleOpen();
            });
        });
    }

    const getReferrers = () => {
        axios
        .get('/api/getReferrers')
        .then((res)=>{
            dispatch(setReferrerAction(res.data));
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
            referrer_name: formData.get('referrer_name'),
            referrer_fee: formData.get('referrer_fee'),
            referrer_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registReferrer', Info)
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

                // getReferrers();
                window.location.reload();

                referrer_name_input.current.value = '';
                setReferrerFee(2000);
                referrer_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
            });
    }

    const onEdit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            referrer_id: edit_referrer_id,
            referrer_name: formData.get('edit_referrer_name'),
            referrer_fee: formData.get('edit_referrer_fee'),
            referrer_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/editReferrer', Info)
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

                // getReferrers();
                window.location.reload();
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'紹介者マスター'} isShowPartTitle={true}>
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
                            id="referrer_name"
                            label="紹介者名"
                            name="referrer_name"
                            autoComplete="referrer_name"
                            variant="standard"
                            placeholder="紹介者名"
                            multiline
                            autoFocus
                            inputRef={referrer_name_input}
                        />
                        <TextField
                            id="referrer_fee"
                            name='referrer_fee'
                            select
                            fullWidth
                            label="手数料"
                            value={referrer_fee}
                            onChange={e => setReferrerFee(e.target.value)}
                            variant="standard"
                            sx={{ mt: 3 }}
                        >
                            <MenuItem value={'1件につき2000円'}>
                                1件につき2000円
                            </MenuItem>
                            <MenuItem value={'1件につき2500円'}>
                                1件につき2500円
                            </MenuItem>
                            <MenuItem value={'1件につき3000円'}>
                                1件につき3000円
                            </MenuItem>
                            <MenuItem value={'「セラピスト報酬」の15％+出勤日数×1000円'}>
                                「セラピスト報酬」の15％+出勤日数×1000円
                            </MenuItem>
                            <MenuItem value={'「セラピスト報酬」の15％'}>
                                「セラピスト報酬」の15％
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
                            ref={referrer_memo_input}
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
                                            key={row.referrer_id}
                                            >
                                                <TableCell
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="center"
                                                >
                                                    {row.referrer_id}
                                                </TableCell>
                                                {/* <TableCell align="center">{row.date}</TableCell>
                                                <TableCell align="center">{row.time}</TableCell> */}
                                                <TableCell align="center">{row.referrer_name}</TableCell>
                                                <TableCell align="center">{row.referrer_fee}</TableCell>
                                                <TableCell align="center">{row.referrer_memo}</TableCell>
                                                <TableCell align="center">
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Button
                                                                id={
                                                                    "btnEditReferrer" + ":*_*:"
                                                                    + row.referrer_id + ":*_*:"
                                                                    + row.referrer_name + ":*_*:"
                                                                    + row.referrer_fee + ":*_*:"
                                                                    + row.referrer_memo
                                                                } 
                                                                className='btnEditReferrer'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                編集
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnDeleteReferrer_" + row.referrer_id} 
                                                                className='btnDeleteReferrer'
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
                                id="edit_referrer_name"
                                label="紹介者名"
                                name="edit_referrer_name"
                                autoComplete="edit_referrer_name"
                                variant="standard"
                                placeholder="紹介者名"
                                multiline
                                autoFocus
                                value={edit_referrer_name}
                                onChange={e => setEditReferrerName(e.target.value)}
                            />
                            <TextField
                                id="edit_referrer_fee"
                                name='edit_referrer_fee'
                                select
                                fullWidth
                                label="手数料"
                                value={edit_referrer_fee}
                                onChange={e => setEditReferrerFee(e.target.value)}
                                variant="standard"
                                sx={{ mt: 3 }}
                            >
                                <MenuItem value={'1件につき2000円'}>
                                    1件につき2000円
                                </MenuItem>
                                <MenuItem value={'1件につき2500円'}>
                                    1件につき2500円
                                </MenuItem>
                                <MenuItem value={'1件につき3000円'}>
                                    1件につき3000円
                                </MenuItem>
                                <MenuItem value={'「セラピスト報酬」の15％+出勤日数×1000円'}>
                                    「セラピスト報酬」の15％+出勤日数×1000円
                                </MenuItem>
                                <MenuItem value={'「セラピスト報酬」の15％'}>
                                    「セラピスト報酬」の15％
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
                                    fontSize: '18px'
                                }}
                                value={edit_referrer_memo}
                                onChange={e => setEditReferrerMemo(e.target.value)}
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

export default ReferrerMaster
