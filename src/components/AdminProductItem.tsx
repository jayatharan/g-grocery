import React, { useState } from 'react'
import { ProductWithPrice } from './AdminProductsList'
import { Stack, Typography } from '@mui/material'
import AdminProductForm from './AdminProductForm'
import AdminProductItemView from './AdminProductItemView';

interface Props {
    product: ProductWithPrice,
    onSave:  (savedProduct: ProductWithPrice) => void;
    code?: string;
}

const AdminProductItem = ({
    product,
    onSave,
    code,
}: Props) => {
    const [edit, setEdit] = useState(false)

    const handleSave =  (savedProduct: ProductWithPrice) => {
        onSave(savedProduct)
        setEdit(false);
    }

    if(edit) {
        return <AdminProductForm onSave={handleSave} shopId={product.shopId} product={product} code={code ? code : product.barcodes[0]?.code??""} />
    }

    return (
        <Stack key={product.id} onClick={()=> setEdit(true)} >
            <AdminProductItemView product={product} />
        </Stack>
    )
}

export default AdminProductItem