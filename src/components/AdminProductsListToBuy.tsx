"use client"

import { FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material"
import { Buy, Product } from "@prisma/client"
import { useMemo, useState } from "react"
import AdminProductBuyItem from "./AdminProductBuyItem"

export interface ProductWithBuy extends Product {
    buys: Buy[],
}

interface Props {
    products: ProductWithBuy[]
}

const AdminProductsListToBuy = ({
    products
}: Props) => {
    const [productList, setProductList] = useState<ProductWithBuy[]>(products);
    const [search, setSearch] = useState("")
    const [toBuyOnly, setToBuyOnly] = useState(false)

    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            const searchLower = search.toLowerCase();
            const nameMatches = product.name.toLowerCase().includes(searchLower);
            const descriptionMatches = product.description?.toLowerCase().includes(searchLower) || false;
            const categoryMatches = product.category.toLowerCase().includes(searchLower);
            return nameMatches || descriptionMatches || categoryMatches;
        }).filter(product => {
            if(toBuyOnly){
                return product.buys.length
            }
            return true;
        }).map((product => ({
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

    return (
        <Stack spacing={2}>
            <Stack>
                <TextField
                    size='small'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
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
                        <AdminProductBuyItem product={product} key={product.id} onSave={handleSave} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default AdminProductsListToBuy;