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

function AccountLayout({children, title}) {
    const history = useHistory();

    return (
        <React.Fragment>
            <CssBaseline/>

            <Grid 
                container 
                justifyContent={'space-evenly'}
                sx={{
                    marginTop: '40px'
                }}
            >
                {/* <Grid item>
                    <Button
                         variant="outlined"
                         sx={{
                            border: '1px solid #fff',
                            color: 'white',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #000'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_menu/')}}
                    >コース(メニュー表記)</Button>
                </Grid> */}
                <Grid item>
                    <Button
                         variant="outlined"
                         sx={{
                            border: '1px solid #fff',
                            color: '#1c3a82',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #686767'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_course/')}}
                    >コース登録</Button>
                </Grid>
                <Grid item>
                    <Button
                         variant="outlined"
                         sx={{
                            border: '1px solid #fff',
                            color: '#1c3a82',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #686767'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_assign/')}}
                    >指名</Button>
                </Grid>
                <Grid item>
                    <Button
                         variant="outlined"
                         sx={{
                            border: '1px solid #fff',
                            color: '#1c3a82',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #686767'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_option/')}}
                    >オプション</Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        sx={{
                            border: '1px solid #fff',
                            color: '#1c3a82',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #686767'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_payment/')}}
                    >支払方法</Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        sx={{
                            border: '1px solid #fff',
                            color: '#1c3a82',
                            textShadow: '4px 5px 6px #000',
                            "&:hover": {
                                color: 'grey',
                                textShadow: '4px 5px 6px #fff',
                                border: '1px solid #fff',
                            },
                         }}
                         style={{
                            boxShadow: '6px 8px 15px #686767'
                         }}
                        onClick={e=>{history.push('/app/accountmaster_extend/')}}
                    >延長</Button>
                </Grid>
            </Grid>

            <Container maxWidth='md' sx={{
                marginTop: '45px'
            }}>
                <Typography sx={{ 
                    top: '104px',
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    lineHeight: '24px',
                    fontSize: '28px',
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
                    {title}
                </Typography>
            </Container>

            {children}
        </React.Fragment>
    )
}

export default AccountLayout
