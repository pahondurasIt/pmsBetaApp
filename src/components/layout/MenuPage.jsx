import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import '../css/MenuPages.css';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LaptopIcon from '@mui/icons-material/Laptop';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { IconButton } from '@mui/material';
import logo from '/logpms.png'; // Adjust the path as necessary
import SupervisorLoginModal from '../modules/HumanResourcesManagment/Attendance/accessmodal';
import useCustomNavigate from '../../hooks/useCustomNavigate';

const MenuPage = () => {
    // const navigate = useNavigate();
    const { goTo , goLogin, goPermissionSupervisor } = useCustomNavigate();
    const [openLogin, setOpenLogin] = useState(false);
    
    const handleLoginSuccess = (supervisorID) => {
        goTo('/mainAttendance', {
            state: {
                op: 'DESPACHO',
                supervisorID
            }
        });
    };

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
                    aria-label="Attendance record"
                    data-tooltip="Attendance record"
                    onClick={() => setOpenLogin(true)}
                >
                    <AccessTimeIcon sx={{ fontSize: '1000px' }} />
                </IconButton>
                <IconButton
                    className="menu-button"
                    aria-label="Power Management System"
                    data-tooltip="Power Management System"
                    onClick={goLogin}
                >
                    <LaptopIcon sx={{ fontSize: '40px' }} />
                </IconButton>

                <IconButton
                    className="menu-button"
                    aria-label="Permiso"
                    data-tooltip="Permiso"
                    onClick={goPermissionSupervisor }
                >
                    <AssignmentIndIcon sx={{ fontSize: '40px' }} />
                </IconButton>

                <SupervisorLoginModal
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                    onSuccess={handleLoginSuccess}
                />
            </div>
        </div>
    );
};

export default MenuPage;