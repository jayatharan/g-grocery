"use server"
import prisma from "@/lib/prisma";

export default async function saveProduct(formData: FormData) {
    const shopId = parseInt(formData.get("shopId")?.toString() ?? "0") 
    const id = parseInt(formData.get("id")?.toString() ?? "0") 
    const name = formData.get("name")?.toString() ?? ""
    const category = formData.get("category")?.toString() ?? "Others"
    const productPrice = parseFloat(formData.get("price")?.toString() ?? "0")
    const description = formData.get("description")?.toString() ?? "";

    const product = await prisma.product.upsert({
        where: {
            id,
        },
        create: {
            name,
            category,
            description,
            shopId
        },
        update:{
            name,
            category,
            description,
            shopId
        }
    })

    const price = await prisma.price.create({
        data: {
            productId: product.id,
            price: productPrice,
        }
    })    

    return {
        ...product,
        prices: [
            price
        ]
    }
}