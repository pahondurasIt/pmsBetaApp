import React from 'react'
import '../../../css/menuSupervisor.css'
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import TaskIcon from '@mui/icons-material/Task';
export const MenuPermission = ({ setVisibleDiferidos, setVisibleSolicitudes, setVisibleAprobaciones, setVisibleMenu } ) => {
    return (
        <div>
            <div>
                <h1>Menu de Permisos</h1>
                <p className='label-text'>Seleccione una opción para continuar:</p>
            </div>
            <br />
            <br />
            <div className="op-group">
                <div
                    className="op-button"
                    aria-label="Permisos diferidos"
                    data-tooltip="Permisos diferidos"
                    onClick={() => {
                        setVisibleDiferidos(true);
                        setVisibleSolicitudes(false);
                        setVisibleAprobaciones(false);
                        setVisibleMenu(false);
                    }}
                >
                    <h2>Permisos diferidos</h2>
                    <ContactPageIcon fontSize='large' />
                </div>
                <div
                    className="op-button"
                    aria-label="Solicitud de Permisos"
                    data-tooltip="Solicitud de Permisos"
                    onClick={() => {
                        setVisibleDiferidos(false);
                        setVisibleSolicitudes(true);
                        setVisibleAprobaciones(false);
                        setVisibleMenu(false);
                    }}
                >
                    <h2>Solicitud de Permisos</h2>
                    <ContactMailIcon fontSize='large' />
                </div>

                <div
                    className="op-button"
                    aria-label="Aprobar Permisos"
                    data-tooltip="Aprobar Permisos"
                    onClick={() => {
                        setVisibleDiferidos(false);
                        setVisibleSolicitudes(false);
                        setVisibleAprobaciones(true);
                        setVisibleMenu(false);
                    }}
                >
                    <h2>Aprobar Permisos</h2>
                    <TaskIcon fontSize='large' />
                </div>
            </div>
        </div>
    )
}
