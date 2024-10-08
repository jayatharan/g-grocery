"use client"
import { FormControlLabel, IconButton, InputAdornment, Stack, Switch, TextField, Typography } from '@mui/material'
import { Barcode, Price, Product, Shop } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import AdminProductItem from './AdminProductItem'
import AdminProductForm from './AdminProductForm'
import ClearIcon from '@mui/icons-material/Clear';
import { BarcodeScanner } from 'react-barcode-scanner'
import "react-barcode-scanner/polyfill"

export interface ProductWithPrice extends Product {
    prices: Price[];
    barcodes: { code: string; }[];
}

interface Props {
    products: ProductWithPrice[], 
    shop: Shop,
    barcodesMap: Map<string, number>,
}

export const calculateMatchPercentage = (searchLower: string, text: string) => {
    if (!text) return 0;
    const words = searchLower.split(" ");
    const matches = words.filter(word => text.includes(word)).length;
    return (matches / words.length) * 100;
};

function AdminProductsList({
    products,
    shop,
    barcodesMap
}: Props) {
    const [productList, setProductList] = useState<ProductWithPrice[]>(products);
    const [search, setSearch] = useState("")
    const [addNew, setAddNew] = useState(false)
    const [zeroPriceOnly, setZeroPriceOnly] = useState(false)
    const [isBarcode, setIsBarCode] = useState(false)

    const filteredProducts = useMemo(() => {
        if(barcodesMap.has(search.trim())){
            const productId = barcodesMap.get(search.trim())
            setIsBarCode(true);
            return productList.filter(product => product.id === productId);
        }

        setIsBarCode(false);
        return productList.filter(product => {
            if (zeroPriceOnly) {
                if (product.prices.length == 0) return true;
                else if (product.prices[0].price <= 0) return true;
                else return false
            }
            return true
        }).map(product => {
            const searchLower = search.trim().toLowerCase();
            const text = [product.name, product.description ?? "", product.category??""].join().toLowerCase()
            const matchedPercentage = calculateMatchPercentage(searchLower, text);
            return {
                ...product,
                matchedPercentage
            };
        }).filter(product => product.matchedPercentage > 0).sort((a, b) => b.matchedPercentage - a.matchedPercentage);
    }, [productList, search, zeroPriceOnly]);

    const handleSaveProduct = (savedProduct: ProductWithPrice, isNew?: boolean) => {
        if(savedProduct.barcodes.length){
            barcodesMap.set(savedProduct.barcodes[0].code, savedProduct.id)
        }
        if (isNew) {
            setProductList(prev => [savedProduct, ...prev])
        } else {
            setProductList(prev => {
                return prev.map(product => {
                    if (savedProduct.id === product.id) return savedProduct;
                    return product;
                })
            })
        }
    }

    return (
        <Stack spacing={2}>
            {/* <BarcodeScanner onCapture={(barcode) => console.log(barcode)}/> */}
            <Stack py={1}>
                <Stack display={'flex'} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography variant='h6' fontWeight={700}>Add New Product</Typography>
                    <Switch size='medium' checked={addNew} onClick={() => setAddNew(prev => !prev)} />
                </Stack>
                {addNew && (
                    <AdminProductForm addNew={addNew} shopId={shop.id} onSave={(savedProduct) => handleSaveProduct(savedProduct, true)} products={productList} code={isBarcode ? search.trim() : ""} />
                )}
            </Stack>
            <Stack>
                <TextField
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
                <Stack display={"flex"} direction={"row"} justifyContent={"flex-end"}>
                    <FormControlLabel control={<Switch checked={zeroPriceOnly} onClick={() => setZeroPriceOnly(prev => !prev)} />} label="Zero Price Only" />
                </Stack>
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
                        <Typography textAlign={'right'} variant='h6' fontWeight={700}>
                            Price (EUR)
                        </Typography>
                    </Stack>
                </Stack>
                {filteredProducts.map(product => (
                    <AdminProductItem key={product.id} product={product} onSave={handleSaveProduct} code={isBarcode ? search.trim() : ""} />
                ))}
            </Stack>
        </Stack>
    )
}

export default AdminProductsList