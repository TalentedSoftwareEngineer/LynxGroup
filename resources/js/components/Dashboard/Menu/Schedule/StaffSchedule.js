import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    Grid, 
    Paper, 
    Typography,
    Backdrop,
    Box,
    Container,
    Modal,
    Fade,
    Button,
    AppBar,
    Toolbar,
    TextField,
    Stack,
    MenuItem,
    FormControl,
    InputAdornment,
    OutlinedInput,
    Input,
    InputLabel,
    TextareaAutosize,
    ButtonGroup,
    FormControlLabel,
    Switch
} from "@mui/material";
import MainLayout from "../../../MainLayout/MainLayout";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'moment/locale/ja';
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import { Flip, toast } from 'react-toastify';
import InputterMasterModal from "./InputterMasterModal";
import GenreMasterModal from "./GenreMasterModal";
import { setInputtersAction, setGenresAction, setSchedulesAction } from '../../../../store/actions/scheduleAction';
import { plusDate, plusHour, setToGivenTime } from '../../../../service/common';
import { CalendarEvent } from './CalendarEvent';
import './Schedule.css';

const localizer = momentLocalizer(moment);

// const styleModalContent = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '60%',
//   bgcolor: 'background.paper',
//   border: '5px solid rgb(215, 208, 197)',
//   borderRadius: '10px',
//   boxShadow: 24,
//   p: 0,
//   pb: 6,
//   overflow: "auto",
// };

function createEventsData(id, title, start, end, notes) {
    return {
        id,
        title,
        start,
        end,
        notes,
    };
}

var events = [];

