import ErrorBoundary from "@/components/ErrorBoundary";
import ProjectsArchiveView from "@/components/ProjectsArchiveView";
import { getPortfolioSnapshot } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const snapshot = await getPortfolioSnapshot();

  return (
    <ErrorBoundary>
      <ProjectsArchiveView initialData={snapshot} />
    </ErrorBoundary>
  );
}
