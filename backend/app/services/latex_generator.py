"""LaTeX Resume Generation Service for professional resume formatting"""
import re
import os
import subprocess
import tempfile
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.services.resume_optimizer import OptimizedResumeData

class LaTeXResumeRequest(BaseModel):
    """Request model for LaTeX resume generation"""
    template_style: str = "professional"  # professional, modern, academic, creative
    color_scheme: str = "blue"  # blue, black, green, navy, burgundy
    font_size: int = 11  # 10, 11, 12
    margins: str = "normal"  # tight, normal, wide
    include_photo: bool = False
    two_column: bool = False

class LaTeXGeneratorService:
    """Service for generating LaTeX resumes from optimized resume data"""
    
    def __init__(self):
        self.templates = self._load_latex_templates()
        self.style_configs = self._load_style_configurations()
    
    def _load_latex_templates(self) -> Dict[str, str]:
        """Load LaTeX template structures"""
        return {
            "professional": """
\\documentclass[{font_size}pt,a4paper,sans]{{moderncv}}

% ModernCV theme and color
\\moderncvstyle{{{style}}}
\\moderncvcolor{{{color}}}

% Character encoding
\\usepackage[utf8]{{inputenc}}

% Adjust page margins
\\usepackage[scale={margin_scale}]{{geometry}}

% Personal data
\\name{{{first_name}}}{{{last_name}}}
\\title{{{title}}}
\\address{{{address}}}
\\phone[mobile]{{{phone}}}
\\email{{{email}}}
\\social[linkedin]{{{linkedin}}}
\\social[github]{{{github}}}

\\begin{{document}}

% Title
\\makecvtitle

% Professional Summary
\\section{{Professional Summary}}
\\cvitem{{}}{{{summary}}}

% Experience
\\section{{Professional Experience}}
{experience_content}

% Skills
\\section{{Technical Skills}}
{skills_content}

% Education
\\section{{Education}}
{education_content}

% Projects
\\section{{Projects}}
{projects_content}

\\end{{document}}
            """,
            
            "modern": """
\\documentclass[{font_size}pt,a4paper]{{article}}

\\usepackage[margin={margin}in]{{geometry}}
\\usepackage{{xcolor}}
\\usepackage{{titlesec}}
\\usepackage{{enumitem}}
\\usepackage{{hyperref}}

% Define colors
\\definecolor{{primary}}{{{color_def}}}
\\definecolor{{text}}{{RGB}}{{60,60,60}}

% Custom formatting
\\titleformat{{\\section}}{{\\large\\bfseries\\color{{primary}}}}{{}}{{0em}}{{}}[\\titlerule]
\\titleformat{{\\subsection}}{{\\normalsize\\bfseries}}{{}}{{0em}}{{}}

% Remove page numbers
\\pagenumbering{{gobble}}

\\begin{{document}}

% Header
\\begin{{center}}
{{\\LARGE\\bfseries {full_name}}} \\\\[0.2cm]
{{\\large\\color{{primary}} {title}}} \\\\[0.3cm]
{contact_info}
\\end{{center}}

\\vspace{{0.3cm}}

% Professional Summary
\\section{{Professional Summary}}
{summary}

% Experience
\\section{{Professional Experience}}
{experience_content}

% Skills
\\section{{Technical Skills}}
{skills_content}

% Education
\\section{{Education}}
{education_content}

% Projects
\\section{{Projects}}
{projects_content}

\\end{{document}}
            """,
            
            "academic": """
\\documentclass[{font_size}pt,a4paper]{{article}}

\\usepackage[margin=1in]{{geometry}}
\\usepackage{{titlesec}}
\\usepackage{{enumitem}}
\\usepackage{{hyperref}}

% Formatting
\\titleformat{{\\section}}{{\\large\\bfseries}}{{}}{{0em}}{{}}[\\hrule]
\\setlength{{\\parindent}}{{0pt}}

\\begin{{document}}

% Header
\\begin{{center}}
{{\\Large\\textbf{{{full_name}}}}} \\\\
{contact_info}
\\end{{center}}

\\vspace{{0.3cm}}

% Research Interests / Objective
\\section{{Research Interests}}
{summary}

% Education
\\section{{Education}}
{education_content}

% Experience
\\section{{Research Experience}}
{experience_content}

% Skills
\\section{{Technical Skills}}
{skills_content}

% Publications (if any)
\\section{{Publications}}
{publications_content}

% Projects
\\section{{Research Projects}}
{projects_content}

\\end{{document}}
            """
        }
    
    def _load_style_configurations(self) -> Dict[str, Dict]:
        """Load style configuration mappings"""
        return {
            "colors": {
                "blue": {"moderncv": "blue", "rgb": "RGB{0,100,200}", "def": "HTML{0064C8}"},
                "black": {"moderncv": "black", "rgb": "RGB{0,0,0}", "def": "HTML{000000}"},
                "green": {"moderncv": "green", "rgb": "RGB{0,150,0}", "def": "HTML{009600}"},
                "navy": {"moderncv": "blue", "rgb": "RGB{0,50,100}", "def": "HTML{003264}"},
                "burgundy": {"moderncv": "burgundy", "rgb": "RGB{128,0,0}", "def": "HTML{800000}"}
            },
            "margins": {
                "tight": {"scale": "0.75", "inches": "0.5"},
                "normal": {"scale": "0.8", "inches": "0.75"},
                "wide": {"scale": "0.9", "inches": "1.0"}
            },
            "fonts": {
                10: "10",
                11: "11", 
                12: "12"
            }
        }
    
    def generate_latex_resume(
        self, 
        optimized_resume: OptimizedResumeData, 
        request: LaTeXResumeRequest
    ) -> str:
        """Generate LaTeX code for the resume"""
        
        print(f"Generating LaTeX resume with {request.template_style} template")
        
        # Get template
        template = self.templates.get(request.template_style, self.templates["professional"])
        
        # Prepare template variables
        template_vars = self._prepare_template_variables(optimized_resume, request)
        
        # Generate content sections
        template_vars.update({
            "experience_content": self._generate_experience_latex(optimized_resume.experience_section, request.template_style),
            "skills_content": self._generate_skills_latex(optimized_resume.skills_section, request.template_style),
            "education_content": self._generate_education_latex(optimized_resume.education_section, request.template_style),
            "projects_content": self._generate_projects_latex(optimized_resume.projects_section, request.template_style),
            "publications_content": ""  # For academic template
        })
        
        # Format template
        try:
            latex_code = template.format(**template_vars)
            return self._clean_latex_code(latex_code)
        except KeyError as e:
            print(f"Template formatting error: {e}")
            return self._generate_fallback_latex(optimized_resume, request)
    
    def _prepare_template_variables(
        self, 
        optimized_resume: OptimizedResumeData, 
        request: LaTeXResumeRequest
    ) -> Dict[str, str]:
        """Prepare variables for template formatting"""
        
        personal_info = optimized_resume.personal_info
        color_config = self.style_configs["colors"][request.color_scheme]
        margin_config = self.style_configs["margins"][request.margins]
        
        # Parse name
        full_name = personal_info.get('name', 'John Doe')
        name_parts = full_name.split()
        first_name = name_parts[0] if name_parts else 'John'
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else 'Doe'
        
        # Prepare contact info
        contact_parts = []
        if personal_info.get('phone'):
            contact_parts.append(f"\\textbf{{Phone:}} {personal_info['phone']}")
        if personal_info.get('email'):
            contact_parts.append(f"\\textbf{{Email:}} \\href{{mailto:{personal_info['email']}}}{{{personal_info['email']}}}")
        if personal_info.get('linkedin'):
            linkedin_clean = personal_info['linkedin'].replace('https://linkedin.com/in/', '')
            contact_parts.append(f"\\textbf{{LinkedIn:}} \\href{{{personal_info['linkedin']}}}{{{linkedin_clean}}}")
        if personal_info.get('github'):
            github_clean = personal_info['github'].replace('https://github.com/', '')
            contact_parts.append(f"\\textbf{{GitHub:}} \\href{{{personal_info['github']}}}{{{github_clean}}}")
        
        contact_info = ' $\\bullet$ '.join(contact_parts)
        
        return {
            "font_size": str(request.font_size),
            "style": "casual" if request.template_style == "modern" else "classic",
            "color": color_config["moderncv"],
            "color_def": color_config["def"],
            "margin_scale": margin_config["scale"],
            "margin": margin_config["inches"],
            "first_name": self._escape_latex(first_name),
            "last_name": self._escape_latex(last_name),
            "full_name": self._escape_latex(full_name),
            "title": self._escape_latex(personal_info.get('title', 'Professional')),
            "address": self._escape_latex(personal_info.get('address', '')),
            "phone": self._escape_latex(personal_info.get('phone', '')),
            "email": personal_info.get('email', ''),
            "linkedin": (personal_info.get('linkedin') or '').replace('https://linkedin.com/in/', ''),
            "github": (personal_info.get('github') or '').replace('https://github.com/', ''),
            "contact_info": contact_info,
            "summary": self._escape_latex(optimized_resume.professional_summary)
        }
    
    def _generate_experience_latex(self, experience: List[Dict], template_style: str) -> str:
        """Generate LaTeX for experience section"""
        
        if not experience:
            return "No professional experience listed."
        
        latex_content = []
        
        for exp in experience:
            company = self._escape_latex(exp.get('company', ''))
            title = self._escape_latex(exp.get('title', ''))
            dates = self._escape_latex(exp.get('dates', ''))
            location = self._escape_latex(exp.get('location', ''))
            
            if template_style == "professional":
                # ModernCV format
                latex_content.append(f"\\cventry{{{dates}}}{{{title}}}{{{company}}}{{{location}}}{{}}{{")
                
                # Add bullet points
                descriptions = exp.get('description', [])
                if descriptions:
                    latex_content.append("\\begin{itemize}")
                    for desc in descriptions[:6]:  # Limit bullet points
                        latex_content.append(f"\\item {self._escape_latex(desc)}")
                    latex_content.append("\\end{itemize}")
                
                latex_content.append("}")
                
            else:
                # Modern/Academic format
                latex_content.append(f"\\subsection{{{title} -- {company}}}")
                latex_content.append(f"\\textit{{{dates}}} \\hfill {location}")
                latex_content.append("")
                
                descriptions = exp.get('description', [])
                if descriptions:
                    latex_content.append("\\begin{itemize}[leftmargin=*]")
                    for desc in descriptions[:6]:
                        latex_content.append(f"\\item {self._escape_latex(desc)}")
                    latex_content.append("\\end{itemize}")
                
                latex_content.append("")
        
        return "\n".join(latex_content)
    
    def _generate_skills_latex(self, skills: Dict, template_style: str) -> str:
        """Generate LaTeX for skills section"""
        
        if not skills:
            return "No skills listed."
        
        latex_content = []
        
        # Get skill categories
        technical_skills = skills.get('technical_skills', [])
        tools_frameworks = skills.get('tools_frameworks', [])
        soft_skills = skills.get('soft_skills', [])
        
        if template_style == "professional":
            # ModernCV format
            if technical_skills:
                latex_content.append(f"\\cvitem{{Programming}}{{" + ", ".join([self._escape_latex(s) for s in technical_skills]) + "}")
            if tools_frameworks:
                latex_content.append(f"\\cvitem{{Tools \\& Frameworks}}{{" + ", ".join([self._escape_latex(s) for s in tools_frameworks]) + "}")
            if soft_skills:
                latex_content.append(f"\\cvitem{{Soft Skills}}{{" + ", ".join([self._escape_latex(s) for s in soft_skills]) + "}")
        
        else:
            # Modern/Academic format
            if technical_skills:
                latex_content.append(f"\\textbf{{Programming:}} " + ", ".join([self._escape_latex(s) for s in technical_skills]) + " \\\\")
            if tools_frameworks:
                latex_content.append(f"\\textbf{{Tools \\& Frameworks:}} " + ", ".join([self._escape_latex(s) for s in tools_frameworks]) + " \\\\")
            if soft_skills:
                latex_content.append(f"\\textbf{{Soft Skills:}} " + ", ".join([self._escape_latex(s) for s in soft_skills]))
        
        return "\n".join(latex_content)
    
    def _generate_education_latex(self, education: List[Dict], template_style: str) -> str:
        """Generate LaTeX for education section"""
        
        if not education:
            return "No education information provided."
        
        latex_content = []
        
        for edu in education:
            degree = self._escape_latex(edu.get('degree', ''))
            school = self._escape_latex(edu.get('school', ''))
            year = self._escape_latex(str(edu.get('year', '')))
            gpa = edu.get('gpa', '')
            
            if template_style == "professional":
                # ModernCV format
                gpa_text = f", GPA: {gpa}" if gpa else ""
                latex_content.append(f"\\cventry{{{year}}}{{{degree}}}{{{school}}}{{}}{{}}{{" + gpa_text + "}")
            
            else:
                # Modern/Academic format
                latex_content.append(f"\\subsection{{{degree}}}")
                gpa_text = f", GPA: {gpa}" if gpa else ""
                latex_content.append(f"{school}, {year}{gpa_text}")
                latex_content.append("")
        
        return "\n".join(latex_content)
    
    def _generate_projects_latex(self, projects: List[Dict], template_style: str) -> str:
        """Generate LaTeX for projects section"""
        
        if not projects:
            return ""
        
        latex_content = []
        
        for project in projects:
            name = self._escape_latex(project.get('name', ''))
            description = self._escape_latex(project.get('description', ''))
            technologies = project.get('technologies', [])
            
            if template_style == "professional":
                # ModernCV format
                tech_text = f"Technologies: {', '.join(technologies)}" if technologies else ""
                latex_content.append(f"\\cvitem{{{name}}}{{{description}. {tech_text}}}")
            
            else:
                # Modern/Academic format
                latex_content.append(f"\\subsection{{{name}}}")
                latex_content.append(description)
                if technologies:
                    latex_content.append(f"\\textbf{{Technologies:}} {', '.join([self._escape_latex(t) for t in technologies])}")
                latex_content.append("")
        
        return "\n".join(latex_content)
    
    def _escape_latex(self, text: str) -> str:
        """Escape special LaTeX characters"""
        
        if not text:
            return ""
        
        # Dictionary of LaTeX special characters and their escaped versions
        escape_chars = {
            '&': '\\&',
            '%': '\\%',
            '$': '\\$',
            '#': '\\#',
            '^': '\\textasciicircum{}',
            '_': '\\_',
            '{': '\\{',
            '}': '\\}',
            '~': '\\textasciitilde{}',
            '\\': '\\textbackslash{}'
        }
        
        # Replace special characters
        for char, escaped in escape_chars.items():
            text = text.replace(char, escaped)
        
        return text
    
    def _clean_latex_code(self, latex_code: str) -> str:
        """Clean and format LaTeX code"""
        
        # Remove extra blank lines
        latex_code = re.sub(r'\n\s*\n\s*\n', '\n\n', latex_code)
        
        # Remove trailing whitespace
        lines = [line.rstrip() for line in latex_code.split('\n')]
        
        return '\n'.join(lines)
    
    def _generate_fallback_latex(
        self, 
        optimized_resume: OptimizedResumeData, 
        request: LaTeXResumeRequest
    ) -> str:
        """Generate a simple fallback LaTeX resume"""
        
        personal_info = optimized_resume.personal_info
        full_name = personal_info.get('name', 'John Doe')
        
        fallback_template = f"""
\\documentclass[{request.font_size}pt,a4paper]{{article}}

\\usepackage[margin=1in]{{geometry}}
\\usepackage{{titlesec}}
\\usepackage{{enumitem}}

\\titleformat{{\\section}}{{\\large\\bfseries}}{{}}{{0em}}{{}}[\\hrule]
\\setlength{{\\parindent}}{{0pt}}

\\begin{{document}}

\\begin{{center}}
{{\\Large\\textbf{{{self._escape_latex(full_name)}}}}}
\\end{{center}}

\\section{{Professional Summary}}
{self._escape_latex(optimized_resume.professional_summary)}

\\section{{Experience}}
{self._generate_experience_latex(optimized_resume.experience_section, "academic")}

\\section{{Skills}}
{self._generate_skills_latex(optimized_resume.skills_section, "academic")}

\\section{{Education}}
{self._generate_education_latex(optimized_resume.education_section, "academic")}

\\end{{document}}
        """
        
        return self._clean_latex_code(fallback_template)
    
    def generate_pdf_compile_instructions(self) -> str:
        """Generate instructions for compiling LaTeX to PDF"""
        
        return """
To compile this LaTeX resume to PDF:

1. Save the LaTeX code to a file with .tex extension (e.g., resume.tex)

2. Compile using one of these methods:

   Method 1 - pdflatex (recommended):
   pdflatex resume.tex

   Method 2 - XeLaTeX (for advanced fonts):
   xelatex resume.tex

   Method 3 - Online compiler:
   - Upload to Overleaf (overleaf.com)
   - Or use ShareLaTeX

3. Required packages (install via LaTeX package manager):
   - moderncv (for professional template)
   - geometry
   - xcolor
   - titlesec
   - enumitem
   - hyperref

4. For best results:
   - Use a modern LaTeX distribution (TeX Live, MiKTeX)
   - Compile twice for proper cross-references
   - Check for any compilation errors in the log

5. The generated PDF will be ATS-compatible and professionally formatted.
        """
    
    def generate_pdf_resume(self, optimized_resume: OptimizedResumeData, request: LaTeXResumeRequest) -> bytes:
        """Generate PDF resume from optimized resume data"""
        
        # First generate LaTeX code
        latex_code = self.generate_latex_resume(optimized_resume, request)
        
        # Create temporary directory for LaTeX compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            # Write LaTeX code to temporary file
            tex_file = os.path.join(temp_dir, "resume.tex")
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_code)
            
            try:
                # Try to compile with pdflatex
                result = subprocess.run([
                    'pdflatex', 
                    '-output-directory', temp_dir,
                    '-interaction=nonstopmode',
                    tex_file
                ], capture_output=True, text=True, timeout=30)
                
                if result.returncode == 0:
                    # Read the generated PDF
                    pdf_file = os.path.join(temp_dir, "resume.pdf")
                    if os.path.exists(pdf_file):
                        with open(pdf_file, 'rb') as f:
                            return f.read()
                    else:
                        raise Exception("PDF file was not generated")
                else:
                    raise Exception(f"LaTeX compilation failed: {result.stderr}")
                    
            except subprocess.TimeoutExpired:
                raise Exception("LaTeX compilation timed out")
            except FileNotFoundError:
                # LaTeX not installed, return a fallback error message
                raise Exception("LaTeX compiler not found. Please install LaTeX (e.g., TeX Live or MiKTeX) to generate PDF files. You can still download the LaTeX file and compile it manually.")