function StaffSchedule() {
    const dispatch = useDispatch();
    const { inputters, genres, schedules } = useSelector(({scheduleStore})=>scheduleStore);

    const [selectedScheduleEventId, setSelectedScheduleEventId] = useState(-1);

    const [ scheduleTitle, setScheduleTitle ] = useState('');
    const [flagAllDay, setFlagAllDay] = useState(true);
    const [allDayTime, setAllDayTime] = useState(new Date());
    const [ startScheduleTime, setStartScheduleTime ] = useState(new Date());
    const [ endScheduleTime, setEndScheduleTime ] = useState(new Date());
    const [inputter, setInputter] = useState('');
    const [genre, setGenre] = useState('');
    const [ notificationTime, setNotificationTime ] = useState('');
    const [ scheduleMemo, setScheduleMemo ] = useState('');

    const [selectedSlots, setSelectedSlots] = useState({
        box: {},
        end: new Date(),
        slots: [],
        start: new Date(),
    });

    const [openScheduleModal, setOpenScheduleModal] = React.useState(false);
    const handleScheduleModalOpen = () => setOpenScheduleModal(true);
    const handleScheduleModalClose = () => {
        setOpenScheduleModal(false);

        setSelectedScheduleEventId(-1);
        setScheduleTitle('');
        setFlagAllDay(true);
        setAllDayTime(new Date());
        setStartScheduleTime(new Date());
        setEndScheduleTime(new Date());
        setInputter('');
        setGenre('');
        setNotificationTime('');
        setScheduleMemo('');
    };

    const [openInputterMasterModal, setOpenInputterMasterModal] = React.useState(false);
    const handleOpenInputterMasterModal = () => setOpenInputterMasterModal(true);
    const handleCloseInputterMasterModal = () => setOpenInputterMasterModal(false);

    const [openGenreMasterModal, setOpenGenreMasterModal] = React.useState(false);
    const handleOpenGenreMasterModal = () => setOpenGenreMasterModal(true);
    const handleCloseGenreMasterModal = () => setOpenGenreMasterModal(false);

    const [ flag_selectedEvent, setFlagSelectedEvent ] = useState(false);

    useEffect(()=>{
        getInputters();
        getGenres();
        getSchedules();
    }, []);

    events = schedules.map((item, index)=>{
        return createEventsData(
            item.id, 
            item.schedule_title,
            new Date(item.schedule_fromTime),
            new Date(item.schedule_toTime),
            item.schedule_memo
        );
    });

    const onSlotSelect = (e) => {
        setSelectedSlots(prev=>({
            ...prev,
            ...e,
        }));

        setAllDayTime(e.start);
        setStartScheduleTime(e.start);
        setEndScheduleTime(e.end);

        setFlagSelectedEvent(false);
        handleScheduleModalOpen();
    }

    const onEventSelect = (e) => {
        
        let selectedEvent = schedules.find((item)=> item.id == e.id);

        setSelectedScheduleEventId(e.id);
        setScheduleTitle(e.title);
        setFlagAllDay(isAllDay(e.start, e.end));
        setAllDayTime(setToGivenTime(e.start, 0, 0));
        setStartScheduleTime(e.start);
        setEndScheduleTime(e.end);
        setInputter(selectedEvent.schedule_inputter);
        setGenre(selectedEvent.schedule_genre);
        setNotificationTime(selectedEvent.schedule_notificationTime == null ? '' : selectedEvent.schedule_notificationTime);
        setScheduleMemo(e.notes);

        setFlagSelectedEvent(true);
        handleScheduleModalOpen();
    }

    const onViewChange = (e) => {
        
    }

    const isAllDay = (start, end) => {
        return new Date(end).getTime() - new Date(start).getTime() > 3600000;
    }

    const onScheduleSave = (event) => {

        const Info = {
            schedule_title: scheduleTitle,
            schedule_fromTime: flagAllDay ? moment(new Date(allDayTime)).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date(startScheduleTime)).format('YYYY-MM-DDTHH:mm:ss'),
            schedule_toTime: flagAllDay ? moment(plusDate(allDayTime, 1)).format('YYYY-MM-DDTHH:mm:ss') : moment(plusHour(new Date(startScheduleTime), 1)).format('YYYY-MM-DDTHH:mm:ss'),
            schedule_inputter: inputter,
            schedule_genre: genre,
            schedule_notificationTime: notificationTime,
            schedule_staff_email: '',
            schedule_memo: scheduleMemo,
        };

        if(confirm('スケジュール内容を保存しますか？') == true) {
            axios
                .post('/api/registSchedule', Info)
                .then(res=>{
                    toast.success('スケジュール内容が保存されました。', {
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
                    getSchedules();
                    handleScheduleModalClose();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('スケジュール内容の保存に失敗しました。');
                    }
                });
        } else {
            toast.error('スケジュール内容の保存がキャンセルされました。');
        }
    }

    const onScheduleEdit = (event) => {
        let Info = {
            scheduleId: selectedScheduleEventId,
            schedule_title: scheduleTitle,
            schedule_fromTime: flagAllDay ? moment(new Date(allDayTime)).format('YYYY-MM-DDTHH:mm:ss') : moment(new Date(startScheduleTime)).format('YYYY-MM-DDTHH:mm:ss'),
            schedule_toTime: flagAllDay ? moment(plusDate(allDayTime, 1)).format('YYYY-MM-DDTHH:mm:ss') : moment(plusHour(new Date(startScheduleTime), 1)).format('YYYY-MM-DDTHH:mm:ss'),
            schedule_inputter: inputter,
            schedule_genre: genre,
            schedule_notificationTime: notificationTime,
            schedule_staff_email: '',
            schedule_memo: scheduleMemo,
        };

        if(confirm('スケジュールを変更しますか？') == true) {
            axios
                .post('/api/editSchedule', Info)
                .then(res=>{
                    toast.success('スケジュールが変更されました。', {
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
                    getSchedules();
                    handleScheduleModalClose();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('スケジュール変更が失敗しました。');
                    }
                });
        } else {
            toast.error('スケジュール変更がキャンセルされました。');
        }
    }

    const onScheduleDelete = (event) => {
        if(confirm('スケジュールを削除しますか？') == true) {
            axios
                .post('/api/deleteSchedule', {scheduleId: selectedScheduleEventId})
                .then(res=>{
                    toast.success('スケジュールが削除されました。', {
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
                    getSchedules();
                    handleScheduleModalClose();
                })
                .catch(error=>{
                    if(error) {
                        toast.error('スケジュール削除が失敗しました。');
                    }
                });
        }
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {

        let styledScheduleEventGenre = schedules.find((item)=>item.id==event.id).schedule_genre;
        let bgColorEvent = '#ff8080';
        if(styledScheduleEventGenre != null) {
            if(genres.find((item)=>item.genre_name==styledScheduleEventGenre) != undefined) {
                bgColorEvent = genres.find((item)=>item.genre_name==styledScheduleEventGenre).genre_color;
            } else {
                bgColorEvent = '#4dff88';
            }
        }

        // event styling changing colors from blue to gray depending if the logged user created the event or not
        const style = {
          maxWidth: '250px',
          backgroundColor: isAllDay(event.start, event.end) ? bgColorEvent : 'transparent',
          color: isAllDay(event.start, event.end) ? 'white' : 'black',
          border: isAllDay(event.start, event.end) ? 'none' : '1px solid ' + bgColorEvent,
          borderLeft: isAllDay(event.start, event.end) ? 'none' : '7px solid ' + bgColorEvent,
          borderRadius: '3px',
          opacity: 0.8,
          display: 'block',
        }
    
          return {
            style
          }
    };

    const customDayPropGetter = (date) => {
        if (date.getDay() == 0 || date.getDay() == 6)
        {
            return {
                className: date.getDay() == 0 ? 'sunday_backgroundColor' : 'saturday_backgroundColor',
                style: {
                    // border: 'solid 3px ' + (date.getDay() == 0 ? '#faa' : '#afa'),
                },
            }
        } else {
            return {};
        }
    }

    const customSlotPropGetter = (date) => {
        if (date.getDay() == 0 || date.getDay() == 6)
        {
            return {
                className: date.getDay() == 0 ? 'sunday_backgroundColor' : 'saturday_backgroundColor',
                style: {
                    // border: 'solid 3px ' + (date.getDay() == 0 ? '#faa' : '#afa'),
                },
            }
        } else {
            return {};
        }
    }

    const getInputters = async () => {
        const res = await axios.get('/api/getInputters');
        dispatch(setInputtersAction(res.data));
    }

    const getGenres = async () => {
        const res = await axios.get('/api/getGenres');
        dispatch(setGenresAction(res.data));
    }

    const getSchedules = async () => {
        const res = await axios.get('/api/getSchedules');
        dispatch(setSchedulesAction(res.data));
    }

    const formats = useMemo(() => ({
        // the 'date' on each day cell of the 'month' view
        dateFormat: 'DD日',      
        // the day of the week header in the 'month' view
        weekdayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd', culture),
        // the day header in the 'week' and 'day' (Time Grid) views
        dayFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd DD日', culture),
        dayHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, 'dddd MM月 DD日', culture),
        monthHeaderFormat: (date, culture, localizer) =>
          localizer.format(date, `YYYY年 MM月`, culture),
        // the time in the gutter in the Time Grid views
        timeGutterFormat: (date, culture, localizer) =>
          localizer.format(date, 'hh:mm a', culture),
      }), []);

    return (
        <MainLayout title={"LynxGroup"} partTitle={'スタッフスケジュール'} isShowPartTitle={true}>
            <Box className={'calendar_container'}>
                <Paper className="calendar_paper_container" sx={{mt: {xs: 3, md: 10}, mb: 10, pt: 8, pb: 8}}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        eventPropGetter={eventStyleGetter}
                        dayPropGetter={customDayPropGetter}
                        slotPropGetter={customSlotPropGetter}
                        onSelectEvent={onEventSelect}
                        onSelectSlot={onSlotSelect}
                        selectable={true}
                        onView={onViewChange}
                        views={["month", "week", "day", /*"agenda"*/]}
                        timeslots={2}
                        defaultView="month"
                        defaultDate={new Date()}
                        popup
                        style={{ height: 800 }}
                        culture={'ja'}
                        messages={{
                            week: '週別',
                            work_week: '仕事の週',
                            day: '日別',
                            month: '月別',
                            previous: '前',
                            next: '次',
                            today: '今日',
                            agenda: '案件',
                            noEventsInRange: 'スケジュールがない',
                        
                            showMore: (total) => `+${total}`,
                        }}
                        formats={formats}
                        components={{
                            event: CalendarEvent
                        }}
                    />
                </Paper>
            </Box>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openScheduleModal}
                onClose={handleScheduleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={openScheduleModal}>
                    <Box className="styleModalContent" /* sx={styleModalContent} */>
                        {/* <Typography id="transition-modal-title" variant="h5" component="h2">
                            {moment(selectedSlots.start).format('YYYY年M月D日 H時m分') + ' ~ ' + moment(selectedSlots.end).format('YYYY年M月D日 H時m分') + ' スタッフスケジュール'}
                        </Typography> */}
                        <AppBar position="static" sx={{ backgroundColor: 'rgb(136, 160, 185)' }}>
                            <Toolbar>
                                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>スタッフスケジュール</Typography>
                                <Button onClick={handleScheduleModalClose}><CancelPresentationRoundedIcon style={{ color: 'white', fontSize: '48px' }} /></Button>
                            </Toolbar>
                        </AppBar>

                        <Container maxWidth={'md'} sx={{mt: 2, display: {xs: 'none', md: 'block'}}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="schedule_title"
                                name="schedule_title"
                                label="タイトル"
                                placeholder="タイトル"
                                variant="outlined"
                                value={scheduleTitle}
                                onChange={e => setScheduleTitle(e.target.value)}
                            />
                            <Stack direction={'row'} spacing={2} sx={{mt: 2}} justifyContent={'flex-start'}>
                                <FormControlLabel
                                    value="bottom"
                                    control={
                                        <Switch 
                                            color="primary"
                                            checked={flagAllDay}
                                            onChange={e=> setFlagAllDay(event.target.checked)}
                                         />
                                    }
                                    label={'終日'}
                                    labelPlacement="bottom"
                                />

                                {/* {flagAllDay &&
                                    <Typography
                                        component={'p'}
                                        sx={{
                                            fontSize: '18px',
                                            letterSpacing: '3px',
                                            color: 'grey',
                                            textShadow: '4px 5px 6px #fff',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {
                                            moment(new Date(allDayTime)).format('YYYY年MM月DD日 HH時mm分')
                                            + ' ~ '
                                            + moment(plusDate(allDayTime, 1)).format('YYYY年MM月DD日 HH時mm分')
                                        }
                                    </Typography>
                                } */}

                                {!flagAllDay &&
                                    <DateTimePicker
                                        inputFormat="YYYY年MM月DD日 HH時mm分"
                                        className="schedule-time"
                                        renderInput={(params) => <TextField variant="outlined" {...params} />}
                                        label="スケジュール時間"
                                        value={startScheduleTime}
                                        minutesStep={10}
                                        onChange={(newValue) => {
                                            setStartScheduleTime(newValue);
                                        }}
                                    />
                                }

                                {/* <Typography sx={{ fontSize: '18px', mt: 0 }}>~</Typography>
                                <DateTimePicker
                                    renderInput={(params) => <TextField variant="outlined" {...params} />}
                                    label="終了時間"
                                    value={endScheduleTime}
                                    minutesStep={5}
                                    onChange={(newValue) => {
                                        setEndScheduleTime(newValue);
                                    }}
                                /> */}
                            </Stack>
                            
                            <Stack direction={'row'} sx={{mt: 2}} spacing={3}>
                                <TextField
                                    id='inputter'
                                    name='inputter'
                                    label='入力者'
                                    select
                                    fullWidth
                                    variant="outlined"
                                    sx={{flexGrow: 1}}
                                    value={inputter}
                                    onChange={e => setInputter(e.target.value)}
                                >
                                    {inputters.map((option, index) => (
                                        <MenuItem key={index} value={option.inputter_name}>
                                            {option.inputter_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    color={'success'}
                                    variant="outlined" 
                                    size="medium"  
                                    onClick={handleOpenInputterMasterModal}
                                >
                                    <AddToPhotosOutlinedIcon />
                                </Button>
                            </Stack>
                            
                            <Stack direction={'row'} sx={{mt: 2}} spacing={3}>
                                <TextField
                                    id='genre'
                                    name='genre'
                                    label='ジャンル'
                                    select
                                    fullWidth
                                    variant="outlined"
                                    sx={{flexGrow: 1}}
                                    value={genre}
                                    onChange={e => setGenre(e.target.value)}
                                >
                                    {genres.map((option, index) => (
                                        <MenuItem key={index} value={option.genre_name}>
                                            {option.genre_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    color={'success'}
                                    variant="outlined" 
                                    size="medium"  
                                    onClick={handleOpenGenreMasterModal}
                                >
                                    <AddToPhotosOutlinedIcon />
                                </Button>
                            </Stack>

                            <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
                                <InputLabel htmlFor="notification_time">お知らせ</InputLabel>
                                <OutlinedInput
                                    id="notification_time"
                                    name='notification_time'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">分前</InputAdornment>}
                                    inputProps={{
                                    'aria-label': 'お知らせ',
                                    }}
                                    label='お知らせ'
                                    placeholder="なし"
                                    value={notificationTime}
                                    onChange={e => setNotificationTime(e.target.value)}
                                />
                            </FormControl>

                            <TextareaAutosize
                                id="schedule_memo"
                                name='schedule_memo'
                                aria-label="minimum height"
                                maxRows={3}
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
                                value={scheduleMemo}
                                onChange={e => setScheduleMemo(e.target.value)}
                            />

                            {!flag_selectedEvent &&
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    color="success"
                                    sx={{ mt: 5 }}
                                    onClick={onScheduleSave}
                                >
                                    スケジュール確定
                                </Button>
                            }

                            {flag_selectedEvent &&
                                <ButtonGroup sx={{mt: 5}} fullWidth variant="outlined" aria-label="outlined button group">
                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={onScheduleEdit}
                                    >
                                        編集
                                    </Button>

                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="error"
                                        onClick={onScheduleDelete}
                                    >
                                        削除
                                    </Button>
                                </ButtonGroup>
                            }
                        </Container>

                        <Container maxWidth={'md'} sx={{mt: 1, display: {xs: 'block', md: 'none'}}}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="schedule_title"
                                name="schedule_title"
                                label="タイトル"
                                placeholder="タイトル"
                                variant="standard"
                                style={{fontSize: '12px'}}
                                value={scheduleTitle}
                                onChange={e => setScheduleTitle(e.target.value)}
                            />
                            <Stack direction={'row'} spacing={2} sx={{mt: 1}} justifyContent={'flex-start'}>
                                <FormControlLabel
                                    style={{fontSize: '12px'}}
                                    value="start"
                                    control={
                                        <Switch 
                                            color="primary"
                                            checked={flagAllDay}
                                            onChange={e=> setFlagAllDay(event.target.checked)}
                                         />
                                    }
                                    label={'終日'}
                                    labelPlacement="start"
                                />

                                {!flagAllDay &&
                                    <DateTimePicker
                                        inputFormat="YYYY年MM月DD日 HH時mm分"
                                        className="schedule-time"
                                        renderInput={(params) => <TextField sx={{fontSize: '12px'}} variant="standard" {...params} />}
                                        value={startScheduleTime}
                                        minutesStep={10}
                                        onChange={(newValue) => {
                                            setStartScheduleTime(newValue);
                                        }}
                                    />
                                }
                            </Stack>
                            
                            <Stack direction={'row'} sx={{mt: 1}} spacing={3}>
                                <TextField
                                    id='inputter'
                                    name='inputter'
                                    label='入力者'
                                    select
                                    fullWidth
                                    variant="standard"
                                    sx={{flexGrow: 1, fontSize: '12px'}}
                                    value={inputter}
                                    onChange={e => setInputter(e.target.value)}
                                >
                                    {inputters.map((option, index) => (
                                        <MenuItem key={index} value={option.inputter_name}>
                                            {option.inputter_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    color={'success'}
                                    variant="standard" 
                                    size="medium"  
                                    onClick={handleOpenInputterMasterModal}
                                >
                                    <AddToPhotosOutlinedIcon />
                                </Button>
                            </Stack>
                            
                            <Stack direction={'row'} sx={{mt: 1}} spacing={3}>
                                <TextField
                                    id='genre'
                                    name='genre'
                                    label='ジャンル'
                                    select
                                    fullWidth
                                    variant="standard"
                                    sx={{flexGrow: 1, fontSize: '12px'}}
                                    value={genre}
                                    onChange={e => setGenre(e.target.value)}
                                >
                                    {genres.map((option, index) => (
                                        <MenuItem key={index} value={option.genre_name}>
                                            {option.genre_name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button
                                    color={'success'}
                                    variant="standard" 
                                    size="medium"  
                                    onClick={handleOpenGenreMasterModal}
                                >
                                    <AddToPhotosOutlinedIcon />
                                </Button>
                            </Stack>

                            <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
                                <InputLabel htmlFor="notification_time">お知らせ</InputLabel>
                                <Input
                                    id="notification_time"
                                    name='notification_time'
                                    type="number"
                                    endAdornment={<InputAdornment position="end">分前</InputAdornment>}
                                    inputProps={{
                                    'aria-label': 'お知らせ',
                                    }}
                                    label='お知らせ'
                                    placeholder="なし"
                                    sx={{fontSize: '12px'}}
                                    value={notificationTime}
                                    onChange={e => setNotificationTime(e.target.value)}
                                />
                            </FormControl>

                            <TextareaAutosize
                                id="schedule_memo"
                                name='schedule_memo'
                                aria-label="minimum height"
                                maxRows={3}
                                label="メモ"
                                placeholder="メモ"
                                style={{
                                    backgroundColor: "transparent",
                                    width: '100%',
                                    outline: 'none',
                                    marginTop: "20px",
                                    borderRadius: '5px',
                                    fontSize: '12px'
                                }}
                                variant={'standard'}
                                value={scheduleMemo}
                                onChange={e => setScheduleMemo(e.target.value)}
                            />

                            {!flag_selectedEvent &&
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="outlined"
                                    color="success"
                                    sx={{ mt: 1 }}
                                    onClick={onScheduleSave}
                                >
                                    スケジュール確定
                                </Button>
                            }

                            {flag_selectedEvent &&
                                <ButtonGroup sx={{mt: 1}} fullWidth variant="outlined" aria-label="outlined button group">
                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={onScheduleEdit}
                                    >
                                        編集
                                    </Button>

                                    <Button
                                        size="large"
                                        variant="outlined"
                                        color="error"
                                        onClick={onScheduleDelete}
                                    >
                                        削除
                                    </Button>
                                </ButtonGroup>
                            }
                        </Container>
                        <InputterMasterModal open={openInputterMasterModal} handleClose={handleCloseInputterMasterModal} />
                        <GenreMasterModal open={openGenreMasterModal} handleClose={handleCloseGenreMasterModal} />
                    </Box>
                </Fade>
            </Modal>
        </MainLayout>
    )
}

export default StaffSchedule
