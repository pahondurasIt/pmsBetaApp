import React from 'react';
import '../../../css/LinesCard.css';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import sewingMachineImage from '/sewing.png';

export const LinesCard = ({ lines }) => {
    return (
        <div className="lines-card" style={dynamicStyles}>
            {/* Barra superior con color dinámico */}
            <div className="card-top-bar"></div>
            
            {/* Header con icono circular y botón de editar */}
            <div className="card-header">
                <div className="pointer-icon">
                    <EditIcon sx={{ fontSize: 30 }} />
                </div>
                <div className="line-title">
                    <h3>Línea {lines.linesNumber || '2'}</h3>
                    <span className="line-type">Producción</span>
                </div>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-text edit-button"
                    aria-label="Editar"
                />
            </div>

            {/* Información del supervisor */}
            <div className="supervisor-section">
                <span className="supervisor-label">Supervisor</span>
                <h4 className="supervisor-name">{lines.supervisorName || 'Manuel Armando Solano'}</h4>
            </div>

            {/* Sección de empleados */}
            <div className="employees-section">
                <div className="employees-info">
                    <i className="pi pi-users employees-icon"></i>
                    <span className="employees-label">Empleados</span>
                </div>
                <Badge 
                    value={lines.employeesCount || '2'} 
                    className="employees-badge"
                />
            </div>

            {/* Estado */}
            <div className="status-section">
                <span className="status-label">Estado:</span>
                <span className={`status-value ${lines.status === 'active' ? 'active' : 'inactive'}`}>
                    {lines.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
            </div>
        </div>
    );
};

