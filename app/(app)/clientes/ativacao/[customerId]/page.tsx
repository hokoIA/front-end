import { ActivationCustomerRealView } from "@/features/activation/activation-customer-real-view";
import { notFound } from "next/navigation";

export default async function ActivationCustomerPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  if (!/^\d+$/.test(customerId)) notFound();
  return <ActivationCustomerRealView customerId={customerId} />;
}
