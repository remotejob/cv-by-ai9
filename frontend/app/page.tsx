import { loadProjectsServer, getFeaturedProjectsServer } from '@/lib/content-server';
import { generateMetadata } from '@/lib/metadata';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TechCard } from '@/components/tech-card';
import Link from 'next/link';

export const metadata = generateMetadata({
  title: 'Home',
  description: 'DevOps Engineer specializing in cloud infrastructure, automation, and scalable deployments. View featured projects and technical expertise.',
});

export default async function HomePage() {
  const projects = await loadProjectsServer();
  const featuredProjects = getFeaturedProjectsServer(projects);

  return (
    <div className="min-h-screen pt-20" id="main-content">
      {/* Hero Section */}
      <section className="py-20 px-4" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-heading-lg text-muted-foreground mb-4">
            Hello, i am
          </div>
          <h1 id="hero-heading" className="text-heading-xl font-bold text-accent mb-8">
            johnDoe
          </h1>
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

      {/* Skills Section */}
      <section className="py-16 px-4 bg-secondary/50" aria-labelledby="skills-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="skills-heading" className="text-heading-lg font-bold text-foreground mb-12">
            skills()
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6" role="list" aria-label="Core technologies and skills">
            {['JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'React', 'Next.js', 'Python', 'Node.js', 'Linux', 'Redux', 'Ruby', 'Rails'].map((tech) => (
              <TechCard key={tech} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-4" aria-labelledby="projects-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="projects-heading" className="text-heading-lg font-bold text-foreground mb-12">
            projects()
          </h2>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="bg-card border-border hover:border-accent transition-colors">
                  <CardHeader>
                    <CardTitle className="text-card-foreground text-heading-md">{project.title}</CardTitle>
                    {project.featured && (
                      <div className="inline-block bg-accent text-black px-2 py-1 rounded text-xs font-bold">
                        FEATURED
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-body mb-4">
                      {project.summary}
                    </CardDescription>
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/projects/${project.slug}`}>Go to website</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
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

      {/* Companies Section */}
      <section className="py-16 px-4 bg-secondary/50" aria-labelledby="companies-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="companies-heading" className="text-heading-lg font-bold text-foreground mb-12">
            companies()
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                <span className="text-sm">•</span>
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Tech Company A</h3>
                <p className="text-muted-foreground text-sm">Senior DevOps Engineer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-black font-bold">
                <span className="text-sm">•</span>
              </div>
              <div>
                <h3 className="text-foreground font-semibold">Tech Company B</h3>
                <p className="text-muted-foreground text-sm">DevOps Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}