import React from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import '../../css/usercontrol.css'; 


export const UserControl = () => {
  return (
    <>
      <TabView>
        <TabPanel header="Module Screen Control">
          <p className="tab1">
            Jota
          </p>
        </TabPanel>


        <TabPanel header="Module User Control">
          <p className="tab2">
            penelope
          </p>
        </TabPanel>
     
      </TabView>
    </>
  );
};

export default UserControl;