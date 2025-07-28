// components/SupervisorLoginModal.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Box } from '@mui/material';
import { apipms } from '../../../../service/apipms';
import '../../../css/mainAsistencia.css';

const SupervisorLoginModal = ({ open, onClose, onSuccess }) => {
    const inputRef = useRef(null);
    const [supervisors, setSupervisors] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        apipms.post('/logdispatching')
            .then(res => {
                setSupervisors(res.data.map(s => s.supervisorID.toString()));
            })
            .catch(() => {
                setError('Error al cargar supervisores');
            });
    }, []);

    useEffect(() => {
        let retry = 0;
        const tryFocus = () => {
            if (open && inputRef.current) {
                inputRef.current.focus();
                if (document.activeElement !== inputRef.current && retry < 5) {
                    retry++;
                    setTimeout(tryFocus, 100);
                }
            }
        };

        setTimeout(tryFocus, 100);
    }, [open]);

    const handleLogin = () => {
        if (supervisors.includes(inputValue)) {
            onSuccess(inputValue); // callback con ID
            setInputValue('');
            setError('');
            onClose();
        } else {
            setError('ID inválido o no autorizado');
            setInputValue('');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="despacho-login-container" onClick={() => inputRef.current?.focus()}>
                <div className="despacho-card">
                    <div className='despacho-avatar-circle'></div>
                    <div className="despacho-title">Supervisor Access</div>
                    <div className="despacho-barcode">
                        <div className="barcode-lines">
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div key={i} className="barcode-line" />
                            ))}
                        </div>
                    </div>
                    {error && <div className="despacho-error">{error}</div>}
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleLogin()}
                    style={{
                        position: 'absolute', top: 5, left: 5, width: 1, height: 1,
                        opacity: 0, border: 'none', background: 'transparent', outline: 'none', zIndex: 1000
                    }}
                />
            </Box>
        </Modal>
    );
};

export default SupervisorLoginModal;
