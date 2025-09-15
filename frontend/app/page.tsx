import { loadProjects, getFeaturedProjects } from '@/lib/content';
import { generateMetadata } from '@/lib/metadata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Home',
  description: 'DevOps Engineer specializing in cloud infrastructure, automation, and scalable deployments. View featured projects and technical expertise.',
});

export default async function HomePage() {
  const projects = await loadProjects();
  const featuredProjects = getFeaturedProjects(projects);

  return (
    <main className="min-h-screen pt-20" id="main-content">
      {/* Hero Section */}
      <section className="py-20 px-4" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto text-center">
          <h1 id="hero-heading" className="text-heading-xl font-bold text-white mb-4">
            <span className="text-accent">DEVOPS</span> ENGINEER
          </h1>
          <p className="text-heading-lg text-gray-5 mb-8 max-w-3xl mx-auto">
            Building scalable infrastructure and automating deployments for modern web applications
          </p>
          <div className="flex gap-4 justify-center" role="group" aria-label="Main navigation actions">
            <Button
              asChild
              size="lg"
              className="bg-accent text-black hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Link href="/projects" aria-label="View all projects portfolio">
                View Projects
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Link href="/knowledge" aria-label="View technical skills and expertise">
                See Skills
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 px-4 bg-dark-bg" aria-labelledby="featured-projects-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="featured-projects-heading" className="text-heading-lg font-bold text-white mb-12 text-center">
            Featured Projects
          </h2>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="bg-card-bg border-gray-700 hover:border-accent transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white text-heading-md">{project.title}</CardTitle>
                    {project.featured && (
                      <div className="inline-block bg-accent text-black px-2 py-1 rounded text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-5 text-body mb-4">
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
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/projects/${project.slug}`}>View Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-5">
              <p className="text-body">No featured projects available yet.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Link href="/projects" aria-label="View all projects in portfolio">
                View All Projects
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Skills Preview */}
      <section className="py-16 px-4" aria-labelledby="core-technologies-heading">
        <div className="max-w-7xl mx-auto text-center">
          <h2 id="core-technologies-heading" className="text-heading-lg font-bold text-white mb-12">
            Core Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" role="list" aria-label="Core technologies and skills">
            {['Docker', 'Kubernetes', 'AWS', 'Terraform', 'GitLab CI', 'Ansible'].map((tech) => (
              <Link
                key={tech}
                href="/knowledge"
                className="bg-card-bg border border-gray-700 rounded-lg p-4 hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                role="listitem"
              >
                <div className="text-accent font-bold text-body">{tech}</div>
              </Link>
            ))}
          </div>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-accent text-black hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <Link href="/knowledge" aria-label="Explore all technical skills and expertise">
                Explore All Skills
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
