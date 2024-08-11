"use server"
import prisma from "@/lib/prisma";

export default async function notAvailableProductRefil(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 

    await prisma.refil.updateMany({
        where: {
            productId,
            done: false,
        },
        data: {
            notAvailable: true,
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