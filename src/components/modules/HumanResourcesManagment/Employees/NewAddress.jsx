import React, { useState } from 'react'
import { Sidebar } from 'primereact';
import { Button, Divider, TextField } from '@mui/material';
import { apipms } from '../../../../service/apipms';

const NewAddress = ({ visible, setVisible, opButton, dataAddress, setCities, setSectors, setSuburbs }) => {
    const [newValue, setNewValue] = useState('');
    return (
        <div className="card flex justify-content-center">
            <Sidebar position="right" visible={visible} onHide={() => typeof setVisible === "function" && setVisible(false)}>
                <h2>Nuevo</h2>
                <br />
                {
                    dataAddress.stateID ? (
                        <div>
                            {dataAddress.stateID?.stateID &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>Estado</p>
                                    <p style={{ margin: 0 }}>{dataAddress.stateID.stateName}</p>
                                    <Divider />

                                </div>
                            }
                            {dataAddress.cityID?.cityID &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>Ciudad</p>
                                    <p style={{ margin: 0 }}>{dataAddress.cityID.cityName}</p>
                                    <Divider />

                                </div>
                            }
                            {dataAddress.sectorID?.sectorID &&
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>Sector</p>
                                    <p style={{ margin: 0 }}>{dataAddress.sectorID.sectorName}</p>
                                    <Divider />
                                </div>
                            }
                            <br />
                            <TextField
                                fullWidth
                                required
                                name='newValue'
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                id="newValue"
                                label="Nuevo valor"
                                size='small'
                                variant="standard"
                            />
                            <br />
                            <br />
                            <Button
                                fullWidth
                                size='small'
                                disabled={!newValue || newValue.length < 3}
                                variant="contained"
                                onClick={() => {
                                    apipms.post('/dataForm/newAddress', {
                                        newValue,
                                        stateID: dataAddress.stateID?.stateID || null,
                                        cityID: dataAddress.cityID?.cityID || null,
                                        sectorID: dataAddress.sectorID?.sectorID || null,
                                        opButton: opButton
                                    })
                                        .then((res) => {
                                            switch (opButton) {
                                                case 'city':
                                                    setCities((prev) => [...prev, res.data]);
                                                    break;
                                                case 'sector':
                                                    setSectors((prev) => [...prev, res.data]);
                                                    break;
                                                case 'suburb':
                                                    setSuburbs((prev) => [...prev, res.data]);
                                                    break;
                                                default:
                                                    break;
                                            }
                                            setVisible(false);
                                            setNewValue('');
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            createToast(
                                                'error',
                                                'Error',
                                                'Ha ocurrido un error al intentar guardar el registro'
                                            );
                                        })
                                }}
                            >
                                Guardar
                            </Button>
                        </div>
                    ) : (
                        <p style={{ color: '#cc0404' }}>No puedes agregar un nuevo valor, porque no hay datos de dirección disponibles,
                            debes seleccionar al menos un estado, municipio o sector.
                        </p>
                    )
                }
            </Sidebar>
        </div>
    )
}

export default NewAddress
