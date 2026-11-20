import ClarityAnalytics from "@/components/ClarityAnalytics";
import ErrorBoundary from "@/components/ErrorBoundary";
import MinimalPortfolioView from "@/components/MinimalPortfolioView";
import { portfolioData } from "@/data/portfolio";

export default function Home() {
  return (
    <ErrorBoundary>
      <ClarityAnalytics />
      <MinimalPortfolioView data={portfolioData} />
    </ErrorBoundary>
  );
}
