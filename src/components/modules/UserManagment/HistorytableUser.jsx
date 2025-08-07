import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Typography } from "@mui/material";
import { Toast } from "primereact/toast";
import { apipms } from "../../../service/apipms";
import PasswordChangeDialog from "./PasswordChangeDialog";
import '../../css/HistorytableUser.css'

const HistorytableUser = ({ historyData }) => {
    const [users, setUsers] = useState([]);
    const toast = useRef(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apipms.get("/usuarios/active_user");
                setUsers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        fetchUsers();

    }, []);

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setPassword("");
        setDialogOpen(true);
    };

    const handleSavePassword = () => {
        apipms.post("/usuarios/change_password", {
            userID: selectedUser.userID,
            newPassword: password
        }).then(() => {
            toast.current?.show({
                severity: "success",
                summary: "Contraseña",
                detail: "Contraseña actualizada",
                life: 3000
            });
            setDialogOpen(false);
        }).catch(() => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo actualizar la contraseña.',
                life: 3000
            });
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <Typography sx={{ fontWeight: 'bold', mb: 1 }} variant="h4">
                Users Actives:
            </Typography>

            <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                <Column field="firstName" header="First Name" />
                <Column field="lastName" header="Last Name" />
                <Column field="username" header="User Name" />
                <Column field="email" header="Email" />
                <Column
                    header="Change Password"
                    body={(rowData) => (
                        <Button
                            variant="outlined"
                            onClick={() => handleOpenDialog(rowData)}
                        >
                            Cambiar
                        </Button>
                    )}
                />
            </DataTable>

            <PasswordChangeDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSavePassword}
                password={password}
                setPassword={setPassword}
            />

        </>
    );

}

export default HistorytableUser;