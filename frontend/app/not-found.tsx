import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <main className="min-h-screen pt-20" id="main-content">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-card-bg border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-heading-xl">
                404 - Page Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl">🚫</div>
              <p className="text-gray-5 text-body">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <div className="space-y-4">
                <p className="text-gray-5 text-body">
                  Here are some helpful links instead:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-accent text-black hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <Link href="/" aria-label="Go to home page">
                      Go Home
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <Link href="/projects" aria-label="View all projects">
                      View Projects
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    <Link href="/knowledge" aria-label="View skills and knowledge">
                      View Skills
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}