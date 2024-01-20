import { Box, Button, Typography } from "@mui/material";
import authStore from "../stores/authStore";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import noAccess from '../assets/noAccess.png'
import React from "react";
import MiniDrawer from "./components/Drawer";

interface Props {
    children: React.ReactNode
}

export default function RequireAuth(props: Props) {
    const store = authStore();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    useEffect(() => {
        if (store.loggedIn === null) {
            store.checkAuth();
        }
    }, [])
    if (!store.loggedIn ||
        (store.loggedIn && !store.isMaster && currentPath === '/tambah-admin')
    ) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mx="auto"
            >
                <img src={noAccess} alt="noAccess" style={{ width: "50vw"}} />
                <Typography variant="h6" gutterBottom style={{ textTransform: "uppercase", marginBottom: "0px", paddingBottom: "0px", textAlign: "center" }}>
                    No access
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate('/');
                    }}
                    sx={{ p: 2, mt: 2 }}
                >
                    Kembali ke Login
                </Button>
            </Box>
        )
    }
    return <><MiniDrawer isMaster={store.isMaster}>{props.children}</MiniDrawer></>

}