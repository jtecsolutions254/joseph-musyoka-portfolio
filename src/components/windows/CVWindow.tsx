import { FileText, Download, Eye, Calendar, User, GraduationCap, Briefcase } from 'lucide-react';

export function CVWindow() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">CV & Attachment Letter</h1>
          <p className="text-sm text-muted-foreground">Professional documents for employment</p>
        </div>
      </div>

      {/* Document Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              PDF
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-1">Curriculum Vitae</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete professional CV with education, skills, and experience details.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              PDF
            </span>
          </div>
          <h3 className="font-semibold text-lg mb-1">Attachment Letter</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Formal application letter for industrial attachment/internship positions.
          </p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* CV Preview Summary */}
      <div className="glass-panel rounded-xl p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          Quick Overview
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Personal Details</h4>
              <p className="text-sm text-muted-foreground">
                Kiseko Joseph Musyoka • Embu, Kenya • Available for Attachment
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Education</h4>
              <p className="text-sm text-muted-foreground">
                BSc. Computer Science • University of Embu • 2021 - Present
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">Availability</h4>
              <p className="text-sm text-muted-foreground">
                Ready for immediate attachment/internship placement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* References Note */}
      <div className="glass-panel rounded-xl p-5 border-l-4 border-primary">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> Professional references 
          and academic transcripts are available upon request. Please use the contact form 
          or email directly for additional documentation.
        </p>
      </div>
    </div>
  );
}
