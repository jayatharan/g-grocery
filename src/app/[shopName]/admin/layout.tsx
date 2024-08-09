import AdminPasskeyProtector from "@/components/AdminPasskeyProtector";

export default async function RootLayout(props: { 
    children: React.ReactNode,
    params: {
        shopName: string;
    };
 }) {
    
    const shop = await prisma.shop.findUniqueOrThrow({
        where: {
            nameUnique: props.params.shopName,
        }
    })


    return (
        <AdminPasskeyProtector shop={shop}>
            {props.children}
        </AdminPasskeyProtector>
    )
}