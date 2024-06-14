import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import SignUp from "./SignUp";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import GoogleCallback from "./GoogleCallback";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright ©"}
            fsoftwareengineer, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

class AppRouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/callback" element={<GoogleCallback />} />
                        <Route path="/" element={<App />} />
                    </Routes>
                </div>
                <div>
                    <Box mt={10}>
                        <Copyright />
                    </Box>
                </div>
            </BrowserRouter>
        );
    }
}

export default AppRouter;
