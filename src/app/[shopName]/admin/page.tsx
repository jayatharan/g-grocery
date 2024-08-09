import AdminHeader from "@/components/AdminHeader";
import prisma from "@/lib/prisma";
import { Container, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";

interface Props {
    params: {
        shopName: string;
    };
}

export default async function AdminHomeScreen({
    params: {
        shopName
    }
}: Props) {
    const shop = await prisma.shop.findUniqueOrThrow({
        where: {
            nameUnique: shopName,
        }
    })

    return (
        <Container maxWidth={"md"}>
            <AdminHeader heading={shop.name} shopName={shopName} />
            <Stack spacing={2}>
                <Stack>
                    <Link href={`/${shopName}/admin/products`}>
                        <Typography variant="h5">Products</Typography>
                    </Link>
                </Stack>
                <Stack>
                    <Link href={`/${shopName}/admin/buy`}>
                        <Typography variant="h5">Buy Products</Typography>
                    </Link>
                </Stack>
                <Stack>
                    <Link href={`/${shopName}/admin/refil`}>
                        <Typography variant="h5">Refil Products</Typography>
                    </Link>
                </Stack>
            </Stack>
        </Container>
    )
}