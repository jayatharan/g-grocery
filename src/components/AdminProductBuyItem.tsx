import { IconButton, Stack, TextField, Typography } from "@mui/material"
import { ProductWithBuy } from "./AdminProductsListToBuy"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DoneIcon from '@mui/icons-material/Done';
import { useCallback, useEffect, useMemo, useState } from "react";
import updateProductBuyQuantity from "@/actions/updateProductBuyQuantity";
import doneProductBuy from "@/actions/doneProductBuy";

export interface ProductWithBuyAndQuantity extends ProductWithBuy{
    quantity: number;
}

interface Props {
    product: ProductWithBuyAndQuantity
    onSave: (savedProduct: ProductWithBuy) => void;
}

const AdminProductBuyItem = ({
    product,
    onSave
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity.toString())

    const updateBuy = useCallback(async ()=> {
        let qty = 0;
        if(quantity){
            qty = parseInt(quantity) - product.quantity
        }
        setLoading(true)
        try{
            const formData = new FormData()
            formData.set("id", product.id.toString())
            formData.set("quantity", qty.toString())

            const savedProduct = await updateProductBuyQuantity(formData)
            console.log(savedProduct)
            onSave(savedProduct)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }, [quantity, product])

    const doneBuy = useCallback(async ()=> {
        setLoading(true)
        try{
            const formData = new FormData()
            formData.set("id", product.id.toString())

            const savedProduct = await doneProductBuy(formData)
            onSave(savedProduct)
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }, [product])

    const actionButton = useMemo(() => {
        if(quantity && product.quantity !== parseInt(quantity)){
            return (
                <IconButton disabled={loading} size="small" onClick={updateBuy}>
                    <UpgradeIcon />
                </IconButton>
            )
        }else if(product.quantity !== 0){
            return (
                <IconButton disabled={loading} size="small" onClick={doneBuy}>
                    <DoneIcon />
                </IconButton>
            )
        }

        return null;
    }, [product, quantity, updateBuy, loading, doneBuy])

    useEffect(()=> {
        setQuantity(product.quantity.toString())
    }, [product])

    return (
        <Stack key={product.id} >
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
        </Stack>
    )
}

export default AdminProductBuyItem