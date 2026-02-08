-- Create storage bucket for portfolio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-files', 
  'portfolio-files', 
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create table for uploaded files metadata
CREATE TABLE public.portfolio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('cv', 'project', 'image', 'document')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  thumbnail_path TEXT,
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create public read policies (portfolio is public)
CREATE POLICY "Anyone can view portfolio files"
  ON public.portfolio_files
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert portfolio files"
  ON public.portfolio_files
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update portfolio files"
  ON public.portfolio_files
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete portfolio files"
  ON public.portfolio_files
  FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view projects"
  ON public.projects
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update projects"
  ON public.projects
  FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete projects"
  ON public.projects
  FOR DELETE
  USING (true);

-- Storage policies
CREATE POLICY "Anyone can view portfolio files in storage"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-files');

CREATE POLICY "Anyone can upload portfolio files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-files');

CREATE POLICY "Anyone can update portfolio files in storage"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio-files');

CREATE POLICY "Anyone can delete portfolio files from storage"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_portfolio_files_updated_at
  BEFORE UPDATE ON public.portfolio_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();