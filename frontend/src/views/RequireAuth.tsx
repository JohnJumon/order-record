import { Box, Button, Typography } from "@mui/material";
import authStore from "../stores/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import noAccess from '../assets/noAccess.png'

interface Props {
    children: React.ReactNode
}

export default function RequireAuth(props: Props) {
    const store = authStore();
    const navigate = useNavigate();
    useEffect(() => {
        if (store.loggedIn === null) {
            store.checkAuth();
        }
    }, [])
    if (!store.loggedIn) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                height="50vh"
            >
                <img src={noAccess} alt="noAccess" style={{ width: "50vw", marginBottom: "8px" }} />
                <Typography variant="h6" gutterBottom style={{ textTransform: "uppercase", marginBottom: "0px", paddingBottom: "0px", textAlign:"center"}}>
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
    return <>{props.children}</>
}