// Form de los empleados que no se registraron para poderlo hacer aqui!
// FormURIE.jsx
import React, { useEffect, useState, useRef } from 'react';
import '../../../css/formURIE.css'
import {
  TextField, Autocomplete, Button, Divider
} from '@mui/material';
import dayjs from '../../../../helpers/dayjsConfig';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DataTable, Column } from 'primereact';
import { apipms } from '../../../../service/apipms';
import { Toast } from 'primereact/toast';
import io from 'socket.io-client';

// NUEVO: Definir la URL del servidor Socket.IO
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL_SOCKET; // Ajusta según tu configuración

const FormURIE = () => {
  const toast = useRef(null);
  const socket = useRef(null);

  const [employeeWithoutAttendance, setemployeeWithoutAttendance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false)
  const [marcajeEntiempoReal, setmarcajeEntiempoReal] = useState([]);


  useEffect(() => {

    const fetchEmployees = async () => {
      try {
        const response = await apipms.get("/formaddtime");
        setemployeeWithoutAttendance(response.data);
      } catch {
        console.log(`Error al cargar empleados ${error}!`)
      }
    };

    fetchEmployees();

    socket.current = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on("connect", () => {
      console.log(`Conectado Correctamente`)
    });

    // ESCUCHA EVENTO NUEVO MARCAJE
    socket.current.on("actualizar_empleados_tabla", () => {
      console.log("🔄 Recibido evento de actualización de empleados sin marcaje");
      fetchEmployees(); //Vuelve A cargar!
    });

    return () => {
      socket.current.disconnect();
    };

  }, []);

  // ✅ Enviar marcaje
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !selectedTime) {
      toast.current.show({ severity: 'warn', summary: 'Campos requeridos', detail: 'Seleccione empleado y hora', life: 3000 });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        codeEmployee: selectedEmployee.codeEmployee,
        time: dayjs(selectedTime).format("HH:mm:ss"),
      };

      await apipms.post("/formaddtime/postAddTime", payload); // Aquí debe existir este endpoint en tu backend
      toast.current.show({ severity: 'success', summary: 'Marcaje registrado', detail: 'El registro fue exitoso', life: 3000 });

      // Limpiar campos y actualizar tabla
      setSelectedEmployee(null);
      setSelectedTime(null);
      const response = await apipms.get("/formaddtime");
      setEmployeeWithoutAttendance(response.data);
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el marcaje', life: 3000 });
    } finally {
      setLoading(false);
    }
  };



  return (
    <>

      <Toast ref={toast} />

      <h2 className="title1">Registrar Marcaje</h2>
      <div className="containerform">
        <form onSubmit={handleSubmit}>
          <div className='formclass'>
            <label className='labelform'> Empleado *</label>
            <div>
              <Autocomplete
                fullWidth
                value={selectedEmployee}
                onChange={(event, newValue) => setSelectedEmployee(newValue)}
                options={employeeWithoutAttendance}
                getOptionLabel={(emp) => emp.fullName || ''}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    placeholder="Seleccione..."
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>

            <div className="formclass">
              <label className="labelform">Registra la Hora *</label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={selectedTime}
                  onChange={(newValue) => setSelectedTime(newValue)}
                  renderInput={(params) => <TextField {...params} required size="small" />}
                />
              </LocalizationProvider>
            </div>

            <Button
              type="submit"
              variant="contained"
              startIcon={<i className="pi pi-check" />}
              fullWidth
              disabled={loading}
              className="save-button-form">
            </Button>
          </div>
        </form>

        <Divider orientation="vertical" flexItem className="verdivide-form" />

        <div className="right-panel-form">
          <div >
            <DataTable
              value={employeeWithoutAttendance}
              emptyMessage="No hay registros aún"
              size="small"
              showGridlines
              paginator
              rows={15}
              rowsPerPageOptions={[10, 15, 20]}
              cellSelection
              selectionMode="single"
            >
              <Column field="codeEmployee" header="Código" style={{ minWidth: "120px" }}></Column>
              <Column field="fullName" header="Empleado" style={{ minWidth: '180px' }}></Column>
            </DataTable>
          </div>

        </div>
      </div>



    </>
  );
};

export default FormURIE;