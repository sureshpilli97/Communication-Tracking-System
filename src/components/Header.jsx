import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CommunicationIcon from './CommunicationIcon';
import { AuthContext } from '../App';

const Header = () => {
    const { user, handleLogout } = useContext(AuthContext);
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const onLogout = () => {
        handleLogout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <AppBar position="static" sx={{ paddingTop: 1, paddingBottom: 1, backgroundColor: '#000' }}>
            <Toolbar>
                <CommunicationIcon size={isSmallScreen ? 30 : 35} color="white" />
                <Typography
                    variant={isSmallScreen ? 'h6' : 'h5'}
                    noWrap
                    sx={{
                        ml: 2,
                        flexGrow: 1,
                        fontWeight: 'bold'
                    }}
                >
                    Communication Tracking System
                </Typography>
                <Box>
                    <Button
                        color="inherit"
                        sx={{
                            display: 'flex',
                            gap: 1
                        }}
                        onClick={onLogout}
                    >
                        {!isSmallScreen && 'Logout'}
                        <LogoutIcon />
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
