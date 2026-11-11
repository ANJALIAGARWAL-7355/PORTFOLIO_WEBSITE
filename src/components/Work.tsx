import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ProjectItem {
  number: string;
  name: string;
  category: string;
  tools: string;
  description: string;
  status: string;
  image: string;
  link: string;
}

const projectsData: ProjectItem[] = [
  {
    number: "01",
    name: "Molecular Property Prediction using Machine Learning",
    category: "AI & Bioinformatics",
    tools: "Python, PyTorch, RDKit, Scikit-learn, Pandas, NumPy",
    description:
      "Predictive machine learning framework analyzing chemical graphs and molecular descriptors to forecast solubility, binding affinity, and bioactivity properties.",
    status: "Active Research / Development",
    image: "/images/project-molecular.svg",
    link: "https://github.com/ANJALIAGARWAL-7355",
  },
  {
    number: "02",
    name: "AI-Powered Healthcare Application",
    category: "Computer Vision & Medical AI",
    tools: "Python, TensorFlow, FastAPI, React.js, SQLite",
    description:
      "Intelligent diagnostic support system utilizing deep convolutional networks for automated medical imaging analysis and clinical decision assistance.",
    status: "Prototype / In Development",
    image: "/images/project-healthcare.svg",
    link: "https://github.com/ANJALIAGARWAL-7355",
  },
  {
    number: "03",
    name: "Full-Stack Web Application",
    category: "Full-Stack Software Engineering",
    tools: "React.js, Tailwind CSS, Node.js, Express.js, MongoDB, SQLite",
    description:
      "Modern full-stack web platform built with modular component hierarchies, responsive layout, secure authentication, and high-performance RESTful APIs.",
    status: "In Active Development",
    image: "/images/project-fullstack.svg",
    link: "https://github.com/ANJALIAGARWAL-7355",
  },
  {
    number: "04",
    name: "Generative AI / LLM-Based Application",
    category: "Generative AI & LLMs",
    tools: "Python, LangChain, LLMs, RAG, Prompt Engineering, FastAPI",
    description:
      "Context-aware generative intelligence system implementing Retrieval-Augmented Generation (RAG) over domain-specific corpora with semantic search.",
    status: "In Progress",
    image: "/images/project-genai.svg",
    link: "https://github.com/ANJALIAGARWAL-7355",
  },
  {
    number: "05",
    name: "Data Analysis and Visualization Project",
    category: "Data Science & Visual Modeling",
    tools: "Python, Pandas, NumPy, Matplotlib, Seaborn, Plotly",
    description:
      "End-to-end exploratory data analysis pipeline identifying multi-dimensional statistical patterns, correlations, and interactive visual reporting dashboards.",
    status: "Analytical Case Study",
    image: "/images/project-data.svg",
    link: "https://github.com/ANJALIAGARWAL-7355",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const container = document.querySelector(".work-container");
      if (!box.length || !container) return;

      const rectLeft = container.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX > 0 ? translateX : 1000}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Featured <span>Projects</span>
        </h2>
        <div className="work-flex">
          {projectsData.map((project, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.number}</h3>
                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and technologies</h4>
                <p>{project.tools}</p>
                <div className="project-status-tag">{project.status}</div>
              </div>
              <WorkImage
                image={project.image}
                alt={project.name}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
