"use server"
import prisma from "@/lib/prisma";

export default async function saveProduct(formData: FormData) {
    const shopId = parseInt(formData.get("shopId")?.toString() ?? "0") 
    const id = parseInt(formData.get("id")?.toString() ?? "0") 
    const name = formData.get("name")?.toString() ?? ""
    const category = formData.get("category")?.toString() ?? "Others"
    const productPrice = parseFloat(formData.get("price")?.toString() ?? "0")
    const description = formData.get("description")?.toString() ?? "";
    const code = formData.get("code")?.toString() ?? "";

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

    let barcodeId: number | null = null;
    if(code) {
        const barcode = await prisma.barcode.upsert({
            where: {
                code,
            },
            create: {
                code,
                productId: product.id,
            },
            update: {
                productId: product.id,
            }
        })

        barcodeId = barcode.id;
    }

    const price = await prisma.price.create({
        data: {
            productId: product.id,
            price: productPrice,
            barcodeId
        }
    })    

    const barcodes = await prisma.barcode.findMany({
        where: {
            productId: product.id
        },
        take: 1,
        orderBy: {
            id: "desc"
        },
        select: {
            code: true,
        }
    })

    return {
        ...product,
        prices: [
            price
        ],
        barcodes
    }
}