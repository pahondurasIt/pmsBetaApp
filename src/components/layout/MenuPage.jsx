import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MenuPages.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { IconButton } from '@mui/material';
import logo from '../../assets/logpms.png'; // Adjust the path as necessary


const MenuPage = () => {
    const navigate = useNavigate();

    return (
        <div className="menu-container">
            <div className="logo-placeholder">
                <img src={logo} alt="Logo Powers Athletics" />
            </div>
            <div className="title-main">
                <h1>Welcome</h1>
            </div>
            <p className="subtitle-main">Power Athletics Honduras</p>
            <div className="button-group">
                <IconButton
                    className="menu-button"
                    aria-label="Marking Assistance System"
                    data-tooltip="Marking Assistance System"
                    onClick={() => navigate('/mainAttendance')}
                >
                    <AccessTimeIcon sx={{ fontSize: '1000px' }} />
                </IconButton>
                <IconButton
                    className="menu-button"
                    aria-label="Power Management System"
                    data-tooltip="Power Management System"
                    onClick={() => navigate('/login')}
                >
                    <AccountBoxIcon sx={{ fontSize: '40px' }} />
                </IconButton>
            </div>
        </div>

    );
};

export default MenuPage;