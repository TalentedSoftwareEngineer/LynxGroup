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
import { setGenresAction } from '../../../../store/actions/scheduleAction';
import GenresTable from "../../../TableComponent/GenresTable";
import { Stack } from "@mui/system";
import { ColorPicker } from "material-ui-color";

// const styleGenreMasterModalContent = {
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

export default function GenreMasterModal(props) {
    const dispatch = useDispatch();
    const { genres } = useSelector(({scheduleStore})=>scheduleStore);

    const [ doubleClickedGenreId, setDoubleClickedGenreId ] = useState(-1);

    const [ genreName, setGenreName ] = useState('');
    const [ genreColor, setGenreColor ] = useState('#000');
    const [ genreMemo, setGenreMemo ] = useState('');

    const handleCloseModal = () => {
        setDoubleClickedGenreId(-1);
        setGenreName('');
        setGenreColor('#000');
        setGenreMemo('');
        props.handleClose();
    }

    useEffect(()=>{
        getGenres();
    }, []);

    const getGenres = () => {
        axios
        .get('/api/getGenres')
        .then((res)=>{
            dispatch(setGenresAction(res.data));
        });
    }

    const onRegistGenre = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const Info = {
            genre_name: formData.get('genre_name'),
            genre_color: genreColor,
            genre_memo: formData.get('genre_memo'),
        };

        if(genres.find((item)=>item.genre_name==Info.genre_name) != undefined) {
            toast.error('同じ名前が存在します。');
            return;
        }

        if(confirm('ジャンルを登録しますか？') == true) {
            axios
                .post('/api/registGenre', Info)
                .then(res=>{
                    toast.success('ジャンルが成果的に登録されました。', {
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
                    getGenres();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('ジャンル登録に失敗しました。');
                    }
                });
        } else {
            toast.error('ジャンル登録がキャンセルされました。');
        }
    }

    const onGenreEdit = (event) => {

        if(doubleClickedGenreId == -1) {
            toast.error('変更するジャンルが選択されていません。');
            return;
        }

        const Info = {
            genreId: doubleClickedGenreId,
            genre_name: genreName,
            genre_color: genreColor,
            genre_memo: genreMemo,
        };

        // if(genres.find((item)=>item.genre_name==Info.genre_name) != undefined) {
        //     toast.error('同じ名前が存在します。');
        //     return;
        // }

        if(confirm('ジャンル情報を変更しますか？') == true) {
            axios
                .post('/api/editGenre', Info)
                .then(res=>{
                    toast.success('ジャンル情報が変更されました。', {
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
                    getGenres();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('ジャンルの情報変更に失敗しました。');
                    }
                });
        } else {
            toast.error('ジャンル情報の変更がキャンセルされました。');
        }
    }

    const onGenreDelete = (event) => {
        if(doubleClickedGenreId == -1) {
            toast.error('削除するジャンルを選択する必要があります。');
            return;
        }

        if(confirm('ジャンルを削除しますか？') == true) {
            axios
                .post('/api/deleteGenre', {genreId: doubleClickedGenreId})
                .then(res=>{
                    toast.success('ジャンルが削除されました。', {
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
                    getGenres();
                    handleCloseModal();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('ジャンル削除に失敗しました。');
                    }
                });
        } else {
            toast.error('ジャンル削除がキャンセルされました。');
        }
    }

    const doubleRowClickhandler = (genre_id, genre_name, genre_memo) => {
        setDoubleClickedGenreId(genre_id);
        setGenreName(genre_name);
        setGenreColor(genres.find((item)=>item.id==genre_id).genre_color);
        setGenreMemo(genre_memo);
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
          <Box className="styleGenreMasterModalContent">
            <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>ジャンルマスター</Typography>
                    <Button onClick={handleCloseModal}><CancelPresentationRoundedIcon style={{ color: 'white', fontSize: '48px' }} /></Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth={'md'}>
                <Box component={'form'} onSubmit={onRegistGenre} sx={{mt: 8}}>
                    <Stack direction={'row'} spacing={3}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="genre_name"
                            name="genre_name"
                            label="ジャンル"
                            placeholder="ジャンル"
                            variant={'outlined'}
                            sx={{flexGrow: 1}}
                            value={genreName}
                            onChange={e => setGenreName(e.target.value)}
                        />
                        <ColorPicker 
                            value={genreColor} 
                            onChange={newValue => setGenreColor(newValue.css.backgroundColor)}
                         />
                    </Stack>
                    <TextareaAutosize
                        id="genre_memo"
                        name='genre_memo'
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
                        value={genreMemo}
                        onChange={e => setGenreMemo(e.target.value)}
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
                            onClick={onGenreEdit}
                        >
                            編集
                        </Button>

                        <Button
                            size="large"
                            variant="outlined"
                            color="error"
                            onClick={onGenreDelete}
                        >
                            削除
                        </Button>
                    </ButtonGroup>
                </Box>

                <Box sx={{mt: 10, mb: 10}}>
                    <Paper>
                        <GenresTable data={genres} doubleClick={doubleRowClickhandler} title='ジャンルテーブル' />
                    </Paper>
                </Box>
            </Container>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}