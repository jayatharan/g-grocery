"use server"
import prisma from "@/lib/prisma";

export default async function updateProductBuyQuantity(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 
    const quantity = parseInt(formData.get("quantity")?.toString() ?? "0") 

    await prisma.buy.create({
        data:{
            productId,
            quantity
        }
    })

    const product = await prisma.product.findUniqueOrThrow({
        where: {
            id: productId,
        },
        include: {
            buys: {
                where: {
                    done: false,
                }
            }
        },
    })

    return product;
}