import React, { useEffect, useState } from 'react'

import { DataTable, Column } from 'primereact';

import { apipms } from '../service/apipms'

const Homepage = () => {
  const [employeeList, setEmployeesList] = useState([]);

  useEffect(() => {
    apipms.get('/empleados')
      .then((response) => {
        setEmployeesList(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <>
      <h1>Empleados</h1>
      <div className="card">
        <DataTable
          value={employeeList}
          size="small"
          showGridlines
          paginator rows={15}
          rowsPerPageOptions={[15, 30, 50]}
          tableStyle={{ minWidth: '70rem' }}>
          <Column field="codigo" header="Codigo" style={{ width: '25%' }}></Column>
          <Column field="nombre" header="Nombre" style={{ width: '25%' }}></Column>
          <Column field="cargo" header="Cargo" style={{ width: '25%' }}></Column>
          <Column field="dni" header="DNI" style={{ width: '25%' }}></Column>
        </DataTable>
      </div>
    </>
  )
}

export default Homepage
