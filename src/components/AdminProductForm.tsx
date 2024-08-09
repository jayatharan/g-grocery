import { Button, Stack, TextField } from '@mui/material'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ProductWithPrice } from './AdminProductsList'
import saveProduct from '@/actions/saveProduct';

interface Props {
    shopId: number,
    product?: ProductWithPrice,
    onSave: (savedProduct: ProductWithPrice) => void;
}

const defaultValue = {
    name: "",
    category: "Others",
    price: 0.00,
    description: ""
}

const AdminProductForm = ({
    shopId,
    product,
    onSave
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(defaultValue)

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const saveShopProduct = async () => {
        if (!formData.name) return;
        setLoading(true)
        try {
            const productFormData = new FormData()
            productFormData.set("shopId", shopId.toString())
            productFormData.set("name", formData.name)
            productFormData.set("category", formData.category)
            productFormData.set("price", formData.price.toString())
            productFormData.set("description", formData.description)

            if (product) {
                productFormData.set("id", product.id.toString())
            }

            const savedProduct = await saveProduct(productFormData)
            onSave(savedProduct)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const initializeForm = () => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category,
                description: product.description ?? "",
                price: product.prices[0]?.price ?? 0
            })
        } else {
            setFormData(defaultValue)
        }
    }

    useEffect(() => {
        initializeForm()
    }, [product])

    return (
        <Stack sx={{
            borderBottom: "2px solid grey"
        }}>
            <Stack
                display={"flex"}
                direction={"row"}
            >
                <Stack display={"flex"} flex={2} >
                    <TextField
                        size='small'
                        value={formData.name}
                        placeholder='Name'
                        onChange={handleChange}
                        name="name"
                    />
                </Stack>
            </Stack>
            <Stack
                display={"flex"}
                direction={"row"}
            >
                <Stack display={"flex"} flex={3} >
                    <TextField
                        size='small'
                        value={formData.category}
                        placeholder='Category'
                        onChange={handleChange}
                        name="category"
                    />
                </Stack>
                <Stack display={"flex"} flex={2} >
                    <TextField
                        size='small'
                        type='number'
                        value={formData.price}
                        placeholder='Price'
                        onChange={handleChange}
                        name="price"
                    />
                </Stack>
            </Stack>
            <Stack
                display={"flex"}
                direction={"row"}
            >
                <TextField
                    size='small'
                    value={formData.description}
                    placeholder='Description'
                    onChange={handleChange}
                    name="description"
                    fullWidth
                />
                <Button variant='contained' disabled={loading} onClick={saveShopProduct}>Save</Button>
            </Stack>
        </Stack>
    )
}

export default AdminProductForm