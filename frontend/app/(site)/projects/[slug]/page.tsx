import { loadProjectBySlug } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Return available project slugs
  return [
    { slug: 'sample-project' }
  ];
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await loadProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back to Projects */}
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href="/projects">← Back to Projects</Link>
            </Button>
          </div>

          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-heading-xl font-bold text-white mb-2">
                  {project.title}
                </h1>
                {project.featured && (
                  <div className="inline-block bg-accent text-black px-3 py-1 rounded text-sm font-bold mb-4">
                    FEATURED PROJECT
                  </div>
                )}
              </div>
            </div>
            <p className="text-heading-lg text-gray-5 max-w-3xl">
              {project.summary}
            </p>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Description Section */}
              <Card className="bg-card-bg border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-5 text-body">
                    {project.summary}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Technical Details */}
              {project.tags.length > 0 && (
                <Card className="bg-card-bg border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Technologies Used</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Project Actions */}
            <div className="lg:col-span-1">
              <Card className="bg-card-bg border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white">Project Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full bg-accent text-black hover:bg-accent/90">
                    <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                      View on GitLab
                    </a>
                  </Button>
                  {project.ogImage && (
                    <div className="mt-4">
                      <Image
                        src={project.ogImage}
                        alt={`${project.title} preview`}
                        width={800}
                        height={400}
                        className="w-full rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Project Metadata */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-5">Status:</span>
                    <span className="text-white">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-5">Type:</span>
                    <span className="text-white">DevOps Project</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-5">Featured:</span>
                    <span className={project.featured ? "text-accent" : "text-gray-5"}>
                      {project.featured ? "Yes" : "No"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Projects */}
          <div className="mt-16">
            <h2 className="text-heading-lg font-bold text-white mb-8">
              More Projects
            </h2>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">Browse All Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}