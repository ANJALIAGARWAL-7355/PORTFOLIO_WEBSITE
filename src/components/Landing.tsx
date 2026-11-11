import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ANJALI
              <br />
              <span>AGARWAL</span>
            </h1>
            <div className="landing-tagline">
              <p className="landing-hero-heading">
                Building Intelligent Systems.<br />
                Creating Meaningful Technology.
              </p>
              <p className="landing-hero-subtitle">
                AI/ML Enthusiast | Full-Stack Developer | Problem Solver
              </p>
            </div>
          </div>
          <div className="landing-info">
            <h3>Specializing in</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Engineer</div>
              <div className="landing-h2-2">Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">AI / ML</div>
              <div className="landing-h2-info-1">Full-Stack</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
