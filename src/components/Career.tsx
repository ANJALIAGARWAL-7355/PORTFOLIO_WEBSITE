import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="education">
      <div className="career-container">
        <h2>
          Education <span>&</span>
          <br /> Journey
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Computer Science &amp; Engineering</h4>
                <h5>Specialization in AI &amp; Machine Learning</h5>
              </div>
              <h3>2025 - Present</h3>
            </div>
            <p>
              Undergraduate program focused on core computer science foundations,
              data structures, software engineering, machine learning theory,
              and advanced artificial intelligence systems, with expected
              graduation in 2029.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI Intern</h4>
                <h5>Flyrank AI</h5>
              </div>
              <h3>Sep 2026 - Nov 2026</h3>
            </div>
            <p>
              Worked as an AI Intern at FlyRank AI — an AI-powered SEO and
              digital growth platform. Contributed to developing NLP pipelines
              for automated content analysis and keyword optimization. Assisted
              in fine-tuning language models for SEO content generation,
              integrating AI-driven features into the product stack, and
              building data preprocessing workflows using Python. Gained
              hands-on experience with LLMs, prompt engineering, and deploying
              ML models in a production environment.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI/ML Engineer &amp; Full-Stack Developer</h4>
                <h5>Independent &amp; Academic Projects</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Designing and developing intelligent applications including molecular
              property prediction, healthcare diagnosis tools, generative AI
              assistants, and end-to-end full-stack web applications.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Problem Solving &amp; Algorithmic Growth</h4>
                <h5>LeetCode &amp; Competitive Programming</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Actively mastering core Data Structures and Algorithms with a focus
              on 75+ fundamental patterns spanning dynamic programming, graphs,
              trees, and sliding window techniques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
