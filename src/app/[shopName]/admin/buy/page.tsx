import { Container, Stack, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import AdminProductsListToBuy from "@/components/AdminProductsListToBuy";

interface Props {
    params: {
        shopName: string;
    };
}

export default async function AdminRefilProductsScreen({
    params: {
        shopName
    }
}: Props) {
    const products = await prisma.product.findMany({
        where: {
            shop: {
                nameUnique: shopName,
            }
        },
        include: {
            buys: {
                where: {
                    done: false,
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    })

    return (
        <Container maxWidth={"md"}>
            <Typography variant="h3" fontWeight={700}>Buy Products</Typography>
            <AdminProductsListToBuy products={products} />
        </Container>
    )
}
