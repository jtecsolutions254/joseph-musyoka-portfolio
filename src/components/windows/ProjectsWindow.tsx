import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Folder, Plus, Loader2, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[];
  thumbnail_path: string | null;
  github_url: string | null;
  demo_url: string | null;
  created_at: string;
}

// Default projects to show when database is empty
const defaultProjects: Omit<Project, 'id' | 'created_at'>[] = [
  {
    title: 'Student Management System',
    description: 'A comprehensive web application for managing student records, grades, and attendance tracking built with modern web technologies.',
    technologies: ['React', 'Node.js', 'MySQL', 'Tailwind CSS'],
    thumbnail_path: null,
    github_url: null,
    demo_url: null,
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with user authentication, product catalog, shopping cart, and payment integration.',
    technologies: ['JavaScript', 'Express.js', 'MongoDB', 'Stripe API'],
    thumbnail_path: null,
    github_url: null,
    demo_url: null,
  },
  {
    title: 'Weather Forecast App',
    description: 'Real-time weather application that provides accurate forecasts using external APIs with a clean, responsive UI.',
    technologies: ['Python', 'Flask', 'OpenWeather API', 'Bootstrap'],
    thumbnail_path: null,
    github_url: null,
    demo_url: null,
  },
  {
    title: 'Portfolio Website',
    description: 'This Windows XP-inspired interactive portfolio showcasing creative UI/UX skills and technical abilities.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    thumbnail_path: null,
    github_url: null,
    demo_url: null,
  },
];

export function ProjectsWindow() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    demo_url: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // Show default projects if database is empty
        setProjects(defaultProjects.map((p, i) => ({
          ...p,
          id: `default-${i}`,
          created_at: new Date().toISOString(),
        })));
      }
    } catch (err) {
      console.error('Error loading projects:', err);
      // Fallback to defaults
      setProjects(defaultProjects.map((p, i) => ({
        ...p,
        id: `default-${i}`,
        created_at: new Date().toISOString(),
      })));
    }
    setIsLoading(false);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    setIsSubmitting(true);
    try {
      let thumbnailPath = null;

      // Upload thumbnail if provided
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop();
        const fileName = `projects/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio-files')
          .upload(fileName, thumbnail);

        if (!uploadError) {
          thumbnailPath = fileName;
        }
      }

      const techArray = newProject.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error } = await supabase.from('projects').insert({
        title: newProject.title,
        description: newProject.description || null,
        technologies: techArray,
        thumbnail_path: thumbnailPath,
        github_url: newProject.github_url || null,
        demo_url: newProject.demo_url || null,
      });

      if (error) throw error;

      // Reset form
      setNewProject({ title: '', description: '', technologies: '', github_url: '', demo_url: '' });
      setThumbnail(null);
      setThumbnailPreview(null);
      setShowAddForm(false);
      
      // Reload projects
      await loadProjects();
    } catch (err) {
      console.error('Error adding project:', err);
      alert('Failed to add project. Please try again.');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (project: Project) => {
    if (project.id.startsWith('default-')) {
      alert('Cannot delete default projects. Add your own projects first!');
      return;
    }

    if (!confirm(`Delete "${project.title}"?`)) return;

    try {
      // Delete thumbnail if exists
      if (project.thumbnail_path) {
        await supabase.storage.from('portfolio-files').remove([project.thumbnail_path]);
      }

      const { error } = await supabase.from('projects').delete().eq('id', project.id);
      if (error) throw error;

      await loadProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project.');
    }
  };

  const getThumbnailUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage.from('portfolio-files').getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Folder className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">My Projects</h1>
            <p className="text-sm text-muted-foreground">Academic and personal projects</p>
          </div>
        </div>

        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
          {showAddForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </>
          )}
        </Button>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-secondary/30 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Project Title *</label>
              <Input
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="My Awesome Project"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Technologies (comma-separated)</label>
              <Input
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                placeholder="React, TypeScript, Node.js"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Describe your project..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">GitHub URL</label>
              <Input
                value={newProject.github_url}
                onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Demo URL</label>
              <Input
                value={newProject.demo_url}
                onChange={(e) => setNewProject({ ...newProject, demo_url: e.target.value })}
                placeholder="https://myproject.com"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Thumbnail Image</label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
              {thumbnailPreview && (
                <div className="relative">
                  <img src={thumbnailPreview} alt="Preview" className="h-16 w-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview(null);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Project'
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="project-card group relative">
              {/* Delete button for non-default projects */}
              {!project.id.startsWith('default-') && (
                <button
                  onClick={() => handleDelete(project)}
                  className="absolute top-3 right-3 p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                {project.thumbnail_path ? (
                  <img
                    src={getThumbnailUrl(project.thumbnail_path) || ''}
                    alt={project.title}
                    className="w-24 h-20 object-cover rounded-lg shrink-0"
                  />
                ) : (
                  <div className="w-24 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Technologies */}
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

              {/* Links */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                {project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Code</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground/50">
                    <Github className="w-4 h-4" />
                    <span>View Code</span>
                  </span>
                )}
                {project.demo_url ? (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground/50">
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
