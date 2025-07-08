import { Dialog } from 'primereact/dialog';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { apipms } from '../../../../service/apipms';
import { isValidText } from '../../../../helpers/validator';

export const DialogLineForm = ({ open, onClose, onSave, initialData, mode, onShowToast, linesList }) => {
  const [headerLineForm, setHeaderLineForm] = useState({
    linesNumber: initialData?.linesNumber || '',
    supervisorID: initialData?.supervisorID || '',
    companyID: 1
  });
  const [supervisoresList, setsupervisoresList] = useState([]);

  useEffect(() => {
    apipms.get('/employee/supervisoresSewing')
      .then((response) => {
        setsupervisoresList(response.data);
      })
    setHeaderLineForm({
      linesNumber: initialData?.linesNumber || '',
      supervisorID: initialData?.supervisorID || '',
      companyID: 1
    });
  }, [initialData]);

  const handleSubmit = () => {
    onSave({
      linesID: initialData?.linesID,
      linesNumber: headerLineForm.linesNumber,
      supervisorID: headerLineForm.supervisorID
    });
  };

  const footerContent = (
    <div className="flex justify-content-end gap-3">
      <Button size='small' variant="outlined" onClick={() => onClose()}>
        Cancelar
      </Button>
      <Button size='small' variant="contained" onClick={() => {
        if (!isValidText(headerLineForm.linesNumber) || !isValidText(headerLineForm.supervisorID)) {
          onShowToast?.('warn', 'Campos requeridos', 'Por favor, complete todos los campos requeridos');
          return;
        }
        let lineExists = (mode === 'edit') ? linesList.filter((l) => l.linesID !== initialData.linesID)
          .some(line => line.linesNumber === headerLineForm.linesNumber) :
          linesList.some(line => line.linesNumber === headerLineForm.linesNumber);

        if (lineExists) {
          onShowToast?.('warn', 'Línea existente', 'Ya existe una línea con este número');
          return;
        }
        handleSubmit();
      }}
      >
        Guardar
      </Button>
    </div>
  );
  return (
    <Dialog header={
      <div>
        <h3>{mode === 'add' ? 'Agregar Línea' : 'Editar Línea'}</h3>
      </div>
    }
      visible={open} position="top-right" style={{ width: '25vw' }} onHide={() => onClose()} footer={footerContent} draggable={false} resizable={false}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center' }}>
        <TextField
          sx={{ width: '25%' }}
          required
          value={headerLineForm.linesNumber}
          onChange={(e) => {
            setHeaderLineForm({ ...headerLineForm, linesNumber: parseInt(e.target.value) });
          }}
          name='linesNumber'
          id="linesNumber"
          type="number"
          label="#Línea"
          size='small'
          variant="standard"
        />
        <FormControl fullWidth variant="standard" required sx={{ margin: 0, width: '80%' }} size='small'>
          <InputLabel id="supervisor">Supervisor</InputLabel>
          <Select
            labelId="supervisor"
            required
            id="supervisor"
            name='supervisorID'
            value={headerLineForm.supervisorID}
            onChange={(e) => setHeaderLineForm({ ...headerLineForm, supervisorID: e.target.value })}
            label="Supervisor"
            MenuProps={{
              disablePortal: true
            }}
          >
            {
              supervisoresList.map((item) => (
                <MenuItem key={item.supervisorID}
                  value={`${item.supervisorID}`}>
                  {item.supervisorName}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
    </Dialog>
  )
}
