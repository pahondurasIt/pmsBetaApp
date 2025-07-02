import { useEffect, useState } from 'react';

import '../../../css/Lines.css';
import { LinesCard } from './LinesCard';
import { apipms } from '../../../../service/apipms';
import { DialogLineForm } from './DialogLineForm';

const Lines = () => {
    const [linesList, setlinesList] = useState([]);
    const [visibleDialogForm, setVisibleDialogForm] = useState(false);


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
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {linesList.map((line) => (
                    <LinesCard lines={line} visibleDialogForm={visibleDialogForm} setVisibleDialogForm={setVisibleDialogForm} />
                ))}
            </div >
            {
                visibleDialogForm && (
                    <DialogLineForm
                        visible={visibleDialogForm}
                        setVisible={setVisibleDialogForm}
                        onHide={() => setVisibleDialogForm(false)}
                    />
                )
            }
        </>


    )
}

export default Lines

