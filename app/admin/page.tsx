import type { Metadata } from "next";
import AdminStudio from "@/components/AdminStudio";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getPortfolioSnapshot } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const snapshot = await getPortfolioSnapshot();

  return (
    <ErrorBoundary>
      <AdminStudio initialData={snapshot} />
    </ErrorBoundary>
  );
}
