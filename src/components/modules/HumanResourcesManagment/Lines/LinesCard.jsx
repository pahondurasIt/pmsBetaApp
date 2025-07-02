import React from 'react';
import '../../../css/LinesCard.css';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import sewingMachineImage from '/sewing.png';

export const LinesCard = ({ lines, visibleDialogForm, setVisibleDialogForm }) => {
    return (
        <div className="linea-card">
            <div className="card-header">
                <div className="pointer-icon" onClick={() => setVisibleDialogForm(true)}>
                    <EditIcon sx={{ fontSize: 30 }} />
                </div>
                <div className="supervisor-info">
                    <div className="supervisor-title">Supervisor</div>
                    <div className="supervisor-name">{lines.supervisorName}</div>
                </div>
                <div className="line-info">
                    <div className="line-label">Línea</div>
                    <div className="line-number">{lines.linesNumber}</div>
                </div>
            </div>

            <div className="card-content">
                <img src={sewingMachineImage} width="100" height="100" alt="" srcset="" />
                <div className="employees-section">
                    <div className="pointer-icon">
                        <div className="employees-label">Empleados</div>
                        <GroupsIcon sx={{ fontSize: 60 }} />
                    </div>

                </div>
            </div>
        </div>
    )
}
