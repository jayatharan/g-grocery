import prisma from "@/lib/prisma";

export default async function getFormatedBarcodes (shopName: string) {
    const barcodes = await prisma.barcode.findMany({
        where: {
            product: {
                shop: {
                    nameUnique: shopName,
                }
            }
        },
        select: {
            productId: true, 
            code: true
        }
    })

    const barcodesMap = new Map<string, number>()

    barcodes.forEach(barcode => {
        barcodesMap.set(barcode.code, barcode.productId)
    })

    return barcodesMap;
}