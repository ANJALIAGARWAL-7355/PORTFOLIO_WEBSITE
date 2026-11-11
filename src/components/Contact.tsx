import { useState, FormEvent } from "react";
import { MdArrowOutward, MdCopyright, MdSend, MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import "./styles/Contact.css";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ type: "idle", message: "" });

    // Client-side validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setStatus({ type: "error", message: "Please enter your name (min 2 characters)." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setStatus({ type: "error", message: "Please enter a message (min 5 characters)." });
      return;
    }

    setLoading(true);

    try {
      // Connect to Python Flask / FastAPI backend
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Thank you! Your message has been sent successfully. Anjali will get back to you soon.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const errorMsg =
          data.error ||
          (data.errors && Object.values(data.errors).join(", ")) ||
          "Failed to send message. Please try again or email directly.";
        setStatus({ type: "error", message: errorMsg });
      }
    } catch (err) {
      console.error("API error:", err);
      // Fallback message for offline dev or direct mailto
      setStatus({
        type: "error",
        message:
          "Unable to connect to the backend server. Please verify the Python backend is running or email anjaliagarwal7355@gmail.com directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <p className="contact-intro-text">
          Have an opportunity, collaboration, or question? Feel free to reach out directly through the form below or via social channels.
        </p>

        {/* Contact Form Container */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                placeholder="e.g. AI/ML Engineering Opportunity"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                rows={5}
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              ></textarea>
            </div>

            {status.type === "success" && (
              <div className="form-status success">
                <MdCheckCircle /> {status.message}
              </div>
            )}

            {status.type === "error" && (
              <div className="form-status error">
                <MdErrorOutline /> {status.message}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>Sending message...</>
              ) : (
                <>
                  Send Message <MdSend />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info & Social Links */}
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:anjaliagarwal7355@gmail.com" data-cursor="disable">
                anjaliagarwal7355@gmail.com
              </a>
            </p>
            <h4>Location &amp; Availability</h4>
            <p className="contact-avail">
              Open to AI/ML &amp; Software Engineering Internships &amp; Roles
            </p>
          </div>

          <div className="contact-box">
            <h4>Social Profiles</h4>
            <a
              href="https://github.com/ANJALIAGARWAL-7355"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
              aria-label="GitHub Profile - Anjali Agarwal"
            >
              <FaGithub className="social-inline-icon" /> Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/anjali-agarwal-138a0b399/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
              aria-label="LinkedIn Profile - Anjali Agarwal"
            >
              <FaLinkedinIn className="social-inline-icon" /> Linkedin <MdArrowOutward />
            </a>
            <a
              href="#leetcode"
              data-cursor="disable"
              className="contact-social"
              aria-label="LeetCode Profile - Anjali Agarwal"
            >
              <SiLeetcode className="social-inline-icon" /> LeetCode (75+ Solved) <MdArrowOutward />
            </a>
          </div>

          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Anjali Agarwal</span>
            </h2>
            <h5>
              <MdCopyright /> 2026 Anjali Agarwal. All rights reserved.
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
