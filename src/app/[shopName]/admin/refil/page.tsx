import AdminProductsListToRefil from "@/components/AdminProductsListToRefil";
import { Container, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import AdminHeader from "@/components/AdminHeader";

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
            <AdminHeader heading="Refil Products" shopName={shopName} />
            <AdminProductsListToRefil products={products} />
        </Container>
    )
}