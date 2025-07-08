import React, { useEffect, useRef, useState } from 'react';
import '../../../css/Lines.css';
import { LinesCard } from './LinesCard';
import { apipms } from '../../../../service/apipms';
import { DialogLineForm } from './DialogLineForm';
import { Alert, Button, Divider } from '@mui/material';
import { Toast } from 'primereact/toast';
import AddIcon from '@mui/icons-material/Add';
import { DialogEmployeeLine } from './DialogEmployeeLine';

const Lines = () => {
    const [linesList, setLinesList] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false);
    const [visibleEmployeeLine, setVisibleEmployeeLine] = useState(false);
    const [selectedLine, setSelectedLine] = useState(null);
    const [empSewingWithOut, setEmpSewingWithOut] = useState([]);
    const toast = useRef(null);
    const [mode, setMode] = useState('add'); // 'add' | 'edit'

    // Array de colores disponibles
    const availableColors = [
        'green',    // Verde
        'blue',     // Azul
        'purple',   // Morado
        'orange',   // Naranja
        'red',      // Rojo
        'teal',     // Verde azulado
        'pink',     // Rosa
        'indigo'    // Índigo
    ];

    // Función para asignar colores de manera cíclica
    const getColorForIndex = (index) => {
        return availableColors[index % availableColors.length];
    };

    useEffect(() => {
        fetchLines();
    }, []);

    const fetchLines = async () => {
        try {
      const [linesResponse, employeesWithoutLineResponse] = await Promise.all([
                apipms.get(`/lines`),
                apipms.get(`/lines/employeesWithoutLine`)
            ]);

            setLinesList(linesResponse.data);
            setEmpSewingWithOut(employeesWithoutLineResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const createToast = (severity, summary, detail) => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 4000 });
    };

    const handleOpenDialogForm = (line = null) => {
        if (line) {
            setSelectedLine(line);
            setMode('edit');
        } else {
            setSelectedLine(null);
            setMode('add');
        }
        setVisibleForm(true);
    };

    const handleOpenEmployeeDialog = (line = null) => {
        setSelectedLine(line);
        setVisibleEmployeeLine(true);
    };

    const closeDialogEmployee = () => {
        fetchLines();
        setVisibleEmployeeLine(false);
        setSelectedLine(null);
    };

    const handleSave = async (data) => {
        if (mode === 'add') {
            await apipms.post('/lines', data)
                .then(() => {
                    createToast('success', 'Línea guardada', 'Los datos se han guardado correctamente');
                })
                .catch((error) => {
                    console.log(error);
                    createToast('error', 'Error al guardar', 'Ha ocurrido un error al guardar los datos');
                });
        } else {
            await apipms.put(`/lines/${parseInt(data.linesID)}`, data)
                .then(() => {
                    createToast('success', 'Línea actualizada', 'Los datos se han actualizado correctamente');
                })
                .catch((error) => {
                    console.log(error);

                    createToast('error', 'Error al actualizar', 'Ha ocurrido un error al actualizar los datos');
                });
        }
        fetchLines();
        setVisibleForm(false);
    };


    return (
        <div>
            <Toast ref={toast} />
            <Button variant="contained" startIcon={<AddIcon />} size='small' onClick={() => handleOpenDialogForm()}>
                Agregar Línea
            </Button>
            {
                empSewingWithOut.length > 0 && (
                    <Alert severity="warning"> <strong> {`${empSewingWithOut.length} empleados sin línea`}</strong></Alert>
                )
            }
            <div className="lines-grid">
                {linesList.map((line, index) => (
                    <LinesCard
                        key={line.linesID}
                        line={line}
                        colorTheme={getColorForIndex(index)}
                        onEdit={() => handleOpenDialogForm(line)}
                        onHandleEmployee={() => handleOpenEmployeeDialog(line)} />
                ))}
            </div>
            {visibleForm && (
                <DialogLineForm
                    open={visibleForm}
                    onClose={() => setVisibleForm(false)}
                    onSave={handleSave}
                    initialData={selectedLine}
                    mode={mode}
                    onShowToast={createToast}
                    linesList={linesList}
                />
            )}
            {visibleEmployeeLine && (
                <DialogEmployeeLine
                    open={visibleEmployeeLine}
                    onClose={() => closeDialogEmployee()}
                    initialData={selectedLine}
                    onShowToast={createToast}
                />
            )}
        </div>
    );
};

export default Lines;