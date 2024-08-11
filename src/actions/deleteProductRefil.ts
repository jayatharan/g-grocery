"use server"
import prisma from "@/lib/prisma";

export default async function deleteProductRefil(formData: FormData) {
    const productId = parseInt(formData.get("id")?.toString() ?? "0") 

    await prisma.refil.deleteMany({
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
            refils: {
                where: {
                    done: false,
                }
            }
        },
    })

    return product;
}