import { Dialog } from 'primereact/dialog';
import '../../../css/permission.css';
import { isValidText } from '../../../../helpers/validator';

const TimePermission = ({ visible, onHide, permiso }) => {
    return (
        <Dialog
            header="Detalle del Permiso"
            visible={visible}
            style={{ width: '400px' }}
            onHide={onHide}
            modal
            className="p-fluid"
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className='label-detail'>Programado</p>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem' }}>
                    <div>
                        <p className='label-permission'>Salida</p>
                        <p className='value-hours'>{permiso?.exitTimePermission}</p>
                    </div>
                    <div>
                        <p className='label-permission'>Entrada</p>
                        <p className='value-hours'>{permiso?.entryTimePermission}</p>
                    </div>
                </div>
                <br />
                <p className='label-detail'>Marcaje</p>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem' }}>
                    <div>
                        <p className='label-permission'>Salida</p>
                        <p className='value-hours'>{isValidText(permiso?.exitPermission) ? permiso.exitPermission : '--'}</p>
                    </div>
                    <div>
                        <p className='label-permission'>Entrada</p>
                        <p className='value-hours'>{isValidText(permiso?.entryPermission) ? permiso.entryPermission : '--'}</p>
                    </div>
                </div>

            </div>
        </Dialog>
    )
}

export default TimePermission