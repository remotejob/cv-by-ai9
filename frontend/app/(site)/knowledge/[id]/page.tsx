import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Award, BookOpen, ExternalLink } from 'lucide-react';
import { loadKnowledgeEntryByIdServer, loadKnowledgeEntriesServer, loadProjectBySlugServer } from '@/lib/content-server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface KnowledgeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const entries = await loadKnowledgeEntriesServer();
  return entries.map((entry) => ({
    id: entry.id,
  }));
}

export async function generateMetadata({ params }: KnowledgeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const entry = await loadKnowledgeEntryByIdServer(id);

  if (!entry) {
    return {
      title: 'Knowledge Entry Not Found',
    };
  }

  return {
    title: `${entry.title} - Knowledge`,
    description: entry.summary,
  };
}

export default async function KnowledgeDetailPage({ params }: KnowledgeDetailPageProps) {
  const { id } = await params;
  const entry = await loadKnowledgeEntryByIdServer(id);

  if (!entry) {
    notFound();
  }

  const relatedProjects = entry.relatedProjects
    ? await Promise.all(
        entry.relatedProjects.map(async (slug) => {
          const project = await loadProjectBySlugServer(slug);
          return project ? { ...project, slug } : { slug, title: slug };
        })
      )
    : [];

  const experienceColor = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/knowledge">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Knowledge
          </Button>
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{entry.title}</h1>
          <Badge variant="secondary">{entry.category}</Badge>
          {entry.experienceLevel && (
            <Badge className={experienceColor[entry.experienceLevel]}>
              {entry.experienceLevel}
            </Badge>
          )}
        </div>

        <p className="text-lg text-muted-foreground mb-6">{entry.summary}</p>
      </div>

      <div className="grid gap-6">
        {entry.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {entry.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {entry.yearsOfExperience && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {entry.yearsOfExperience} {entry.yearsOfExperience === 1 ? 'Year' : 'Years'}
                </div>
                <p className="text-muted-foreground">
                  Hands-on experience with {entry.title}
                </p>
              </CardContent>
            </Card>
          )}

          {entry.certifications && entry.certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entry.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {entry.learningResources && entry.learningResources.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Useful links and materials for learning more about {entry.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {entry.learningResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {relatedProjects && relatedProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Projects</CardTitle>
              <CardDescription>
                Projects where I&apos;ve applied {entry.title} knowledge and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {relatedProjects.map((project, index) => (
                  <Link
                    key={index}
                    href={`/projects/${project.slug}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{project.title}</h4>
                      {'summary' in project && project.summary && (
                        <p className="text-sm text-muted-foreground mt-1">{project.summary}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {entry.lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(entry.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}