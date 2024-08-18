"use client"

import { FormControlLabel, IconButton, InputAdornment, Stack, Switch, TextField, Typography } from "@mui/material"
import { Buy, Product } from "@prisma/client"
import { useMemo, useRef, useState } from "react"
import AdminProductBuyItem from "./AdminProductBuyItem"
import ClearIcon from '@mui/icons-material/Clear';
import { calculateMatchPercentage } from "./AdminProductsList"

export interface ProductWithBuy extends Product {
    buys: Buy[],
}

interface Props {
    products: ProductWithBuy[]
}

const AdminProductsListToBuy = ({
    products
}: Props) => {
    const searchBoxRef = useRef<HTMLInputElement>(null)
    const [productList, setProductList] = useState<ProductWithBuy[]>(products);
    const [search, setSearch] = useState("")
    const [toBuyOnly, setToBuyOnly] = useState(false)

    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            if(toBuyOnly){
                return product.buys.length
            }
            return true;
        }).map(product => {
            const searchLower = search.trim().toLowerCase();
            const text = [product.name, product.description ?? "", product.category??""].join().toLowerCase()
            const matchedPercentage = calculateMatchPercentage(searchLower, text);
            return {
                ...product,
                matchedPercentage
            };
        }).filter(product => product.matchedPercentage > 0).sort((a, b) => b.matchedPercentage - a.matchedPercentage).map((product => ({
            ...product,
            quantity: product.buys.reduce((qty, refil) => qty+refil.quantity, 0)
        })));
    }, [productList, search, toBuyOnly]);

    const handleSave = (savedProduct: ProductWithBuy) => {
        setProductList(prev => prev.map(product => {
            if(product.id === savedProduct.id) return savedProduct
            return product
        }))
    }

    const focusSearch = (clear: boolean) => {
        if (clear) {
            setSearch("")
        }
        searchBoxRef.current?.focus()
    }

    return (
        <Stack spacing={2}>
            <Stack>
            <TextField
                   inputRef={searchBoxRef}
                    size='small'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    InputProps={{
                        endAdornment: search ? (
                            <InputAdornment position='end'>
                                <IconButton size='small' onClick={()=>setSearch("")}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined
                    }}
                    placeholder='Search...'
                    fullWidth
                />
                <Stack display={"flex"} direction={"row"} justifyContent={"flex-end"}>
                    <FormControlLabel control={<Switch checked={toBuyOnly} onClick={() => setToBuyOnly(prev => !prev)} />} label="Buy Only" />
                </Stack>
                <Stack spacing={1}>
                    <Stack
                        display={"flex"}
                        direction={"row"}
                        sx={{
                            borderBottom: "2px solid grey"
                        }}
                    >
                        <Stack display={"flex"} flex={2} >
                            <Typography variant='h6' fontWeight={700}>
                                Name
                            </Typography>
                        </Stack>
                        <Stack display={"flex"} flex={1}>
                            <Typography variant='h6' fontWeight={700}>
                                Qty
                            </Typography>
                        </Stack>
                    </Stack>
                    {filteredProducts.map(product => (
                        <AdminProductBuyItem product={product} key={product.id} onSave={handleSave} focusSearch={focusSearch} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default AdminProductsListToBuy;