import {
  FaCode,
  FaLaptopCode,
  FaServer,
  FaDatabase,
  FaBrain,
  FaWrench,
} from "react-icons/fa6";
import "./styles/SkillsSection.css";

interface SkillCategory {
  title: string;
  icon: JSX.Element;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Programming",
    icon: <FaCode />,
    skills: ["C", "C++", "Python", "Java", "JavaScript", "SQL"],
  },
  {
    title: "Frontend",
    icon: <FaLaptopCode />,
    skills: ["HTML", "CSS", "React.js", "Tailwind CSS"],
  },
  {
    title: "Backend",
    icon: <FaServer />,
    skills: ["Node.js", "Express.js", "Python", "Flask", "FastAPI", "REST APIs"],
  },
  {
    title: "Databases",
    icon: <FaDatabase />,
    skills: ["MySQL", "MongoDB", "SQLite", "Supabase"],
  },
  {
    title: "AI / ML",
    icon: <FaBrain />,
    skills: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Generative AI",
      "LLMs",
      "RAG",
      "Prompt Engineering",
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    title: "Tools & Environments",
    icon: <FaWrench />,
    skills: ["Git", "GitHub", "VS Code", "Linux", "Jupyter Notebook"],
  },
];

const SkillsSection = () => {
  return (
    <div className="skills-container section-container" id="skills">
      <div className="skills-header">
        <h2>
          Technical <span>Skills</span>
        </h2>
        <p className="skills-subtitle">
          Core competencies and technical stack utilized in building scalable web
          architectures and advanced machine learning models.
        </p>
      </div>

      <div className="skills-categories-grid">
        {skillCategories.map((cat, idx) => (
          <div key={idx} className="skill-category-card">
            <div className="skill-card-header">
              <div className="skill-cat-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
            </div>
            <div className="skills-pill-wrap">
              {cat.skills.map((skill, sIdx) => (
                <span key={sIdx} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
