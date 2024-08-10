import { Autocomplete, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { ProductWithPrice } from './AdminProductsList'
import saveProduct from '@/actions/saveProduct';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
    shopId: number,
    product?: ProductWithPrice,
    onSave: (savedProduct: ProductWithPrice) => void;
    addNew?: boolean;
    products?: ProductWithPrice[]
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
    onSave,
    addNew,
    products
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(defaultValue)
    const [reset, setReset] = useState(false);

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

            if (reset) setFormData(defaultValue)

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

    const clearName = () => {
        setFormData(prev => {
            const nameSplit = prev.name.split(' ')
            nameSplit.pop()
            return {
                ...prev,
                name: nameSplit.join(' ').trim()
            }
        })
    }

    return (
        <Stack sx={{
            borderBottom: "2px solid grey"
        }}>
            <Stack
                display={"flex"}
                direction={"row"}
            >
                <Stack display={"flex"} flex={2} >
                    {products?(
                        <Autocomplete
                            size='small'
                            options={products.map(product => product.name)}
                            value={formData.name}
                            onChange={(_, name) => {
                                if(name){
                                    const product = products.find(p => p.name == name)
                                    if(product){
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            category: product.category,
                                            description: product.description??"",
                                        }))
                                    }
                                }
                            }}
                            onInputChange={(_, name) => {
                                setFormData(prev => ({
                                    ...prev,
                                    name: name? name : prev.name
                                }))
                            }}
                            renderInput={(params) => <TextField 
                                {...params}
                                placeholder='Name'
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton size='small' onClick={clearName}>
                                                <ArrowBackIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )                              
                                }}
                            />} 
                            freeSolo
                        />
                    ) : (
                        <TextField
                            size='small'
                            value={formData.name}
                            placeholder='Name'
                            onChange={handleChange}
                            name="name"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton size='small' onClick={clearName}>
                                            <ArrowBackIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
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
            {addNew && (
                <FormControlLabel control={<Checkbox checked={reset} onClick={() => setReset(true)} />} label="Reset on Save" />
            )}
        </Stack>
    )
}

export default AdminProductForm