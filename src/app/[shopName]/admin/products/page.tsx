import { Container, Stack, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import AdminProductsList from "@/components/AdminProductsList";

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
                    createdAt: "desc",
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    })

    return (
        <Container maxWidth={"md"}>
            <Typography variant="h3" fontWeight={700}>Products</Typography>
            <AdminProductsList products={products} shop={shop} />
        </Container>
    )
}