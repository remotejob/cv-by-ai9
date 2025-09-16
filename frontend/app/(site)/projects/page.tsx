import { loadProjectsServer, paginateProjectsServer } from '@/lib/content-server';
import { generateMetadata } from '@/lib/metadata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectsEmptyState } from '@/components/empty-state';

export const metadata = generateMetadata({
  title: 'Projects',
  description: 'Browse all DevOps projects including infrastructure automation, cloud deployments, and CI/CD pipelines.',
  url: '/projects',
});

export default async function ProjectsPage() {
  const projects = await loadProjectsServer();
  const currentPage = 1;
  const itemsPerPage = 12;

  const paginatedResult = paginateProjectsServer(projects, {
    page: currentPage,
    limit: itemsPerPage
  });

  if (currentPage > paginatedResult.totalPages && paginatedResult.totalPages > 0) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20" id="main-content">
      <section className="py-16 px-4" aria-labelledby="projects-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="projects-heading" className="text-heading-xl font-bold text-white mb-4">
              All Projects
            </h1>
            <p className="text-heading-lg text-gray-5 max-w-3xl mx-auto">
              A collection of {projects.length} projects showcasing DevOps, automation, and infrastructure solutions
            </p>
          </div>

          {paginatedResult.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedResult.data.map((project) => (
                <Card key={project.id} className="bg-card-bg border-gray-700 hover:border-accent transition-colors h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-heading-md">{project.title}</CardTitle>
                      {project.featured && (
                        <div className="inline-block bg-accent text-black px-2 py-1 rounded text-xs font-bold flex-shrink-0 ml-2">
                          FEATURED
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <CardDescription className="text-gray-5 text-body mb-4 flex-grow">
                      {project.summary}
                    </CardDescription>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button asChild variant="outline" size="sm" className="flex-grow">
                        <Link href={`/projects/${project.slug}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm" className="bg-accent text-black hover:bg-accent/90">
                        <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                          GitLab
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-12">
              <ProjectsEmptyState />
            </div>
          )}

          {/* Pagination */}
          {paginatedResult.totalPages > 1 && (
            <nav
              className="flex justify-center items-center gap-4"
              role="navigation"
              aria-label="Projects pagination"
            >
              <Button
                asChild
                variant="outline"
                disabled={currentPage === 1}
                className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Link
                  href={`/projects?page=${currentPage - 1}`}
                  aria-label={`Go to page ${currentPage - 1}`}
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </Link>
              </Button>

              <div className="flex gap-2" role="group" aria-label="Page numbers">
                {Array.from({ length: Math.min(paginatedResult.totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (paginatedResult.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= paginatedResult.totalPages - 2) {
                    pageNum = paginatedResult.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      asChild
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <Link
                        href={`/projects?page=${pageNum}`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </Link>
                    </Button>
                  );
                })}
              </div>

              <Button
                asChild
                variant="outline"
                disabled={currentPage === paginatedResult.totalPages}
                className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <Link
                  href={`/projects?page=${currentPage + 1}`}
                  aria-label={`Go to page ${currentPage + 1}`}
                  aria-disabled={currentPage === paginatedResult.totalPages}
                >
                  Next
                </Link>
              </Button>
            </nav>
          )}

          {paginatedResult.totalPages > 1 && (
            <div className="text-center mt-4 text-gray-5 text-body" role="status" aria-live="polite">
              Page {currentPage} of {paginatedResult.totalPages} ({paginatedResult.total} projects)
            </div>
          )}
        </div>
      </section>
    </main>
  );
}