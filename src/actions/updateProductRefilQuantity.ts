"use server"
import prisma from "@/lib/prisma";

export default async function updateProductRefilQuantity(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 
    const quantity = parseInt(formData.get("quantity")?.toString() ?? "0") 

    await prisma.refil.create({
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
            refils: {
                where: {
                    done: false,
                }
            }
        },
    })

    return product;
}