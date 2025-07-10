import React, { useEffect } from 'react'
import { Button, Dialog } from '@mui/material';

export const DismissalEmployee = ({ visible, setVisible, employeeList }) => {
    useEffect(() => {
        console.log(employeeList);

    }, [])

    return (
        <>
            <Dialog
                header={
                    <div>
                        <h3 style={{ fontSize: '27px', fontWeight: 'bold', color: '#005aa9' }}>INACTIVAR EMPLEADO</h3>
                    </div>
                }
                visible={visible}
                style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button variant="contained" onClick={() => {
                        handleCloseDialog();
                        setVisible(false);
                    }}>
                        Cerrar
                    </Button>
                </div>
            </Dialog>
        </>
    )
}
