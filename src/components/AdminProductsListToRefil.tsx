"use client"

import { Switch, FormControlLabel, IconButton, Stack, TextField, Typography, InputAdornment } from "@mui/material"
import { Product, Refil } from "@prisma/client"
import { useMemo, useRef, useState } from "react"
import AdminProductRefilItem from "./AdminProductRefilItem";
import ClearIcon from '@mui/icons-material/Clear';
import { calculateMatchPercentage } from "./AdminProductsList";

export interface ProductWithRefil extends Product {
    refils: Refil[],
}

interface Props {
    products: ProductWithRefil[]
}

const AdminProductsListToRefil = ({
    products
}: Props) => {
    const searchBoxRef = useRef<HTMLInputElement>(null)
    const [productList, setProductList] = useState<ProductWithRefil[]>(products);
    const [search, setSearch] = useState("")
    const [toRefilOnly, setToRefilOnly] = useState(false)
    const [hideNotAvailable, setHideNotAvailable] = useState(false);

    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            if (toRefilOnly) {
                return product.refils.length
            }
            return true;
        }).map(product => {
            const searchLower = search.trim().toLowerCase();
            const text = [product.name, product.description ?? "", product.category ?? ""].join().toLowerCase()
            const matchedPercentage = calculateMatchPercentage(searchLower, text);
            return {
                ...product,
                matchedPercentage
            };
        }).filter(product => product.matchedPercentage > 0).sort((a, b) => b.matchedPercentage - a.matchedPercentage).map((product => ({
            ...product,
            quantity: product.refils.reduce((qty, refil) => qty + refil.quantity, 0),
            isNotAvailable: product.refils.find((refil) => refil.notAvailable) ? true : false
        }))).filter(product => {
            if (hideNotAvailable) {
                return !product.isNotAvailable
            }
            return true
        });
    }, [productList, search, toRefilOnly, hideNotAvailable]);

    const handleSave = (savedProduct: ProductWithRefil) => {
        setProductList(prev => prev.map(product => {
            if (product.id === savedProduct.id) return savedProduct
            return product
        }))
    }

    const focusSearch = (clear: boolean) => {
        if (clear) {
            setSearch("")
        }
        searchBoxRef.current?.click()
        searchBoxRef.current?.focus()
        searchBoxRef.current?.click()
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
                                <IconButton size='small' onClick={() => setSearch("")}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : undefined
                    }}
                    placeholder='Search...'
                    fullWidth
                />
                <Typography onClick={()=>focusSearch(true)}>Test</Typography>
                <Stack display={"flex"} direction={"row"} justifyContent={"flex-end"}>
                    <FormControlLabel control={<Switch checked={hideNotAvailable} onClick={() => setHideNotAvailable(prev => !prev)} />} label="Hide Not Available" />
                    <FormControlLabel control={<Switch checked={toRefilOnly} onClick={() => setToRefilOnly(prev => !prev)} />} label="Refil Only" />
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
                        <AdminProductRefilItem product={product} key={product.id} onSave={handleSave} focusSearch={focusSearch} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default AdminProductsListToRefil