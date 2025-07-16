import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import PersonIcon from '@mui/icons-material/Person';
import '../../../css/EditHistoryIndicator.css';

/*
const EditHistoryIndicator = ({ 
  editHistory = [], 
  visible = true, 
  position = 'top-right',
  onClick 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const indicatorRef = useRef(null);

  // Si no hay historial de ediciones, no mostrar nada
  if (!editHistory || editHistory.length === 0) {
    return null;
  }

  const handleIndicatorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }
    setShowModal(true);
  };

  const handleIndicatorHover = () => {
    setIsHovered(true);
  };

  const handleIndicatorLeave = () => {
    setIsHovered(false);
  };

  // NUEVO: Función para manejar el cierre del modal
  const handleModalClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setShowModal(false);
  };

  // NUEVO: Función para manejar clics en el botón cerrar
  const handleCloseButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleModalClose(e);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Fecha no disponible';
    
    try {
      // Intentar diferentes formatos de fecha
      let date;
      
      if (typeof dateTime === 'string') {
        // Si es una cadena, intentar parsearla
        if (dateTime.includes('T')) {
          // Formato ISO
          date = new Date(dateTime);
        } else if (dateTime.includes('/')) {
          // Formato DD/MM/YYYY o MM/DD/YYYY
          date = new Date(dateTime);
        } else {
          // Otros formatos
          date = new Date(dateTime);
        }
      } else {
        // Si ya es un objeto Date
        date = new Date(dateTime);
      }

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }

      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error en fecha';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'edit-indicator-top-left';
      case 'top-right':
        return 'edit-indicator-top-right';
      case 'bottom-left':
        return 'edit-indicator-bottom-left';
      case 'bottom-right':
        return 'edit-indicator-bottom-right';
      default:
        return 'edit-indicator-top-right';
    }
  };

  return (
    <>
      <div
        ref={indicatorRef}
        className={`edit-history-indicator-new ${getPositionClass()} ${isHovered ? 'hovered' : ''}`}
        onClick={handleIndicatorClick}
        onMouseEnter={handleIndicatorHover}
        onMouseLeave={handleIndicatorLeave}
      >
        <div className="edit-indicator-button">
          <PersonIcon className="profile-icon" />
        </div>
      </div>

      <Dialog
        header={
          <div className="modal-header-custom">
            <PersonIcon style={{ marginRight: '8px' }} />
            <span>Historial de Ediciones</span>
          </div>
        }
        visible={showModal}
        style={{ width: '500px', maxWidth: '90vw' }}
        onHide={handleModalClose}
        modal
        draggable={false}
        resizable={false}
        className="edit-history-modal-dynamic"
        headerClassName="modal-header-dynamic"
        // NUEVO: Configuraciones adicionales para evitar propagación
        blockScroll={true}
        dismissableMask={false}
        closeOnEscape={true}
      >
        <div className="edit-history-content-dynamic">
          {editHistory.length === 0 ? (
            <div className="no-history-dynamic">
              <PersonIcon style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#9ca3af' }} />
              <p>No hay historial de ediciones disponible.</p>
            </div>
          ) : (
            <div className="history-list-dynamic">
              {editHistory.map((edit, index) => (
                <div key={index} className="history-item-dynamic">
                  <div className="history-header-dynamic">
                    <div className="user-info-dynamic">
                      <PersonIcon style={{ color: '#6366f1', fontSize: '0.9rem' }} />
                      <span className="username-dynamic">
                        {edit.editedByUser || 'Usuario desconocido'}
                      </span>
                    </div>
                    <div className="date-info-dynamic">
                      <i className="pi pi-calendar"></i>
                      <span className="edit-date-dynamic">
                        {formatDateTime(edit.editDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="changes-container-dynamic">
                    <div className="change-row-dynamic">
                      <span className="change-label-dynamic">Campo editado:</span>
                      <span className="change-value-dynamic field-value-dynamic">
                        {edit.field === 'entryTime' ? 'Hora de Entrada' : 
                         edit.field === 'exitTime' ? 'Hora de Salida' : 
                         edit.field || 'Campo desconocido'}
                      </span>
                    </div>
                    <div className="change-row-dynamic">
                      <span className="change-label-dynamic">Anterior:</span>
                      <span className="change-value-dynamic old-value-dynamic">
                        {edit.oldTime || 'Sin valor'}
                      </span>
                    </div>
                    <div className="change-row-dynamic">
                      <span className="change-label-dynamic">Nuevo:</span>
                      <span className="change-value-dynamic new-value-dynamic">
                        {edit.newTime || 'Sin valor'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    
      </Dialog>
    </>
  );
};
*/

const EditHistoryIndicator = () => {
  return null;
};

export default EditHistoryIndicator;

