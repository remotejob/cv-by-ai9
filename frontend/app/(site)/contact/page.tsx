'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <main className="min-h-screen pt-20">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-heading-xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-heading-lg text-gray-5 max-w-3xl mx-auto">
              Interested in collaborating or have questions about my work? I&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="bg-card-bg border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Send a Message</CardTitle>
                <CardDescription className="text-gray-5">
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-accent text-4xl mb-4">✓</div>
                    <h3 className="text-white text-heading-md mb-2">Message Sent!</h3>
                    <p className="text-gray-5 text-body mb-4">
                      Thank you for reaching out. I&apos;ll get back to you soon.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                      <label htmlFor="name" className="block text-white mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        aria-describedby={errors.name ? "name-error" : undefined}
                        className={`w-full px-4 py-2 bg-card-bg border rounded-lg text-white placeholder-gray-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 ${
                          errors.name ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <div id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-white mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className={`w-full px-4 py-2 bg-card-bg border rounded-lg text-white placeholder-gray-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 ${
                          errors.email ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <div id="email-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                        aria-describedby={errors.message ? "message-error" : undefined}
                        rows={6}
                        className={`w-full px-4 py-2 bg-card-bg border rounded-lg text-white placeholder-gray-5 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 resize-vertical ${
                          errors.message ? 'border-red-500' : 'border-gray-700'
                        }`}
                        placeholder="Tell me about your project or inquiry..."
                      />
                      {errors.message && (
                        <div id="message-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.message}
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent text-black hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Email */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a href="mailto:contact@devops-portfolio.com">
                      contact@devops-portfolio.com
                    </a>
                  </Button>
                  <p className="text-gray-5 text-body mt-2">
                    For general inquiries and collaboration opportunities
                  </p>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a href="https://gitlab.com/yourusername" target="_blank" rel="noopener noreferrer">
                      GitLab Profile
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="bg-card-bg border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-5 text-body">
                    I typically respond to emails within 24-48 hours. For urgent matters, please indicate so in your message.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}