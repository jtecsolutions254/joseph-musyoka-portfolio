import { ExternalLink, Github, Folder } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Student Management System',
    description: 'A comprehensive web application for managing student records, grades, and attendance tracking built with modern web technologies.',
    technologies: ['React', 'Node.js', 'MySQL', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with user authentication, product catalog, shopping cart, and payment integration.',
    technologies: ['JavaScript', 'Express.js', 'MongoDB', 'Stripe API'],
  },
  {
    id: 3,
    title: 'Weather Forecast App',
    description: 'Real-time weather application that provides accurate forecasts using external APIs with a clean, responsive UI.',
    technologies: ['Python', 'Flask', 'OpenWeather API', 'Bootstrap'],
  },
  {
    id: 4,
    title: 'Task Management CLI',
    description: 'Command-line interface application for efficient task and project management with data persistence.',
    technologies: ['Python', 'SQLite', 'Click'],
  },
  {
    id: 5,
    title: 'Portfolio Website',
    description: 'This Windows 11-inspired interactive portfolio showcasing creative UI/UX skills and technical abilities.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
];

export function ProjectsWindow() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Folder className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">My Projects</h1>
          <p className="text-sm text-muted-foreground">Academic and personal projects</p>
        </div>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-4 h-4" />
                <span>View Code</span>
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
