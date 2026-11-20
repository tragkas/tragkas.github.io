import ErrorBoundary from "@/components/ErrorBoundary";
import ProjectsArchiveView from "@/components/ProjectsArchiveView";
import { portfolioData } from "@/data/portfolio";

export default function ProjectsPage() {
  return (
    <ErrorBoundary>
      <ProjectsArchiveView data={portfolioData} />
    </ErrorBoundary>
  );
}
