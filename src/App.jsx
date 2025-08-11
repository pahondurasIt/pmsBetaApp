import React from 'react'
import AppRouter from './AppRouter'
import ServiceWorkerUpdateNotification from './components/common/ServiceWorkerUpdateNotification'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'animate.css';
        
const App = () => {
  return (
    <>
      <AppRouter />
      <ServiceWorkerUpdateNotification />
    </>
  )
}
  
export default App