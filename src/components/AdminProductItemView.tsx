import React from 'react'
import { ProductWithPrice } from './AdminProductsList'
import { Stack, Typography } from '@mui/material'

interface Props {
    product: ProductWithPrice,
}

const AdminProductItemView = ({
    product
}: Props) => {
  return (
    <Stack key={product.id} sx={{
        borderBottom: "2px solid grey"
    }} >
        <Stack
            display={"flex"}
            direction={"row"}
        >
            <Stack display={"flex"} flex={2} >
                <Typography variant='body1' fontWeight={700}>
                    {product.name}
                </Typography>
            </Stack>
            <Stack display={{
                xs: "none",
                sm: "flex"
            }} flex={1} >
                <Typography variant='body1' fontWeight={700}>
                    {product.category}
                </Typography>
            </Stack>
            <Stack display={"flex"} flex={1}>
                <Typography textAlign={'right'} variant='body1' fontWeight={700}>
                    {product.prices.length && product.prices[0].price.toFixed(2)}
                </Typography>
            </Stack>
        </Stack>
        <Typography variant='caption'>{product.description}</Typography>
    </Stack>
  )
}

export default AdminProductItemView