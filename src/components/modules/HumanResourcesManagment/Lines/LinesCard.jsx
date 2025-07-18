import React, { useEffect } from 'react';
import '../../../css/LinesCard.css';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { NavLink } from "react-router";

export const LinesCard = ({ line, colorTheme = 'green', onEdit, onHandleEmployee }) => {

    // Definir los colores disponibles
    const colorThemes = {
        green: {
            primary: '#22c55e',
            secondary: '#16a34a',
            light: '#dcfce7'
        },
        blue: {
            primary: '#3b82f6',
            secondary: '#2563eb',
            light: '#dbeafe'
        },
        purple: {
            primary: '#8b5cf6',
            secondary: '#7c3aed',
            light: '#ede9fe'
        },
        orange: {
            primary: '#f97316',
            secondary: '#ea580c',
            light: '#fed7aa'
        },
        red: {
            primary: '#ef4444',
            secondary: '#dc2626',
            light: '#fecaca'
        },
        teal: {
            primary: '#14b8a6',
            secondary: '#0d9488',
            light: '#ccfbf1'
        },
        pink: {
            primary: '#ec4899',
            secondary: '#db2777',
            light: '#fce7f3'
        },
        indigo: {
            primary: '#6366f1',
            secondary: '#4f46e5',
            light: '#e0e7ff'
        }
    };

    const currentTheme = colorThemes[colorTheme] || colorThemes.green;

    // Estilos dinámicos para el tema de color
    const dynamicStyles = {
        '--theme-primary': currentTheme.primary,
        '--theme-secondary': currentTheme.secondary,
        '--theme-light': currentTheme.light
    };

    return (
        <div className="lines-card" style={dynamicStyles}>
            {/* Barra superior con color dinámico */}
            <div className="card-top-bar"></div>

            {/* Header con icono circular y botón de editar */}
            <div className="card-header">
                <div className="line-circle">
                    <span className="line-number">{line.linesNumber || '-'}</span>
                </div>
                <div className="line-title">
                    <h3>Línea {line.linesNumber || '-'}</h3>
                </div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-text edit-button"
                    aria-label="Editar"
                    onClick={onEdit}
                />
            </div>

            {/* Información del supervisor */}
            <div className="supervisor-section">
                <span className="supervisor-label">Supervisor</span>
                <h4 className="supervisor-name">{line.supervisorName || 'Manuel Armando Solano'}</h4>
            </div>

            {/* Sección de empleados */}
            <div className="employees-section" onClick={() => onHandleEmployee()}>
                <div className="employees-info">
                    <i className="pi pi-users employees-icon"></i>
                    <span className="employees-label">Empleados</span>
                </div>
                <Badge
                    value={line.totalEmployees || '-'}
                    severity="secondary"
                />
            </div>

            {/* Estado */}
            {/* <div className="status-section">
                <span className="status-label">Estado:</span>
                <span className={`status-value ${line.status === 'active' ? 'active' : 'inactive'}`}>
                    {line.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
            </div> */}
        </div>
    );
};