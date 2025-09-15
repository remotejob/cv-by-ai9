import { Project } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  showFeatured?: boolean;
  className?: string;
}

export function ProjectCard({ project, showFeatured = true, className = '' }: ProjectCardProps) {
  return (
    <Card
      className={`bg-card-bg border-gray-700 hover:border-accent transition-colors h-full ${className}`}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      aria-describedby={`project-description-${project.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle
            id={`project-title-${project.id}`}
            className="text-white text-heading-md line-clamp-2"
          >
            {project.title}
          </CardTitle>
          {showFeatured && project.featured && (
            <div className="inline-block bg-accent text-black px-2 py-1 rounded text-xs font-bold flex-shrink-0 ml-2" role="status" aria-label="Featured project">
              FEATURED
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full">
        {/* Image */}
        {project.ogImage && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={project.ogImage}
              alt={`Screenshot of ${project.title} project interface showing ${project.summary}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onError={(e) => {
                // Handle image loading errors
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center"><span class="text-gray-500">Image not available</span></div>';
                }
              }}
            />
          </div>
        )}

        {/* Description */}
        <CardDescription
          id={`project-description-${project.id}`}
          className="text-gray-5 text-body mb-4 line-clamp-3 flex-grow"
        >
          {project.summary}
        </CardDescription>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Technologies used">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                role="listitem"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                +{project.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-grow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`View details for ${project.title}: ${project.summary}`}
            >
              View Details
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-accent text-black hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitLab (opens in new tab)`}
            >
              GitLab
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectCardGridProps {
  projects: Project[];
  columns?: 1 | 2 | 3 | 4;
  showFeatured?: boolean;
}

export function ProjectCardGrid({ projects, columns = 3, showFeatured = true }: ProjectCardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          showFeatured={showFeatured}
        />
      ))}
    </div>
  );
}