import React from 'react'
import { Dialog, Accordion, AccordionTab } from 'primereact';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GroupIcon from '@mui/icons-material/Group';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
const DialogEmployee = ({ visible, setVisible }) => {
    return (
        <>
            <Dialog
                header="Header"
                visible={visible}
                style={{ width: '65vw' }}
                onHide={() => { if (!visible) return; setVisible(false); }}
                footer={
                    <div className="flex justify-content-end gap-2">
                        <Button size='small' variant="outlined" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button size='small' variant="contained" onClick={() => setVisible(false)}>
                            Guardar
                        </Button>
                    </div>
                }
            >
                <div className="card">
                    <Accordion activeIndex={0}>
                        <AccordionTab style={{ backgroundColor: '#a02f2f' }} header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <PersonIcon />
                                    <span>Datos Personales</span>
                                </div>
                            </div>
                        }>
                            <div>
                                <p>Codigo empleado: <span>{984}</span></p>
                                <div className="flex align-items-center gap-2">
                                    <TextField size='small' id="firstName" label="Primer nombre" variant="standard" />
                                    <TextField size='small' id="middleName" label="Segundo nombre" variant="standard" />
                                    <TextField size='small' id="lastName" label="Primer apellido" variant="standard" />
                                    <TextField size='small' id="secondLastName" label="Segundo apellido" variant="standard" />
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="tipoDocumento">Tipo de documento</InputLabel>
                                        <Select
                                            labelId="tipoDocumento"
                                            id="tipoDocumento"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Tipo de documento"
                                        >
                                            <MenuItem value={10}>DNI</MenuItem>
                                            <MenuItem value={20}>Pasaporte</MenuItem>
                                            <MenuItem value={30}>Tarjeta de residencia</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField size='small' id="documentNumber" label="Numero de documento" variant="standard" />
                                    <TextField size='small' id="phone" label="Telefono" variant="standard" />
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 150 }} size='small'>
                                        <InputLabel id="tipoSangre">Tipo de sangre</InputLabel>
                                        <Select
                                            labelId="tipoSangre"
                                            id="tipoSangre"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Tipo de sangre"
                                        >
                                            <MenuItem value={10}>A+</MenuItem>
                                            <MenuItem value={20}>B+</MenuItem>
                                            <MenuItem value={30}>O+</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <p>Información del domicilio</p>
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="state">Departamento</InputLabel>
                                        <Select
                                            labelId="state"
                                            id="state"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Departamento"
                                        >
                                            <MenuItem value={10}>Cortes</MenuItem>
                                            <MenuItem value={20}>Atlántida</MenuItem>
                                            <MenuItem value={30}>Colón</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="standard" sx={{ margin: 0, minWidth: 200 }} size='small'>
                                        <InputLabel id="city">Municipio</InputLabel>
                                        <Select
                                            labelId="city"
                                            id="city"
                                            // value={age}
                                            // onChange={handleChange}
                                            label="Municipio"
                                        >
                                            <MenuItem value={10}>San Pedro Sula</MenuItem>
                                            <MenuItem value={20}>Villanueva</MenuItem>
                                            <MenuItem value={30}>Choloma</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <EscalatorWarningIcon />
                                    <span>Hijos</span>
                                </div>
                            </div>
                        }>
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <FamilyRestroomIcon />
                                    <span>Datos Familiares</span>
                                </div>
                            </div>
                        }>
                            <p className="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                                Consectetur, adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <ContactEmergencyIcon />
                                    <span>Contactos de Emergencia</span>
                                </div>
                            </div>
                        }>
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <GroupIcon />
                                    <span>Familiares PAH</span>
                                </div>
                            </div>
                        }>
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </AccordionTab>
                        <AccordionTab header={
                            <div>
                                <div className="flex align-items-center gap-2">
                                    <PaidIcon />
                                    <span>Beneficiarios</span>
                                </div>
                            </div>
                        }>
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
                                mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </AccordionTab>

                    </Accordion>
                </div>
            </Dialog>
        </>
    )
}

export default DialogEmployee
