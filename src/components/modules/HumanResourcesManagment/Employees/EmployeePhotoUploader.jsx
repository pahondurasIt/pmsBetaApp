import React, { useEffect, useState } from 'react';
import { Button, Box, Avatar, Typography } from '@mui/material';
import { Dialog } from 'primereact';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { apipms } from '../../../../service/apipms';

const EmployeePhotoUploader = ({ codeEmployee, completeName, visible, setVisible, onShowToast }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleSelect = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpload = async () => {
        if (!file || !codeEmployee) return;
        console.log(file);
        file.size / 1024 > 6000 && onShowToast('error', 'Error al subir la foto', 'El tamaño de la imagen no debe exceder los 6 MB.');
        if (file.size / 1024 > 6000) return; // Prevent upload if file is too large

        const formData = new FormData();
        formData.append('image', file);

        apipms.post(`/employee/uploadPhoto/${parseInt(codeEmployee)}`, formData)
            .then((response) => {
                onShowToast('success', 'Foto subida correctamente', `La foto del empleado ${completeName} ha sido actualizada.`);
                setPreview(null); // Reset preview after upload
                setFile(null); // Reset file after upload
                setVisible(false); // Close dialog after upload
            })
            .catch((error) => {
                console.error('Error uploading photo:', error);
            });
    };

    return (
        <Dialog
            header={codeEmployee &&
                <div>
                    <h3 style={{ fontSize: '27px', fontWeight: 'bold', color: '#005aa9' }}>Code: {codeEmployee}</h3>
                    <h3 style={{ fontSize: '27px', fontWeight: '300', color: '#005aa9' }}>{completeName || ''}</h3>
                </div>
            }
            visible={visible}
            style={{ width: '50vw' }}
            onHide={() => { if (!visible) return; setVisible(false); }}
        >
            <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                <Avatar
                    src={preview || `${import.meta.env.VITE_API_URL}/EmpPht/${codeEmployee}.jpg`}
                    sx={{ width: 140, height: 140 }}
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="upload-photo"
                    type="file"
                    onChange={handleSelect}
                />
                <label htmlFor="upload-photo">
                    <Button variant="outlined" component="span">
                        Seleccionar imagen
                    </Button>
                </label>
                <Button variant="contained" onClick={handleUpload} disabled={!file} startIcon={<CloudUploadIcon />}>
                    Subir imagen
                </Button>
                {file && <p style={{ margin: 0, fontSize: '25px', fontWeight: 300 }}>{file.name}</p>}
            </Box>
        </Dialog>
    );
};

export default EmployeePhotoUploader;
