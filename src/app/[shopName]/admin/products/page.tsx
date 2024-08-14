import { Container, Stack, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import AdminProductsList from "@/components/AdminProductsList";
import AdminHeader from "@/components/AdminHeader";
import getFormatedBarcodes from "@/actions/getFormatedBarcodes";

interface Props {
    params: {
        shopName: string;
    };
}

export default async function AdminProductsScreen({
    params: {
        shopName
    }
}: Props) {
    const shop = await prisma.shop.findUniqueOrThrow({
        where: {
            nameUnique: shopName,
        }
    })

    const products = await prisma.product.findMany({
        where: {
            shop: {
                nameUnique: shopName,
            }
        },
        include: {
            prices: {
                take: 1,
                orderBy: {
                    id: "desc",
                }
            },
            barcodes: {
                take: 1,
                orderBy: {
                    id: "desc",
                },
                select: {
                    code: true,
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    })

    const barcodesMap = await getFormatedBarcodes(shopName);

    return (
        <Container maxWidth={"md"}>
            <AdminHeader heading="Products" shopName={shopName} />
            <AdminProductsList products={products} shop={shop} barcodesMap={barcodesMap} />
        </Container>
    )
}