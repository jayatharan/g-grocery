"use client"

import { Container, Stack, TextField, Typography } from "@mui/material";
import { Shop } from "@prisma/client"
import { useState } from "react";

interface Props {
    shop: Shop;
    children: React.ReactNode
}

const AdminPasskeyProtector = ({
    shop,
    children
}: Props) => {
    const [password, setPassword] = useState(() => {
        let pass = localStorage.getItem("password")
        return pass??""
    })

    if(shop.passKey !== password) {
        return (
            <Container maxWidth={"sm"}>
                <Stack spacing={2}>
                    <Typography variant="h4" fontWeight={700} textAlign={"center"}>Admin Passkey Verification</Typography>
                    <TextField 
                        value={password}
                        onChange={(event) => {
                            localStorage.setItem("password", event.target.value)
                            setPassword(event.target.value)
                        }}
                        placeholder="Admin Passkey"
                        type="password"
                        fullWidth
                    />
                </Stack>
            </Container>
        )
    }

    return children;
}

export default AdminPasskeyProtector