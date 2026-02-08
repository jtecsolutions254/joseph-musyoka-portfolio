import { Briefcase, BookOpen, Users, Award } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: 'academic' | 'project' | 'volunteer';
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Computer Science Student',
    organization: 'University of Embu',
    period: '2021 - Present',
    description: 'Pursuing a Bachelor of Science in Computer Science with focus on software development, data structures, algorithms, and system design.',
    type: 'academic',
  },
  {
    id: 2,
    title: 'Lab Assistant (Volunteer)',
    organization: 'University of Embu - CS Department',
    period: '2023',
    description: 'Assisted fellow students in computer lab sessions, helping with programming exercises and troubleshooting technical issues.',
    type: 'volunteer',
  },
  {
    id: 3,
    title: 'Team Lead - Group Project',
    organization: 'Software Engineering Course',
    period: '2023',
    description: 'Led a team of 4 students in developing a student management system, coordinating tasks, code reviews, and ensuring timely delivery.',
    type: 'project',
  },
  {
    id: 4,
    title: 'Hackathon Participant',
    organization: 'University Tech Hackathon',
    period: '2022',
    description: 'Participated in a 48-hour hackathon, developing a prototype solution for campus resource management challenges.',
    type: 'project',
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  academic: <BookOpen className="w-5 h-5" />,
  project: <Briefcase className="w-5 h-5" />,
  volunteer: <Users className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  academic: 'from-primary to-primary/80',
  project: 'from-primary/80 to-primary/60',
  volunteer: 'from-accent to-accent/80',
};

export function ExperienceWindow() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Award className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Experience & Activities</h1>
          <p className="text-sm text-muted-foreground">Academic journey and involvement</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-14">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-5 h-5 rounded-full bg-gradient-to-br ${typeColors[exp.type]} flex items-center justify-center`}>
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <div className="glass-panel rounded-xl p-5">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-primary">{exp.organization}</p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${typeColors[exp.type]} flex items-center justify-center text-white`}>
                    {typeIcons[exp.type]}
                  </div>
                  <span className="text-xs font-medium capitalize text-muted-foreground">
                    {exp.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
