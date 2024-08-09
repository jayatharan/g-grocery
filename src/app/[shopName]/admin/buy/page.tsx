import { Container, Stack, Typography } from "@mui/material";
import prisma from "@/lib/prisma";
import AdminProductsListToBuy from "@/components/AdminProductsListToBuy";
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
            <AdminHeader heading="Buy Products" shopName={shopName} />
            <AdminProductsListToBuy products={products} />
        </Container>
    )
}
