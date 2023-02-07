import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { 
    AppBar, 
    Toolbar,
    Container,
    ButtonGroup,
    TextField,
    TextareaAutosize,
    Paper,
 } from '@mui/material';
 import { Flip, toast } from 'react-toastify';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { setInputtersAction } from '../../../../store/actions/scheduleAction';
import InputtersTable from "../../../TableComponent/InputtersTable";
import './Schedule.css';

// const styleInputterMasterModalContent = {
//     position: 'absolute',
//     top: '100px',
//     left: '50%',
//     transform: 'translateX(-50%)',
//     width: '70%',
//     height: '620px',
//     bgcolor: 'background.paper',
//     border: '4px solid rgb(215, 208, 197)',
//     borderRadius: '8px',
//     boxShadow: 24,
//     pb: 1,
//     overflow: "auto",
// };

export default function InputterMasterModal(props) {
    const dispatch = useDispatch();
    const { inputters } = useSelector(({scheduleStore})=>scheduleStore);

    const [ doubleClickedInputterId, setDoubleClickedInputterId ] = useState(-1);

    const [ inputterName, setInputterName ] = useState('');
    const [ inputterMemo, setInputterMemo ] = useState('');

    const handleCloseModal = () => {
        setDoubleClickedInputterId(-1);
        setInputterName('');
        setInputterMemo('');
        props.handleClose();
    }

    useEffect(()=>{
        getInputters();
    }, []);

    const getInputters = () => {
        axios
        .get('/api/getInputters')
        .then((res)=>{
            dispatch(setInputtersAction(res.data));
        });
    }

    const onRegistInputter = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            inputter_name: formData.get('inputter_name'),
            inputter_memo: formData.get('inputter_memo'),
        };

        if(inputters.find((item)=>item.inputter_name==Info.inputter_name) != undefined) {
            toast.error('同じ名前が存在します。');
            return;
        }

        if(confirm('入力者を登録しますか？') == true) {
            axios
                .post('/api/registInputter', Info)
                .then(res=>{
                    toast.success('入力者が成果的に登録されました。', {
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
                    getInputters();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('入力者登録が失敗しました。');
                    }
                });
        } else {
            toast.error('入力者登録がキャンセルされました。');
        }
    }

    const onInputterEdit = (event) => {

        if(doubleClickedInputterId == -1) {
            toast.error('変更する入力者が選択されていません。');
            return;
        }

        const Info = {
            inputterId: doubleClickedInputterId,
            inputter_name: inputterName,
            inputter_memo: inputterMemo,
        };

        // if(inputters.find((item)=>item.inputter_name==Info.inputter_name) != undefined) {
        //     toast.error('同じ名前が存在します。');
        //     return;
        // }

        if(confirm('入力者情報を変更しますか？') == true) {
            axios
                .post('/api/editInputter', Info)
                .then(res=>{
                    toast.success('入力者情報が変更されました。', {
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
                    getInputters();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('入力者情報の変更が失敗しました。');
                    }
                });
        } else {
            toast.error('入力者情報の変更がキャンセルされました。');
        }
    }

    const onInputterDelete = (event) => {
        if(doubleClickedInputterId == -1) {
            toast.error('削除する入力者を選択する必要があります。');
            return;
        }

        if(confirm('入力者を削除しますか？') == true) {
            axios
                .post('/api/deleteInputter', {inputterId: doubleClickedInputterId})
                .then(res=>{
                    toast.success('入力者が削除されました。', {
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
                    getInputters();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('入力者の削除が失敗しました。');
                    }
                });
        } else {
            toast.error('入力者削除がキャンセルされました。');
        }
    }

    const doubleRowClickhandler = (inputter_id, inputter_name, inputter_memo) => {
        setDoubleClickedInputterId(inputter_id);
        setInputterName(inputter_name);
        setInputterMemo(inputter_memo);
    }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <Box className="styleInputterMasterModalContent">
            <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>入力者マスター</Typography>
                    <Button onClick={handleCloseModal}><CancelPresentationRoundedIcon style={{ color: 'white', fontSize: '48px' }} /></Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth={'md'}>
                <Box component={'form'} onSubmit={onRegistInputter} sx={{mt: 8}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="inputter_name"
                        name="inputter_name"
                        label="入力者名"
                        placeholder="入力者名"
                        variant={'outlined'}
                        value={inputterName}
                        onChange={e => setInputterName(e.target.value)}
                    />
                    <TextareaAutosize
                        id="inputter_memo"
                        name='inputter_memo'
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
                        value={inputterMemo}
                        onChange={e => setInputterMemo(e.target.value)}
                    />

                    <ButtonGroup style={{marginTop: '30px'}} fullWidth variant="outlined" aria-label="outlined button group">
                        <Button
                            size="large"
                            variant="outlined"
                            color={'success'}
                            type={"submit"}
                        >
                            登録
                        </Button>

                        <Button
                            size="large"
                            variant="outlined"
                            color="secondary"
                            onClick={onInputterEdit}
                        >
                            編集
                        </Button>

                        <Button
                            size="large"
                            variant="outlined"
                            color="error"
                            onClick={onInputterDelete}
                        >
                            削除
                        </Button>
                    </ButtonGroup>
                </Box>

                <Box sx={{mt: 10, mb: 10}}>
                    <Paper>
                        <InputtersTable data={inputters} doubleClick={doubleRowClickhandler} title='入力者テーブル' />
                    </Paper>
                </Box>
            </Container>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}