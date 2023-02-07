import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import {
    AppBar,
    Container,
    Box,
    CssBaseline,
    Toolbar,
    Typography,
    Grid,
    Menu,
    MenuItem,
    Fade,
    Button
} from "@mui/material";
import user from "../../Models/user";
import LogoutButton from "./LogoutButton/LogoutButton";
import './MainLayout.css';

function MainLayout({children, title, partTitle, isShowPartTitle}) {
    const history = useHistory();

    const [btn_openMenu, setBtnOpenMenuElmnt] = useState(null);
    const [btn_openTherapist, setBtnOpenTherapistElmnt] = useState(null);
    const [btn_openMaster, setBtnOpenMasterElmnt] = useState(null);
    const [btn_openLog, setBtnOpenLogElmnt] = useState(null);

    const openMenu = Boolean(btn_openMenu);
    const openTherapist = Boolean(btn_openTherapist);
    const openMaster = Boolean(btn_openMaster);
    const openLog = Boolean(btn_openLog);

    const btnOpenMenuClick = (event) => {
        setBtnOpenMenuElmnt(event.currentTarget);
    };
    const btnOpenTherapistClick = (event) => {
        setBtnOpenTherapistElmnt(event.currentTarget);
    }
    const btnOpenMasterClick = (event) => {
        setBtnOpenMasterElmnt(event.currentTarget);
    }
    const btnOpenLogClick = (event) => {
        setBtnOpenLogElmnt(event.currentTarget);
    }

    const onGoReservationMgr = () => {
        history.push('/app/reservemgr');
        setBtnOpenMenuElmnt(null);
    };
    const onGoCustomerMgr = () => {
        history.push('/app/customermgr');
        setBtnOpenMenuElmnt(null);
    };
    const onGoSalesMgr = () => {
        history.push('/app/salesmgr/');
        setBtnOpenMenuElmnt(null);
    };    
    const onGoDailyReport = () => {
        history.push('/app/dailyreport/');
        setBtnOpenMenuElmnt(null);
    };
    const onGoStaffSchedule = () => {
        history.push('/app/staff_schedule/');
        setBtnOpenMenuElmnt(null);
    };

    const onGoTherapistMgr = () => {
        history.push('/app/therapistmanagement/');
        setBtnOpenTherapistElmnt(null);
    }
    const onGoRegistServices = () => {
        history.push('/app/therapistservice/');
        setBtnOpenTherapistElmnt(null);
    }
    const onGoShiftSetting = () => {
        history.push('/app/therapistshift/');
        setBtnOpenTherapistElmnt(null);
    }

    const onCustomerRegistration = () => {
        history.push('/app/customermaster');
        setBtnOpenMasterElmnt(null);
    }
    const onStoreRegistration = () => {
        history.push('/app/storemaster');
        setBtnOpenMasterElmnt(null);
    }
    const onTherapistRegistration = () => {
        history.push('/app/therapistmaster');
        setBtnOpenMasterElmnt(null);
    }
    const onDetailedAccountingRegistration = () => {
        history.push('/app/accountmaster_course');
        setBtnOpenMasterElmnt(null);
    }
    const onReferrerRegistration = () => {
        history.push('/app/referrermaster/');
        setBtnOpenMasterElmnt(null);
    }
    const onAdministratorRegistration = () => {
        history.push('/app/usermaster/');
        setBtnOpenMasterElmnt(null);
    }

    const onGoRegistChangeHistoryLog = () => {
        setBtnOpenLogElmnt(null);
    }
    
    const openMenuClose = () => {
        setBtnOpenMenuElmnt(null);
    };
    const openTherapistClose = () => {
        setBtnOpenTherapistElmnt(null);
    };
    const openMasterClose = () => {
        setBtnOpenMasterElmnt(null);
    }
    const openLogClose = () => {
        setBtnOpenLogElmnt(null);
    }

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar className="header-style" position={"static"}>
                <Toolbar>
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            <Typography
                                className="header-title"
                                variant={"h6"}
                                component={"div"}
                                // sx={{flexGrow: 1}}
                            >
                                {title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography className="login-username" variant="h5">ログイン者 : <span>{user.name}</span></Typography>
                        </Grid>
                        <Grid item>
                            <LogoutButton/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Grid className="nav-bar" container justifyContent={'space-evenly'}>
                <Grid item>
                    <Button
                        id="openMenu-button"
                        aria-controls={openMenu ? "openMenu-content" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? "true" : undefined}
                        onClick={btnOpenMenuClick}
                        style={{color: 'white', lineHeight: '0'}}
                    >
                        <h3 style={{paddingTop: '4px', paddingBottom: '4px'}}>メニュー</h3>
                    </Button>
                    <Menu
                        id="openMenu-content"
                        className="menu-content"
                        MenuListProps={{
                          "aria-labelledby": "openMenu-button"
                        }}
                        anchorEl={btn_openMenu}
                        open={openMenu}
                        onClose={openMenuClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoReservationMgr}>予約管理</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoCustomerMgr}>顧客管理</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoSalesMgr}>売上管理</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoDailyReport}>日報</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoStaffSchedule}>スタッフスケジュール</MenuItem>
                    </Menu>
                </Grid>
                <Grid item>
                    <Button
                        id="openTherapist-button"
                        aria-controls={openTherapist ? "openTherapist-content" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openTherapist ? "true" : undefined}
                        onClick={btnOpenTherapistClick}
                        style={{color: 'white', lineHeight: '0'}}
                    >
                        <h3 style={{paddingTop: '4px', paddingBottom: '4px'}}>セラピスト</h3>
                    </Button>
                    <Menu
                        id="openTherapist-content"
                        className="menu-content"
                        MenuListProps={{
                          "aria-labelledby": "openTherapist-button"
                        }}
                        anchorEl={btn_openTherapist}
                        open={openTherapist}
                        onClose={openTherapistClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoTherapistMgr}>セラピスト管理</MenuItem>
                        {/* <MenuItem style={{color: '#EDB24B'}} onClick={onGoRegistServices}>セラピストのサービス登録</MenuItem> */}
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoShiftSetting}>セラピストのシフト設定</MenuItem>
                    </Menu>
                </Grid>
                <Grid item>
                    <Button
                        id="openMaster-button"
                        aria-controls={openMaster ? "openMaster-content" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMaster ? "true" : undefined}
                        onClick={btnOpenMasterClick}
                        style={{color: 'white', lineHeight: '0'}}
                    >
                        <h3 style={{paddingTop: '4px', paddingBottom: '4px'}}>マスター登録</h3>
                    </Button>
                    <Menu
                        id="openMaster-content"
                        className="menu-content"
                        MenuListProps={{
                          "aria-labelledby": "openMaster-button"
                        }}
                        anchorEl={btn_openMaster}
                        open={openMaster}
                        onClose={openMasterClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem style={{color: '#EDB24B'}} onClick={onCustomerRegistration}>顧客登録</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onStoreRegistration}>店舗登録</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onTherapistRegistration}>セラピスト登録</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onDetailedAccountingRegistration}>経理に関わる詳細登録</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onReferrerRegistration}>紹介者登録</MenuItem>
                        <MenuItem style={{color: '#EDB24B'}} onClick={onAdministratorRegistration}>管理者登録</MenuItem>
                    </Menu>
                </Grid>
                <Grid item>
                    <Button
                        id="openLog-button"
                        aria-controls={openLog ? "openLog-content" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openLog ? "true" : undefined}
                        onClick={btnOpenLogClick}
                        style={{color: 'white', lineHeight: '0'}}
                    >
                        <h3 style={{paddingTop: '4px', paddingBottom: '4px'}}>ログ</h3>
                    </Button>
                    <Menu
                        id="openLog-content"
                        className="menu-content"
                        MenuListProps={{
                          "aria-labelledby": "openLog-button"
                        }}
                        anchorEl={btn_openLog}
                        open={openLog}
                        onClose={openLogClose}
                        TransitionComponent={Fade}
                    >
                        <MenuItem style={{color: '#EDB24B'}} onClick={onGoRegistChangeHistoryLog}>登録・変更履歴のログ</MenuItem>
                    </Menu>
                </Grid>
            </Grid>

            {isShowPartTitle && 
                <Container maxWidth='md' sx={{
                    mt: {xs: 2, md: 5}
                }}>
                    <Typography sx={{ 
                        top: '104px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                        lineHeight: '24px',
                        fontSize: {xs: '20px', md: '28px'},
                        letterSpacing: '3px',
                        color: '#fff',
                        textShadow: '4px 5px 6px #000',
                        margin: '16px 0px',
                        textDecoration: 'none',
                        width: '100%',
                        paddingBottom: '15px',
                        borderBottom: '2px solid white',
                        // boxShadow: '4px 5px 6px #000'
                    }}>
                        {partTitle}
                    </Typography>
                </Container>
            }

            {children}
        </React.Fragment>
    )
}

export default MainLayout
