import React, { useState } from 'react'
import { ProductWithPrice } from './AdminProductsList'
import { Stack, Typography } from '@mui/material'
import AdminProductForm from './AdminProductForm'
import AdminProductItemView from './AdminProductItemView';

interface Props {
    product: ProductWithPrice,
    onSave:  (savedProduct: ProductWithPrice) => void;
}

const AdminProductItem = ({
    product,
    onSave,
}: Props) => {
    const [edit, setEdit] = useState(false)

    const handleSave =  (savedProduct: ProductWithPrice) => {
        onSave(savedProduct)
        setEdit(false);
    }

    if(edit) {
        return <AdminProductForm onSave={handleSave} shopId={product.shopId} product={product} />
    }

    return (
        <Stack key={product.id} onClick={()=> setEdit(true)} >
            <AdminProductItemView product={product} />
        </Stack>
    )
}

export default AdminProductItem