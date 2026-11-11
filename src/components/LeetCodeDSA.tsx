import { useState, useEffect } from "react";
import { leetcodeProblems } from "../data/leetcodeData";
import { MdArrowOutward, MdSearch, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import { SiLeetcode } from "react-icons/si";
import "./styles/LeetCodeDSA.css";

const STORAGE_KEY = "anjali_leetcode_progress";

const LeetCodeDSA = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [solvedIds, setSolvedIds] = useState<number[]>([]);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSolvedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load LeetCode progress", e);
    }
  }, []);

  const toggleSolved = (id: number) => {
    setSolvedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
      return next;
    });
  };

  const topics = [
    "All",
    "Arrays & Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stacks & Queues",
    "Binary Search",
    "Linked Lists",
    "Trees",
    "Heaps",
    "Backtracking",
    "Graphs",
    "Dynamic Programming",
    "Greedy Algorithms",
    "Bit Manipulation",
  ];

  const filteredProblems = leetcodeProblems.filter((p) => {
    const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchesDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesDiff && matchesSearch;
  });

  const totalCount = leetcodeProblems.length;
  const solvedCount = solvedIds.length;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="leetcode-section section-container" id="leetcode">
      <div className="leetcode-header">
        <div className="leetcode-title-box">
          <div className="leetcode-icon-badge">
            <SiLeetcode />
          </div>
          <h2>
            LeetCode &amp; <span>DSA Showcase</span>
          </h2>
        </div>
        <p className="leetcode-subtitle">
          Curated collection of 75+ fundamental algorithmic patterns spanning core
          data structures, graph theory, and dynamic programming. Interactive progress tracker.
        </p>

        {/* Progress Tracker */}
        <div className="leetcode-progress-card">
          <div className="progress-stats">
            <div>
              <span className="stats-label">Total Curated:</span>
              <span className="stats-val">{totalCount} Problems</span>
            </div>
            <div>
              <span className="stats-label">Progress:</span>
              <span className="stats-val">{solvedCount} / {totalCount} Solved ({progressPercent}%)</span>
            </div>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Controls: Topic Filter, Difficulty, Search */}
        <div className="leetcode-controls">
          <div className="leetcode-search-box">
            <MdSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search problem by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search LeetCode problem"
            />
          </div>

          <div className="leetcode-difficulty-pills">
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                className={`diff-pill ${selectedDifficulty === diff ? "active" : ""} ${diff.toLowerCase()}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="leetcode-topics-scroll">
          {topics.map((t) => (
            <button
              key={t}
              className={`topic-btn ${selectedTopic === t ? "active" : ""}`}
              onClick={() => setSelectedTopic(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Grid */}
      <div className="leetcode-grid">
        {filteredProblems.map((problem) => {
          const isSolved = solvedIds.includes(problem.id);
          return (
            <div
              key={problem.id}
              className={`leetcode-card ${isSolved ? "is-solved" : ""}`}
            >
              <div className="card-top">
                <span className="problem-num">#{problem.id}</span>
                <span className={`diff-badge ${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>
              <h4 className="problem-title">{problem.title}</h4>
              <div className="problem-topic-tag">{problem.topic}</div>

              <div className="card-footer">
                <button
                  className="status-toggle-btn"
                  onClick={() => toggleSolved(problem.id)}
                  title={isSolved ? "Mark as In Progress" : "Mark as Solved"}
                >
                  {isSolved ? (
                    <>
                      <MdCheckCircle className="icon-solved" /> Solved
                    </>
                  ) : (
                    <>
                      <MdRadioButtonUnchecked className="icon-todo" /> Mark Solved
                    </>
                  )}
                </button>
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="solve-link"
                  aria-label={`Open ${problem.title} on LeetCode in a new tab`}
                  data-cursor="disable"
                >
                  Solve on LeetCode <MdArrowOutward />
                </a>
              </div>
            </div>
          );
        })}
      </div>
      {filteredProblems.length === 0 && (
        <div className="no-problems-found">
          <p>No problems found matching your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default LeetCodeDSA;
