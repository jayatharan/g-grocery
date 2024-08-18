"use server"
import prisma from "@/lib/prisma";

export default async function deleteProductBuy(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 

    await prisma.buy.deleteMany({
        where: {
            productId,
            done: false,
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