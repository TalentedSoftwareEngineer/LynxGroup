import React from "react";
import {withRouter} from "react-router-dom";
import user from "../../Models/user";

import {
    Box,
    Button,
    Container,
    TextField,
    CssBaseline,
    Typography,
} from "@mui/material";

function Signup({history, location}) {

    const handleSubmit = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);

        const loginCredentials = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            authority: 1
        }

        const authenticatedCallback = () => {
            let {from} = location.state || {from: {pathname: '/app/reservemgr'}}
            history.push(from)
        }

        window.axios.post('/api/signup', loginCredentials).then((response) => {
            user.authenticated(response.data, authenticatedCallback)
        })
    }


    return (
        <Container maxWidth={"xs"}>
            <CssBaseline/>
            <Box                
                sx={{
                    marginTop: 8,
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="ID"
                        name="email"
                        autoComplete="email"
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
                    />
                    <Button type={"submit"} fullWidth>登録</Button>
                </Box>
            </Box>
        </Container>
    )
}

export default withRouter(Signup)
