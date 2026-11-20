import ClarityAnalytics from "@/components/ClarityAnalytics";
import ErrorBoundary from "@/components/ErrorBoundary";
import MinimalPortfolioView from "@/components/MinimalPortfolioView";
import { getPortfolioSnapshot } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const snapshot = await getPortfolioSnapshot();

  return (
    <ErrorBoundary>
      <ClarityAnalytics />
      <MinimalPortfolioView initialData={snapshot} />
    </ErrorBoundary>
  );
}
