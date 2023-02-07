import React from 'react';
import {Suspense} from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./Dashboard/Dashboard";
import {Switch, Route, BrowserRouter} from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {ProtectedRoute} from "./ProtectedRoute/ProtectedRoute";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import StaffSchedule from './Dashboard/Menu/Schedule/StaffSchedule';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {CssBaseline, CircularProgress, Grid } from "@mui/material";
import routes from './routes';
import { store } from '../store/store';
import '../styles/styles.scss';
import 'rc-time-picker/assets/index.css';

const themeBackground = createTheme({
    components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
            //   backgroundColor: "#FAACA8",
              backgroundImage: `radial-gradient(27% 185%, #F9F6F1 0%, #D7D0C5 100%)`,
              backgroundRepeat: "no-repeat",
              backgroundAttachment: "fixed",
            },
          },
        },
    }
});

function App() {
    return (
        <React.Fragment>
            <LocalizationProvider  dateAdapter={AdapterDayjs}>
                <Provider store={store}>
                    <BrowserRouter>
                        <SWRConfig
                            value={{
                                errorRetryCount: 0,
                                revalidateOnFocus: false                        
                            }}
                        >
                            <ThemeProvider theme={themeBackground}>
                                <CssBaseline />
                                <Route path={'/app/login'}>
                                    <Login/>
                                </Route>

                                <Route path={'/app/register'}>
                                    <Signup/>
                                </Route>

                                <Route path={'/app/staff_schedule/'}>
                                    <StaffSchedule/>
                                </Route>

                                <Suspense fallback={
                                    <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        style={{ minHeight: '100vh' }}
                                    >
                                        <Grid item xs={3}>
                                            <CircularProgress color="inherit" />
                                        </Grid>
                                    </Grid>
                                }>
                                    <Switch>
                                        {routes.map(({component, path, exact}, index) => (
                                            <ProtectedRoute
                                                key={index}
                                                path={path}
                                                component={component}
                                                exact={exact}
                                            />
                                        ))}
                                    </Switch>
                                </Suspense>
                            </ThemeProvider>
                        </SWRConfig>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={2000}
                            hideProgressBar
                            style={{ fontSize: 14, fontWeight: 'bold' }}
                            limit={1}
                        />
                    </BrowserRouter>
                </Provider>
            </LocalizationProvider>
        </React.Fragment>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}
