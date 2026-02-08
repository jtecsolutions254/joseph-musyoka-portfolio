import { GraduationCap, MapPin, Target, Heart } from 'lucide-react';

export function AboutWindow() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl text-primary-foreground font-semibold shrink-0 shadow-lg">
          KJ
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">Kiseko Joseph Musyoka</h1>
          <p className="text-primary font-medium">Computer Science Student</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Embu, Kenya</span>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="glass-panel rounded-xl p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          About Me
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          I am a passionate Computer Science student at the University of Embu, 
          driven by a deep curiosity for technology and innovation. My journey in 
          tech has equipped me with strong foundations in programming, software 
          development, and problem-solving. I am actively seeking an Industrial 
          Attachment / Internship opportunity to apply my skills in a real-world 
          environment and contribute meaningfully to innovative projects.
        </p>
      </div>

      {/* Education */}
      <div className="glass-panel rounded-xl p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-primary" />
          Education
        </h2>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">Bachelor of Science in Computer Science</h3>
              <p className="text-sm text-muted-foreground">University of Embu</p>
            </div>
            <span className="text-sm text-primary font-medium">2021 - Present</span>
          </div>
        </div>
      </div>

      {/* Career Goals */}
      <div className="glass-panel rounded-xl p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Career Goals
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>Gain practical experience through industrial attachment in software development</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>Develop expertise in full-stack web development and cloud technologies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <span>Contribute to innovative tech solutions that solve real-world problems</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
