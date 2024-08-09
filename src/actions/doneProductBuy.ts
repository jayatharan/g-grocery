"use server"
import prisma from "@/lib/prisma";

export default async function doneProductBuy(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 

    await prisma.buy.updateMany({
        where: {
            productId,
            done: false,
        },
        data: {
            done: true,
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