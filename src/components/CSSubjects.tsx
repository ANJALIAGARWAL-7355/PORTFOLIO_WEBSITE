import { FaGears, FaDatabase, FaNetworkWired, FaMicrochip, FaCode, FaSquareRootVariable } from "react-icons/fa6";
import { BsCpu, BsDiagram3 } from "react-icons/bs";
import { TbMathFunction, TbMathSymbols } from "react-icons/tb";
import "./styles/CSSubjects.css";

interface SubjectItem {
  id: string;
  name: string;
  category: "Core Computer Science" | "Systems & Architecture" | "Mathematical Foundations" | "Software Engineering";
  topics: string[];
  icon: JSX.Element;
}

const subjectsData: SubjectItem[] = [
  {
    id: "dsa",
    name: "Data Structures and Algorithms",
    category: "Core Computer Science",
    topics: ["Arrays & Linked Lists", "Trees & Graphs", "Dynamic Programming", "Time & Space Complexity", "Sorting & Searching"],
    icon: <BsDiagram3 />,
  },
  {
    id: "oops",
    name: "Object-Oriented Programming",
    category: "Software Engineering",
    topics: ["Encapsulation & Abstraction", "Inheritance & Polymorphism", "Design Patterns", "SOLID Principles", "Modular Code Design"],
    icon: <FaCode />,
  },
  {
    id: "dbms",
    name: "Database Management Systems",
    category: "Core Computer Science",
    topics: ["Relational Schema & SQL", "ACID Transactions", "Normalization (1NF-BCNF)", "Indexing & B-Trees", "Query Optimization"],
    icon: <FaDatabase />,
  },
  {
    id: "os",
    name: "Operating Systems",
    category: "Systems & Architecture",
    topics: ["Process Scheduling", "Threads & Concurrency", "Virtual Memory & Paging", "Deadlock Avoidance", "File System Architecture"],
    icon: <BsCpu />,
  },
  {
    id: "cn",
    name: "Computer Networks",
    category: "Systems & Architecture",
    topics: ["OSI & TCP/IP Stack", "Routing & Switching", "DNS, HTTP/HTTPS, WebSockets", "Flow & Congestion Control", "Network Security"],
    icon: <FaNetworkWired />,
  },
  {
    id: "coa",
    name: "Computer Organization and Architecture",
    category: "Systems & Architecture",
    topics: ["Instruction Set Architecture (ISA)", "Pipelining & Hazards", "Memory Hierarchy & Cache", "ALU & Control Unit", "I/O Organization"],
    icon: <FaMicrochip />,
  },
  {
    id: "se",
    name: "Software Engineering",
    category: "Software Engineering",
    topics: ["SDLC Methodologies", "Agile & Scrum", "CI/CD & DevOps Practices", "Software Testing & QA", "System Design & Architecture"],
    icon: <FaGears />,
  },
  {
    id: "dm",
    name: "Discrete Mathematics",
    category: "Mathematical Foundations",
    topics: ["Set Theory & Logic", "Combinatorics & Permutations", "Graph Theory", "Recurrence Relations", "Boolean Algebra"],
    icon: <TbMathSymbols />,
  },
  {
    id: "la",
    name: "Linear Algebra",
    category: "Mathematical Foundations",
    topics: ["Vectors, Matrices & Tensors", "Eigenvalues & Eigenvectors", "Singular Value Decomposition (SVD)", "Vector Spaces & Orthogonality", "Dimensionality Reduction"],
    icon: <FaSquareRootVariable />,
  },
  {
    id: "prob",
    name: "Probability and Statistics",
    category: "Mathematical Foundations",
    topics: ["Random Variables & Distributions", "Bayes' Theorem & Inference", "Expectation & Variance", "Hypothesis Testing", "Maximum Likelihood Estimation (MLE)"],
    icon: <TbMathFunction />,
  },
  {
    id: "calc",
    name: "Calculus and Optimization",
    category: "Mathematical Foundations",
    topics: ["Multivariate Calculus & Gradients", "Gradient Descent & Adam", "Convex Optimization", "Lagrange Multipliers", "Loss Function Optimization"],
    icon: <FaSquareRootVariable />,
  },
];

const CSSubjects = () => {
  return (
    <div className="subjects-section section-container" id="subjects">
      <div className="subjects-header">
        <h2>
          Computer Science <span>Curriculum</span>
        </h2>
        <p className="subjects-subtitle">
          Foundational engineering subjects and mathematical frameworks powering my
          expertise in Artificial Intelligence, Machine Learning, and Software Engineering.
        </p>
      </div>

      <div className="subjects-grid">
        {subjectsData.map((subj) => (
          <div key={subj.id} className="subject-card">
            <div className="subject-card-header">
              <div className="subject-icon">{subj.icon}</div>
              <span className="subject-category">{subj.category}</span>
            </div>
            <h3 className="subject-title">{subj.name}</h3>
            <div className="subject-topics-list">
              {subj.topics.map((t, idx) => (
                <span key={idx} className="subject-topic-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSubjects;
