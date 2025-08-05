import React from "react";
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField,
    Typography,
    Box
} from "@mui/material";

const PasswordChangeDialog = ({ open, onClose, onSave, password, setPassword, selectedUser }) => {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && password.trim()) {
            onSave();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Cambiar Contraseña
            </DialogTitle>
            <DialogContent>
                {selectedUser && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Usuario seleccionado:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {selectedUser.firstName} {selectedUser.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedUser.username} • {selectedUser.email}
                        </Typography>
                    </Box>
                )}
                
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nueva contraseña"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    helperText="Ingrese la nueva contraseña para el usuario"
                    required
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancelar
                </Button>
                <Button 
                    onClick={onSave} 
                    variant="contained" 
                    disabled={!password.trim()}
                    color="primary"
                >
                    Guardar Contraseña
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PasswordChangeDialog;

