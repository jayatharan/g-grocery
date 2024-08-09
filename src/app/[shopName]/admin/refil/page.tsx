import AdminProductsListToRefil from "@/components/AdminProductsListToRefil";
import { Container, Typography } from "@mui/material";
import prisma from "@/lib/prisma";

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
            refils: {
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
            <Typography variant="h3" fontWeight={700}>Refil Products</Typography>
            <AdminProductsListToRefil products={products} />
        </Container>
    )
}