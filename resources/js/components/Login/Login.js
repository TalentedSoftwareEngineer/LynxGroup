import React from "react";
import {
    Box,
    Button,
    Container,
    TextField,
    CssBaseline,
    Typography,
    ButtonGroup
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import user from "../../Models/user";
import {withRouter} from "react-router-dom";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import './login.css';

function Login({history, location}) {

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        const authenticatedCallback = () => {
            let {from} = location.state || {from: {pathname: '/app/reservemgr'}}
            history.push(from)
        }

        window.axios.post('/api/login', loginCredentials).then((response) => {
            if(response.data.errors) {
                toast.error('認証に失敗しました。');
            } else {
                user.authenticated(response.data, authenticatedCallback);
            }
        })
    }

    return (
        <Container maxWidth={"sm"}>
            <CssBaseline/>
            <Box
                sx={{
                    marginTop: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Typography className="title" component={"h1"} variant={"h5"}>
                    LynxGroup <br></br> 一括管理システム
                </Typography>
                <Box component={"form"} onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="ID"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        defaultValue='Akira'
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        defaultValue='123'
                    />
                    <ButtonGroup style={{marginTop: '50px'}} fullWidth variant="outlined" aria-label="outlined button group">
                        <Button type={"submit"}>ログイン</Button>
                        <Button style={{padding: '0'}}>
                            <Link style={{textDecoration: 'none', color: '#1976d2', width: '100%'}} to={{
                                pathname: "/app/register",
                                // search: "?sort=name",
                                // hash: "#https://api.alat.ng/RegistrationApi/index.html",
                                // state: { fromDashboard: true }
                            }}>新規ユーザー登録</Link>
                        </Button>
                        <Button style={{padding: '0'}}>
                            <Link style={{textDecoration: 'none', color: '#1976d2', width: '100%'}} to={{pathname: "/app/staff_schedule/"}}>
                                <CalendarMonthIcon />
                            </Link>
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Container>
    )
}

export default withRouter(Login)
