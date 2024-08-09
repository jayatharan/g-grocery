"use client"

import { IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { useRouter } from 'next/navigation'
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";

interface Props {
    heading: string,
    shopName: string,
}

const AdminHeader = ({
    heading,
    shopName
}: Props) => {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = (path: string) => {
        handleClose()
        router.push(`/${shopName}/admin/${path}`)
    }

    return (
        <Stack display={"flex"} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant="h3" mb={2} fontWeight={700}>{heading}</Typography>
            <IconButton onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>navigate("products")}>Products</MenuItem>
                <MenuItem onClick={()=>navigate("buy")}>Buy Products</MenuItem>
                <MenuItem onClick={()=>navigate("refil")}>Refil Products</MenuItem>
            </Menu>
        </Stack>
    )
}

export default AdminHeader