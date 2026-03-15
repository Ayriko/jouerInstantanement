import OrderDetail from './OrderDetail';

interface PageProps {
    params: Promise<{ orderId: string }>;
}

export default async function Page({ params }: Readonly<PageProps>) {
    const { orderId } = await params;
    return <OrderDetail orderId={orderId} />;
}
