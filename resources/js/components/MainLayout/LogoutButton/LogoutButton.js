import React from "react";
import {Button, Box} from "@mui/material";
import user from "../../../Models/user";
import {withRouter} from "react-router-dom";
import '../MainLayout.css';

function LogoutButton({history}) {

    const logout = (e) => {
        e.preventDefault()

        window.axios.post('/api/logout')
            .then(() => {
                //successful response
                user.logout(afterUserDestroyed)
            })
            .catch(() => {
                //handle if something went wrong
                user.logout(afterUserDestroyed)
            })
            .then(() => {
                //this code will be definitely executed
                user.logout(afterUserDestroyed)
            })
    }

    const afterUserDestroyed = () => {
        history.push('/app/login')
    }

    return (
        <React.Fragment>
            <Box component={"form"} onSubmit={logout}>
                <Button className="btn-logout" type={"submit"}>ログアウト</Button>
            </Box>
        </React.Fragment>
    )
}

export default withRouter(LogoutButton)
