"use client"
import { Stack, TextField, Typography } from '@mui/material'
import { Price, Product, Shop } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import AdminProductItem from './AdminProductItem'
import AdminProductForm from './AdminProductForm'

export interface ProductWithPrice extends Product {
    prices: Price[]
}

interface Props {
    products: ProductWithPrice[],
    shop: Shop,
}

function AdminProductsList({
    products,
    shop
}: Props) {
    const [productList, setProductList] = useState<ProductWithPrice[]>(products);
    const [search, setSearch] = useState("")

    const filteredProducts = useMemo(() => {
        return productList.filter(product => {
            const searchLower = search.toLowerCase();
            const nameMatches = product.name.toLowerCase().includes(searchLower);
            const descriptionMatches = product.description?.toLowerCase().includes(searchLower) || false;
            const categoryMatches = product.category.toLowerCase().includes(searchLower);
            return nameMatches || descriptionMatches || categoryMatches;
        });
    }, [productList, search]);

    const handleSaveProduct = (savedProduct:ProductWithPrice, isNew?: boolean)=> {
        if(isNew){
            setProductList(prev => [savedProduct, ...prev])
        }else{
            setProductList(prev => {
                return prev.map(product => {
                    if(savedProduct.id === product.id) return savedProduct;
                    return product;
                })
            })
        }
    }

    return (
        <Stack spacing={2}>
            <Stack py={1}>
                <Typography variant='h6' fontWeight={700}>Add New Product</Typography>
                <AdminProductForm shopId={shop.id} onSave={(savedProduct) => handleSaveProduct(savedProduct, true)} />
            </Stack>
            <Stack display={'flex'} direction={'row'} justifyContent={'flex-end'}>
                <TextField
                    size='small'
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder='Search...'
                    fullWidth
                />
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
                    <Stack display={{
                        xs: "none",
                        sm: "flex"
                    }} flex={1} >
                        <Typography variant='h6' fontWeight={700}>
                            Category
                        </Typography>
                    </Stack>
                    <Stack display={"flex"} flex={1}>
                        <Typography variant='h6' fontWeight={700}>
                            Price
                        </Typography>
                    </Stack>
                </Stack>
                {filteredProducts.map(product => (
                    <AdminProductItem key={product.id} product={product} onSave={handleSaveProduct} />
                ))}
            </Stack>
        </Stack>
    )
}

export default AdminProductsList