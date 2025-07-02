import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export const DialogLineForm = ({ visible, setVisible, onHide }) => {
      const footerContent = (
          <div>
              <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
              <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
          </div>
      );
  return (
    <Dialog header="Header" visible={visible} position="top-right" style={{ width: '50vw' }} onHide={onHide} footer={footerContent} draggable={false} resizable={false}>
      <div>DialogLineForm</div>
    </Dialog>
  )
}
