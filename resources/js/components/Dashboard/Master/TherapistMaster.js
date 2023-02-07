import React, { useRef, useEffect, useState, useMemo } from "react";
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
    InputAdornment,
    Input,
    MenuItem,
    Stack,
    FormControlLabel,
    Switch,
    InputLabel,
} from "@mui/material";
import MainLayout from "../../MainLayout/MainLayout";
import { Box } from "@mui/system";
import { visuallyHidden } from '@mui/utils';
import { Flip, toast } from 'react-toastify';
import moment from "moment";
import $ from 'jquery';
import { setTherapistAction } from '../../../store/actions/therapistAction';
import { setReferrerAction } from '../../../store/actions/referrerAction';

function createData(therapist_id, date, time, therapist_name, nomination_fee, main_nomination_fee, referrer, therapist_email, can_service, therapist_memo) {
    return {
        therapist_id,
        date,
        time,
        therapist_name,
        nomination_fee, 
        main_nomination_fee,
        referrer, 
        therapist_email, 
        can_service, 
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
      id: 'therapist_name',
      numeric: false,
      disablePadding: false,
      label: '名前',
    },
    {
        id: 'nomination_fee',
        numeric: false,
        disablePadding: false,
        label: '指名料',
    },
    {
        id: 'main_nomination_fee',
        numeric: false,
        disablePadding: false,
        label: '本指名料',
    },
    {
        id: 'referrer',
        numeric: false,
        disablePadding: false,
        label: '紹介者'
    },
    {
        id: 'therapist_memo',
        numeric: false,
        disablePadding: false,
        label: 'メモ',
    },
    {
        id: 'customer_control',
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
        <TableRow
            sx={{
                backgroundColor: "transparent",
                borderBottom: "2px solid grey",
                "& th": {
                  fontSize: "14px",
                  color: "rgba(96, 96, 96)"
                },
                "& th span:hover": {
                    color: 'black'
                },
                "& th span:focus": {
                    color: 'black'
                }
            }}
        >
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

function TherapistMaster() {
    const dispatch = useDispatch();
    const { therapists } = useSelector(({therapistStore})=>therapistStore);
    const { referrers } = useSelector(({referrerStore})=>referrerStore);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('therapist_id');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);

    const therapist_name_input = useRef(null);
    const therapist_nomination_fee_input = useRef(null);
    const [flag_mainNominationManual, setFlagMainNominationManual] = useState(true);
    const [therapist_main_nomination_fee, setTherapistMainNominationFee] = useState(2000);
    const [therapist_referrer, setTherapistReferrer] = useState(-1);
    const therapist_email_input = useRef(null);
    const therapist_can_service_input = useRef(null);
    const therapist_memo_input = useRef(null);

    const [ edit_therapist_id, setEditTherapistId ] = useState(0);
    const [ edit_therapist_name, setEditTherapistName ] = useState('');
    const [ edit_nomination_fee, setEditNominationFee ] = useState(1000);
    const [flag_editMainNominationManual, setFlagEditMainNominationManual] = useState(true);
    const [ edit_therapist_main_nomination_fee, setEditTherapistMainNominationFee ] = useState(2000);
    const [edit_therapist_referrer, setEditTherapistReferrer] = useState(-1);
    const [ edit_therapist_email, setEditTherapistEmail ] = useState('');
    const [ edit_can_service, setEditCanService ] = useState('');
    const [ edit_therapist_memo, setEditTherapistMemo ] = useState('');

    const [openModal, setOpenModal] = React.useState(false);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    useEffect(()=>{
        getTherapists();
        getReferrers();

        setTimeout(() => {
            jQueryCode();
        }, 2000);
    }, []);

    rows = therapists.map((item, index)=>{
        return createData(
            item.id, 
            moment(item.created_at).format("YYYY-MM-DD"), 
            moment(item.created_at).format("hh:mm:ss"), 
            item.therapist_name,
            item.nomination_fee,
            item.main_nomination_fee,
            item.referrer,
            item.therapist_email ,
            item.can_service ,
            item.therapist_memo == null ? '' : item.therapist_memo,
        );
    });

    const jQueryCode = () => {
        $('.btnDeleteTherapist').each((index, item) => {
            $(item).click((event)=>{
                let deleteTherapistId = Number(event.currentTarget.id.split('_')[1]);
                axios
                    .post('/api/deletetherapist', {therapistId: deleteTherapistId})
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

                        // getTherapists();
                        window.location.reload();
                    })
                    .catch((error)=>{
                        toast.error('削除に失敗しました。');
                    });
            });
        });

        $('.btnEditTherapist').each(( index, item )=>{
            $(item).click((event)=>{
                let editTherapistId = Number(event.currentTarget.id.split(':*_*:')[1]);
                let editTherapistName = event.currentTarget.id.split(':*_*:')[2];
                let editTherapistNomination_fee = event.currentTarget.id.split(':*_*:')[3];
                let editTherapistMainNomination_fee = event.currentTarget.id.split(':*_*:')[4];
                let editTherapistEmail = event.currentTarget.id.split(':*_*:')[5];
                let editTherapistCanService = event.currentTarget.id.split(':*_*:')[6];
                let editTherapistMemo = event.currentTarget.id.split(':*_*:')[7];
                let editTherapistReferrer = event.currentTarget.id.split(':*_*:')[8];

                setEditTherapistId(editTherapistId);
                setEditTherapistName(editTherapistName);
                setEditNominationFee(editTherapistNomination_fee);
                setEditTherapistMainNominationFee(editTherapistMainNomination_fee);
                setEditTherapistReferrer(editTherapistReferrer);
                setEditTherapistEmail(editTherapistEmail);
                setEditCanService(editTherapistCanService);
                setEditTherapistMemo(prev => (editTherapistMemo == null ? '' : editTherapistMemo));
                handleOpen();
            });
        });
    }

    const getTherapists = () => {
        axios
        .get('/api/gettherapists')
        .then((res)=>{
            dispatch(setTherapistAction(res.data));
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

        const therapistInfo = {
            therapist_name: formData.get('therapist_name'),
            nomination_fee: formData.get('nomination_fee'),
            main_nomination_fee: flag_mainNominationManual ? formData.get('main_nomination_fee') : '1000+parseInt(mainNominationCount/5)*500',
            referrer: formData.get('referrer'),
            therapist_email: formData.get('therapist_email'),
            can_service: formData.get('can_service'),
            therapist_memo: formData.get('memo')
        };

        await window.axios
            .post('/api/registtherapist', therapistInfo)
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

                // getTherapists();
                window.location.reload();

                therapist_name_input.current.value = '';
                therapist_nomination_fee_input.current.value='';
                setTherapistMainNominationFee(2000);
                setTherapistReferrer(-1);
                therapist_email_input.current.value='';
                therapist_can_service_input.current.value='';
                therapist_memo_input.current.value = '';
            })
            .catch(error => {
                console.log(error);
                toast.error('その電話番号はすでに登録されています。');
            });
    }

    const onEditTherapist = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const therapistInfo = {
            therapist_id: edit_therapist_id,
            therapist_name: formData.get('edit_therapist_name'),
            nomination_fee: formData.get('edit_nomination_fee'),
            main_nomination_fee:  flag_editMainNominationManual ? formData.get('edit_main_nomination_fee') : '1000+parseInt(mainNominationCount/5)*500',
            referrer: formData.get('edit_referrer'),
            therapist_email: formData.get('edit_therapist_email'),
            can_service: formData.get('edit_can_service'),
            therapist_memo: formData.get('edit_memo')
        };

        await window.axios
            .post('/api/edittherapist', therapistInfo)
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

                // getTherapists();
                window.location.reload();
                handleClose();
            })
            .catch(error => {
                console.log(error);
                toast.error('その電話番号はすでに登録されています。');
            });
    }

    // const referrerName = useMemo(() => {

    // }, [referrers]);

    const getReferrerName = ( referrer_id ) => {
        for(let i=0; i<referrers.length; i++) {
            if(referrers[i].id == referrer_id) {
                return referrers[i].referrer_name;
            }
        }
    }

    return (
        <MainLayout title={"LynxGroup"} partTitle={'セラピストマスター'} isShowPartTitle={true}>
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
                            id="therapist_name"
                            label="セラピスト名"
                            name="therapist_name"
                            variant="standard"
                            placeholder="セラピスト名"
                            multiline
                            autoFocus
                            inputRef={therapist_name_input}
                        />
                        <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                            <InputLabel htmlFor="nomination_fee">指名料</InputLabel>
                            <Input
                                id="nomination_fee"
                                name='nomination_fee'
                                type="number"
                                endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                inputProps={{
                                'aria-label': '指名料',
                                }}
                                label='指名料'
                                placeholder="指名料"
                                defaultValue={1000}
                                inputRef={therapist_nomination_fee_input}
                            />
                        </FormControl>
                        <Stack spacing={1} direction={'row'} sx={{ mt: 3 }}>
                            <FormControlLabel
                                value="start"
                                control={
                                    <Switch 
                                        color="primary"
                                        checked={flag_mainNominationManual}
                                        onChange={e=> setFlagMainNominationManual(event.target.checked)}
                                    />
                                }
                                label={'スライド'}
                                labelPlacement="start"
                            />
                            {flag_mainNominationManual && 
                                <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                    <InputLabel htmlFor="main_nomination_fee">本指名料</InputLabel>
                                    <Input
                                        id="main_nomination_fee"
                                        name='main_nomination_fee'
                                        type="number"
                                        endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                        inputProps={{
                                        'aria-label': '本指名料',
                                        }}
                                        label='本指名料'
                                        placeholder="本指名料"
                                        value={therapist_main_nomination_fee}
                                        onChange={e => setTherapistMainNominationFee(e.target.value)}
                                    />
                                </FormControl>
                            }
                        </Stack>
                        <TextField
                            id="referrer"
                            name='referrer'
                            select
                            fullWidth
                            label="紹介者"
                            value={therapist_referrer}
                            onChange={e => setTherapistReferrer(e.target.value)}
                            variant="standard"
                            sx={{ mt: 3 }}
                        >
                            <MenuItem value={-1}>
                                なし
                            </MenuItem>
                            {
                                referrers.map((option, index) => (
                                            <MenuItem key={index} value={option.id}>
                                                {option.referrer_name}
                                            </MenuItem>
                                ))
                            }
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
                            ref={therapist_memo_input}
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
                </Box>
            </Container>

            <Container maxWidth={'xl'}>
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
                                                <TableCell align="center">{row.date}</TableCell>
                                                <TableCell align="center">{row.time}</TableCell>
                                                <TableCell align="center">{row.therapist_name}</TableCell>
                                                <TableCell align="center">{row.nomination_fee}</TableCell>
                                                <TableCell align="center">{row.main_nomination_fee}</TableCell>
                                                <TableCell align="center">{getReferrerName(row.referrer)}</TableCell>
                                                <TableCell align="center">{row.therapist_memo}</TableCell>
                                                <TableCell align="center">
                                                    <Grid container spacing={1}>
                                                        <Grid item>
                                                            <Button
                                                                id={
                                                                    "btnEditTherapist" + ":*_*:"
                                                                    + row.therapist_id + ":*_*:"
                                                                    + row.therapist_name + ":*_*:"
                                                                    + row.nomination_fee + ":*_*:"
                                                                    + row.main_nomination_fee + ":*_*:"
                                                                    + row.therapist_email + ":*_*:"
                                                                    + row.can_service + ":*_*:"
                                                                    + row.therapist_memo + ":*_*:"
                                                                    + row.referrer
                                                                } 
                                                                className='btnEditTherapist'
                                                                variant="outlined" 
                                                                color="success" 
                                                                size="small"
                                                            >
                                                                編集
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                id={"btnDeleteTherapist_" + row.therapist_id} 
                                                                className='btnDeleteTherapist'
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
                        <Box component={'form'} onSubmit={onEditTherapist}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="edit_therapist_name"
                                label="セラピスト名"
                                name="edit_therapist_name"
                                autoComplete="edit_therapist_name"
                                variant="standard"
                                placeholder="セラピスト名"
                                multiline
                                autoFocus
                                value={edit_therapist_name}
                                onChange={e => setEditTherapistName(e.target.value)}
                            />
                            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                <InputLabel htmlFor="edit_nomination_fee">指名料</InputLabel>
                                <Input
                                    id="edit_nomination_fee"
                                    name='edit_nomination_fee'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                    inputProps={{
                                    'aria-label': '指名料',
                                    }}
                                    label='指名料'
                                    placeholder="指名料"
                                    value={edit_nomination_fee}
                                    onChange={e => setEditNominationFee(e.target.value)}
                                />
                            </FormControl>
                            <Stack spacing={1} direction={'row'} sx={{ mt: 3 }}>
                                <FormControlLabel
                                    value="start"
                                    control={
                                        <Switch 
                                            color="primary"
                                            checked={flag_editMainNominationManual}
                                            onChange={e=> setFlagEditMainNominationManual(event.target.checked)}
                                        />
                                    }
                                    label={'スライド'}
                                    labelPlacement="start"
                                />

                                {flag_editMainNominationManual && 
                                    <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
                                        <InputLabel htmlFor="edit_main_nomination_fee">本指名料</InputLabel>
                                        <Input
                                            id="edit_main_nomination_fee"
                                            name='edit_main_nomination_fee'
                                            type="number"
                                            endAdornment={<InputAdornment position="end">円</InputAdornment>}
                                            inputProps={{
                                            'aria-label': '本指名料',
                                            }}
                                            label='本指名料'
                                            placeholder="本指名料"
                                            value={edit_therapist_main_nomination_fee}
                                            onChange={e => setEditTherapistMainNominationFee(e.target.value)}
                                        />
                                    </FormControl>
                                }
                            </Stack>
                            <TextField
                                id="edit_referrer"
                                name='edit_referrer'
                                select
                                fullWidth
                                label="紹介者"
                                value={edit_therapist_referrer}
                                onChange={e => setEditTherapistReferrer(e.target.value)}
                                variant="standard"
                                sx={{ mt: 3 }}
                            >
                                <MenuItem value={-1}>
                                    なし
                                </MenuItem>
                                {
                                    referrers.map((option, index) => (
                                                <MenuItem key={index} value={option.id}>
                                                    {option.referrer_name}
                                                </MenuItem>
                                    ))
                                }
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
                                value={edit_therapist_memo}
                                onChange={e => setEditTherapistMemo(e.target.value)}
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

export default TherapistMaster
