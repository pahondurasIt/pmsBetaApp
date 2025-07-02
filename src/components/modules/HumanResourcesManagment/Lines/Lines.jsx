import React, { useEffect, useState } from 'react';
import '../../../css/Lines.css';
import { LinesCard } from './LinesCard';
import { apipms } from '../../../../service/apipms';

const Lines = () => {
    const [linesList, setlinesList] = useState([]);

    useEffect(() => {
        apipms.get('/lines')
            .then((response) => {
                setlinesList(response.data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            {linesList.map((line) => (
                <LinesCard lines={line} />
            ))}
        </div >
    )
}

export default Lines

