"use client"

import { Checkbox, FormControl, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material"
import { Price, Product, Refil } from "@prisma/client"
import { useMemo, useState } from "react"
import UpgradeIcon from '@mui/icons-material/Upgrade';
import DoneIcon from '@mui/icons-material/Done';
import AdminProductRefilItem from "./AdminProductRefilItem";

export interface ProductWithRefil extends Product {
    refils: Refil[],
}

interface Props {
    products: ProductWithRefil[]
}

const AdminProductsListToRefil = ({
    products
}: Props) => {
    const [productList, setProductList] = useState<ProductWithRefil[]>(products);
    const [search, setSearch] = useState("")
    const [toRefilOnly, setToRefilOnly] = useState(false)

    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            const searchLower = search.toLowerCase();
            const nameMatches = product.name.toLowerCase().includes(searchLower);
            const descriptionMatches = product.description?.toLowerCase().includes(searchLower) || false;
            const categoryMatches = product.category.toLowerCase().includes(searchLower);
            return nameMatches || descriptionMatches || categoryMatches;
        }).filter(product => {
            if(toRefilOnly){
                return product.refils.length
            }
            return true;
        }).map((product => ({
            ...product,
            quantity: product.refils.reduce((qty, refil) => qty+refil.quantity, 0)
        })));
    }, [productList, search, toRefilOnly]);

    const handleSave = (savedProduct: ProductWithRefil) => {
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
                    <FormControlLabel control={<Checkbox value={toRefilOnly} onClick={() => setToRefilOnly(prev => !prev)} />} label="Refil Only" />
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
                        <AdminProductRefilItem product={product} key={product.id} onSave={handleSave} />
                    ))}
                </Stack>
            </Stack>
        </Stack>
    )
}

export default AdminProductsListToRefil