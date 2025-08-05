import React, { useState } from 'react';
import { Button, Divider } from '@mui/material';
import { Dialog } from 'primereact';
import { apipms } from '../../../../service/apipms';
import EmployeeCard from './EmployeeCard';

const DialogNewEmployee = ({ visible, setVisible, handleCloseDialog, newEmployee,
    cleanForm, setVisibleDialogCard, setEmployeeSelected }) => {

    return (
        <>
            <Dialog
                header={
                    <div>
                        <h3 style={{ fontSize: '27px', fontWeight: 'bold', color: '#005aa9' }}>Empleado Nuevo</h3>
                    </div>
                }
                visible={visible}
                style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        alignItems: 'center',
                    }}>
                        <p style={{
                            fontSize: '33px',
                            fontWeight: '100',
                            color: '#000000',
                            margin: 0,
                        }}>{newEmployee.fullName}</p>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <p style={{
                            fontSize: '40px',
                            fontWeight: '100',
                            color: '#666666',
                            margin: 0,
                        }}>{newEmployee.codeEmployee}</p>
                    </div>
                    <p style={{
                        fontSize: '20px',
                        fontWeight: '100',
                        color: '#707070',
                        margin: 0,
                    }}>{newEmployee.jobName}</p>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                    }}>
                        <Button variant="contained" color="error" onClick={() => {
                            apipms.get(`/employee/employeeByID/${newEmployee.employeeID}`)
                                .then((response) => {
                                    setEmployeeSelected(response.data);
                                    cleanForm();
                                    setVisibleDialogCard(true);
                                })
                                .catch((error) => {
                                    console.error('Error fetching data:', error)
                                })
                        }}>
                            Exportar PDF
                        </Button>
                        <Button variant="contained" onClick={() => {
                            handleCloseDialog();
                            setVisible(false);
                            cleanForm();
                        }}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Dialog>
            {/* {visibleDialogCard &&
                <EmployeeCard
                    visible={visibleDialogCard}
                    setVisible={setVisibleDialogCard}
                    employeeData={employeeSelected}
                />
            } */}
        </>
    )
}

export default DialogNewEmployee
