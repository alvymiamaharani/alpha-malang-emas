import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Sparkles, Zap, Palette } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Next.js 15 - ALPY INI",
      description:
        "Latest features with App Router and React Server Components",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid UI development",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "shadcn/ui",
      description: "Beautiful and accessible components built with Radix UI",
    },
  ];

  const techStack = [
    "Next.js 15",
    "Tailwind CSS",
    "shadcn/ui",
    "Biome",
    "TypeScript",
    "App Router",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="text-sm font-medium">
            🚀 Production Ready Template
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Next.js 15 + <span className="text-primary">shadcn/ui</span>{" "}
            Boilerplate
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A clean, modern starter template with everything you need to build
            amazing web applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Get Started
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/alvymiamaharani/nextjs-shadcn-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What's Included</h2>
          <p className="text-muted-foreground">
            Everything you need to start building modern web applications
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Tech Stack</CardTitle>
            <CardDescription className="text-center">
              Pre-configured with the best tools and libraries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Ready to deploy on Vercel with zero configuration
            </p>
          </CardFooter>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/alvymiamaharani/nextjs-shadcn-starter"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>

          <p className="text-sm text-muted-foreground">
            Built with ❤️ using Next.js 15 and shadcn/ui
          </p>

          <p className="text-xs text-muted-foreground">
            © 2024 Your Template Name. Open source under MIT License.
          </p>
        </div>
      </footer>
    </main>
  );
}
