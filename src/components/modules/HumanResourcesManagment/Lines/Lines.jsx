import React, { useEffect, useState } from 'react';
import '../../../css/Lines.css';
import { LinesCard } from './LinesCard';
import Divider from '@mui/material/Divider';
import { apipms } from '../../../../service/apipms';

const Lines = () => {
    const [linesList, setLinesList] = useState([]);

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
        apipms.get('/lines')
            .then((response) => {
                setLinesList(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);0
            });
    }, []);

  
    return (
       <>    
        <div >
            <div className="lines-grid">
                {linesList.map((line, index) => (
                    <LinesCard 
                        key={line.id || index} 
                        lines={line} 
                        colorTheme={getColorForIndex(index)}
                    />
                ))}
            </div>
        </div>
        </>
    );
};

export default Lines;

