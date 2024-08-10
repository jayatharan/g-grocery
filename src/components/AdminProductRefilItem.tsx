import { IconButton, Stack, TextField, Typography } from "@mui/material"
import { ProductWithRefil } from "./AdminProductsListToRefil"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DoneIcon from '@mui/icons-material/Done';
import { useCallback, useEffect, useMemo, useState } from "react";
import updateProductRefilQuantity from "@/actions/updateProductRefilQuantity";
import doneProductRefil from "@/actions/doneProductRefil";

export interface ProductWithRefilAndQuantity extends ProductWithRefil{
    quantity: number;
}

interface Props {
    product: ProductWithRefilAndQuantity
    onSave: (savedProduct: ProductWithRefil) => void;
}

const AdminProductRefilItem = ({
    product,
    onSave
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity.toString())

    const updateRefil = useCallback(async ()=> {
        let qty = 0;
        if(quantity){
            qty = parseInt(quantity) - product.quantity
        }
        setLoading(true)
        try{
            const formData = new FormData()
            formData.set("id", product.id.toString())
            formData.set("quantity", qty.toString())

            const savedProduct = await updateProductRefilQuantity(formData)
            onSave(savedProduct)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }, [quantity, product])

    const doneRefil = useCallback(async ()=> {
        setLoading(true)
        try{
            const formData = new FormData()
            formData.set("id", product.id.toString())

            const savedProduct = await doneProductRefil(formData)
            onSave(savedProduct)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }, [product])

    const actionButton = useMemo(() => {
        if(quantity && product.quantity !== parseInt(quantity)){
            return (
                <IconButton disabled={loading} size="small" onClick={updateRefil}>
                    <UpgradeIcon />
                </IconButton>
            )
        }else if(product.quantity !== 0){
            return (
                <IconButton disabled={loading} size="small" onClick={doneRefil}>
                    <DoneIcon />
                </IconButton>
            )
        }

        return null;
    }, [product, quantity, updateRefil, loading, doneRefil])

    useEffect(()=> {
        setQuantity(product.quantity.toString())
    }, [product])

    return (
        <Stack key={product.id} pb={1} sx={{
            borderBottom: "2px solid grey",
            minHeight: "45px"
        }} >
            <Stack
                display={"flex"}
                direction={"row"}
                alignItems={"center"}
            >
                <Stack display={"flex"} flex={2} >
                    <Typography variant='body1' fontWeight={700}>
                        {product.name}
                    </Typography>
                </Stack>
                <Stack display={"flex"} flex={1} direction={"row"}>
                    <TextField
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        size="small"
                        type="number"
                        fullWidth
                    />
                    {actionButton}
                </Stack>
            </Stack>
            <Typography variant='caption'>{product.description}</Typography>
        </Stack>
    )
}

export default AdminProductRefilItem