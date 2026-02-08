import { Code, Database, Globe, Wrench, Brain, Users } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Record<string, Skill[]> = {
  'Programming Languages': [
    { name: 'Python', level: 85, category: 'programming' },
    { name: 'JavaScript', level: 80, category: 'programming' },
    { name: 'Java', level: 75, category: 'programming' },
    { name: 'C/C++', level: 70, category: 'programming' },
    { name: 'TypeScript', level: 75, category: 'programming' },
  ],
  'Web Development': [
    { name: 'React', level: 80, category: 'web' },
    { name: 'HTML/CSS', level: 90, category: 'web' },
    { name: 'Node.js', level: 75, category: 'web' },
    { name: 'Tailwind CSS', level: 85, category: 'web' },
  ],
  'Database & Tools': [
    { name: 'MySQL', level: 75, category: 'database' },
    { name: 'PostgreSQL', level: 70, category: 'database' },
    { name: 'Git/GitHub', level: 85, category: 'tools' },
    { name: 'Linux', level: 70, category: 'tools' },
  ],
  'Soft Skills': [
    { name: 'Problem Solving', level: 90, category: 'soft' },
    { name: 'Team Collaboration', level: 85, category: 'soft' },
    { name: 'Communication', level: 80, category: 'soft' },
    { name: 'Time Management', level: 85, category: 'soft' },
  ],
};

const categoryIcons: Record<string, React.ReactNode> = {
  'Programming Languages': <Code className="w-5 h-5" />,
  'Web Development': <Globe className="w-5 h-5" />,
  'Database & Tools': <Database className="w-5 h-5" />,
  'Soft Skills': <Users className="w-5 h-5" />,
};

export function SkillsWindow() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Technical Skills</h1>
          <p className="text-sm text-muted-foreground">Hover over skills to see proficiency</p>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(skills).map(([category, categorySkills]) => (
          <div key={category} className="glass-panel rounded-xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-primary">
              {categoryIcons[category]}
              {category}
            </h2>
            <div className="space-y-4">
              {categorySkills.map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-bar-fill"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
