import { Button, ButtonGroup, Icon, IconButton, Stack, TextField, Typography } from "@mui/material"
import { ProductWithRefil } from "./AdminProductsListToRefil"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DoneIcon from '@mui/icons-material/Done';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import updateProductRefilQuantity from "@/actions/updateProductRefilQuantity";
import doneProductRefil from "@/actions/doneProductRefil";
import { motion } from "framer-motion"
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalShipping } from "@mui/icons-material";
import deleteProductRefil from "@/actions/deleteProductRefil";
import notAvailableProductRefil from "@/actions/notAvailableProductRefil";

export interface ProductWithRefilAndQuantity extends ProductWithRefil {
    quantity: number;
    isNotAvailable: boolean;
}

interface Props {
    product: ProductWithRefilAndQuantity
    onSave: (savedProduct: ProductWithRefil) => void;
}

const AdminProductRefilItem = ({
    product,
    onSave
}: Props) => {
    const positionRef = useRef<HTMLDivElement>(null);
    const constainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity.toString())
    const [action, setAction] = useState("")

    const updateRefil = useCallback(async () => {
        let qty = 0;
        if (quantity) {
            qty = parseInt(quantity) - product.quantity
        }
        setLoading(true)
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())
            formData.set("quantity", qty.toString())

            const savedProduct = await updateProductRefilQuantity(formData)
            onSave(savedProduct)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [quantity, product])

    const doneRefil = useCallback(async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())

            const savedProduct = await doneProductRefil(formData)
            onSave(savedProduct)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [product])

    const actionRefil = useCallback(async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())
            const savedProduct = action == "not-available" ? await notAvailableProductRefil(formData) : await deleteProductRefil(formData)
            setAction("")
            onSave(savedProduct)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [product, action])

    const actionButton = useMemo(() => {
        if (quantity && product.quantity !== parseInt(quantity)) {
            return (
                <IconButton disabled={loading} size="small" onClick={updateRefil}>
                    <UpgradeIcon />
                </IconButton>
            )
        } else if (product.quantity !== 0) {
            return (
                <IconButton disabled={loading} size="small" onClick={doneRefil}>
                    <DoneIcon />
                </IconButton>
            )
        }

        return null;
    }, [product, quantity, updateRefil, loading, doneRefil])

    const content = useMemo(() => {
        if (action) {
            return (
                <Stack
                    display={"flex"}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography variant='body1' fontWeight={700}>
                        {action == "delete" ? "Reset to 0?" : "Not Available?"}
                    </Typography>
                    <ButtonGroup size="medium">
                        <Button variant="contained" onClick={actionRefil}>Yes</Button>
                        <Button variant="outlined" onClick={() => setAction("")}>No</Button>
                    </ButtonGroup>
                </Stack>
            )
        }

        return (
            <Stack>
                <Stack
                    display={"flex"}
                    direction={"row"}
                    alignItems={"center"}
                    sx={{
                        opacity: product.isNotAvailable ? 0.5 : 1
                    }}
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
    }, [action, product, quantity, setQuantity, actionRefil, setAction])

    useEffect(() => {
        setQuantity(product.quantity.toString())
    }, [product])


    return (
        <Stack ref={positionRef} sx={{
            borderBottom: "2px solid grey",
            overflow: "hidden",
            position: "relative"
        }} >
            <Stack display={"flex"} direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 0
            }}>
                <Stack display={"flex"} direction={"row"} alignItems={"center"}>
                    <Icon color="warning">
                        <LocalShipping color={"warning"} />
                    </Icon>
                    <Typography variant="body1" color={"error"} fontWeight={700}>Not Available</Typography>
                </Stack>
                <Stack display={"flex"} direction={"row"} alignItems={"center"}>
                    <Typography variant="body1" color={"error"} fontWeight={700}>Reset to 0</Typography>
                    <Icon color="error">
                        <DeleteIcon />
                    </Icon>
                </Stack>
            </Stack>
            <motion.div
                drag={product.quantity ? "x" : undefined}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                    if (constainerRef.current && positionRef.current) {
                        const positionRect = positionRef.current.getClientRects()[0]
                        const rect = constainerRef.current.getClientRects()[0]

                        const {
                            x,
                            width
                        } = rect
                        const movedPercent = (Math.abs(positionRect.x - x) / width)
                        if (movedPercent < 0.1) {
                            setAction("")
                        } else {
                            const currentAction = x > positionRect.x ? "not-available" : "delete"
                            setAction(currentAction)
                        }
                    }
                    info.point.x = 0;
                }}
                // onDrag={() => {
                // }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    background: "white",
                    zIndex: 1,
                }}
            >
                <Stack sx={{
                    minHeight: "45px",
                }} ref={constainerRef} >
                    {content}
                </Stack>
            </motion.div>
        </Stack>
    )
}

export default AdminProductRefilItem