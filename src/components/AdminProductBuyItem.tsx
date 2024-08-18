import { Button, ButtonGroup, IconButton, Stack, TextField, Typography } from "@mui/material"
import { ProductWithBuy } from "./AdminProductsListToBuy"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DoneIcon from '@mui/icons-material/Done';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import updateProductBuyQuantity from "@/actions/updateProductBuyQuantity";
import doneProductBuy from "@/actions/doneProductBuy";
import { motion } from "framer-motion"
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import deleteProductBuy from "@/actions/deleteProductBuy";

export interface ProductWithBuyAndQuantity extends ProductWithBuy {
    quantity: number;
}

interface Props {
    product: ProductWithBuyAndQuantity
    onSave: (savedProduct: ProductWithBuy) => void;
    focusSearch: (clear: boolean) => void;
}

const AdminProductBuyItem = ({
    product,
    onSave,
    focusSearch
}: Props) => {
    const positionRef = useRef<HTMLDivElement>(null);
    const constainerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(product.quantity.toString())
    const [action, setAction] = useState("")

    const updateBuy = useCallback(async (clear: boolean) => {
        let qty = 0;
        if (quantity) {
            qty = parseInt(quantity) - product.quantity
        }
        setLoading(true)
        const productCopy = { ...product }
        onSave({
            ...product,
            buys: [...product.buys, {
                id: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false,
                productId: product.id,
                quantity: qty,
            }]
        })
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())
            formData.set("quantity", qty.toString())

            const savedProduct = await updateProductBuyQuantity(formData)
            onSave(savedProduct)
        } catch (error) {
            onSave(productCopy)
            console.log(error)
        }
        setLoading(false)
        focusSearch(clear)
    }, [quantity, product])

    const doneBuy = useCallback(async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())

            const savedProduct = await doneProductBuy(formData)
            onSave(savedProduct)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }, [product])

    const actionButton = useMemo(() => {
        if (quantity && product.quantity !== parseInt(quantity)) {
            return (
                <IconButton disabled={loading} size="small" onClick={() => updateBuy(false)}>
                    <UpgradeIcon />
                </IconButton>
            )
        } else if (product.quantity !== 0) {
            return (
                <IconButton disabled={loading} size="small" onClick={doneBuy}>
                    <DoneIcon />
                </IconButton>
            )
        }

        return null;
    }, [product, quantity, updateBuy, loading, doneBuy])

    const actionBuy = useCallback(async () => {
        setLoading(true)
        const productCopy = { ...product }
        if (action == "delete") {
            onSave({
                ...product,
                buys: []
            })
        }
        const currentAction = action;
        setAction("")
        try {
            const formData = new FormData()
            formData.set("id", product.id.toString())
            const savedProduct = currentAction == "not-available" ? product : await deleteProductBuy(formData)
            setAction("")
            onSave(savedProduct)
        } catch (error) {
            onSave(productCopy)
            setAction(currentAction)
            console.log(error)
        }
        setLoading(false)

    }, [product, action])

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
                        <Button variant="contained" onClick={actionBuy}>Yes</Button>
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
                            onKeyDown={(event) => {
                                if(event.key == "Enter"){
                                    updateBuy(true)
                                }
                            }}
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
    }, [action, product, quantity, setQuantity, actionBuy, setAction])

    useEffect(() => {
        setQuantity(product.quantity.toString())
    }, [product])

    return (
        <Stack key={product.id} ref={positionRef} pb={1} sx={{
            borderBottom: "2px solid grey",
            overflow: "hidden",
            position: "relative"
        }}>
            <Stack display={"flex"} direction={"row"} justifyContent={"space-between"} alignItems={"center"} sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                zIndex: 0
            }}>
                <Stack display={"flex"} direction={"row"} alignItems={"center"}>
                    <RotateLeftIcon color="error" />
                    <Typography variant="body1" color={"error"} fontWeight={700}>Reset to 0</Typography>
                </Stack>
                <Stack display={"flex"} direction={"row"} alignItems={"center"}>
                    <Typography variant="body1" color={"primary"} fontWeight={700}>Done</Typography>
                    <DoneIcon color={"primary"} />
                </Stack>
            </Stack>
            <motion.div
                drag={product.quantity ? "x" : undefined}
                dragConstraints={{ left: 0, right: 0 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                    background: "white",
                    zIndex: 1,
                }}
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
                            const currentAction = x > positionRect.x ? "delete" : "done"
                            if(currentAction == "done"){
                                doneBuy()
                            }else{
                                setAction(currentAction)
                            }
                        }
                    }
                    info.point.x = 0;
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

export default AdminProductBuyItem