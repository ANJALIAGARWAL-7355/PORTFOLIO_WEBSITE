import {
  FaBrain,
  FaRobot,
  FaLanguage,
  FaChartLine,
  FaDiagramProject,
  FaLayerGroup,
  FaServer,
  FaCubes,
  FaCompass,
} from "react-icons/fa6";
import { BsStars, BsCpu } from "react-icons/bs";
import "./styles/AIMLSection.css";

interface AIMLTopic {
  id: string;
  title: string;
  category: "Foundations" | "Deep Architectures" | "NLP & GenAI" | "Autonomous Systems";
  description: string;
  technologies: string[];
  icon: JSX.Element;
}

const aimlTopics: AIMLTopic[] = [
  {
    id: "supervised",
    title: "Supervised Learning",
    category: "Foundations",
    description:
      "Labeled dataset training utilizing optimization algorithms, loss function minimization, cost surface navigation, and generalization validation.",
    technologies: ["Linear Models", "SVM", "Random Forests", "Gradient Boosting", "XGBoost"],
    icon: <FaChartLine />,
  },
  {
    id: "unsupervised",
    title: "Unsupervised Learning",
    category: "Foundations",
    description:
      "Uncovering latent geometric patterns, cluster memberships, anomaly detection, and manifold learning without manual ground truth labels.",
    technologies: ["K-Means", "DBSCAN", "PCA", "t-SNE", "Autoencoders"],
    icon: <FaDiagramProject />,
  },
  {
    id: "reinforcement",
    title: "Reinforcement Learning",
    category: "Autonomous Systems",
    description:
      "Markov Decision Processes (MDPs), policy optimization, reward signaling, Q-learning, and continuous action space policy gradients.",
    technologies: ["Q-Learning", "DQN", "Policy Gradients", "PPO", "Actor-Critic"],
    icon: <FaCompass />,
  },
  {
    id: "regression-class",
    title: "Regression and Classification",
    category: "Foundations",
    description:
      "Statistical modeling for continuous scalar forecasting and discrete multi-class boundary separation with calibrated probabilistic confidences.",
    technologies: ["Logistic Regression", "Ridge & Lasso", "Softmax", "ROC-AUC", "F1 Scoring"],
    icon: <FaChartLine />,
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    category: "Deep Architectures",
    description:
      "Multi-layer Perceptrons (MLPs), backpropagation, non-linear activation mechanics (ReLU, GELU), batch normalization, and weight initialization.",
    technologies: ["Feedforward", "Backprop", "SGD & Adam", "Dropout", "PyTorch / TensorFlow"],
    icon: <FaBrain />,
  },
  {
    id: "cnn-rnn",
    title: "CNN and RNN",
    category: "Deep Architectures",
    description:
      "Spatial convolution feature maps for computer vision paired with recurrent gated memory units (LSTM, GRU) for temporal sequential signals.",
    technologies: ["ResNet", "Conv2D / Pooling", "LSTM", "GRU", "Bidirectional RNNs"],
    icon: <FaLayerGroup />,
  },
  {
    id: "transformers",
    title: "Transformers",
    category: "Deep Architectures",
    description:
      "Scaled Dot-Product Self-Attention mechanisms, multi-head attention blocks, positional embeddings, encoder-decoder topologies.",
    technologies: ["Self-Attention", "Multi-Head Attention", "BERT", "GPT", "Vision Transformers"],
    icon: <BsCpu />,
  },
  {
    id: "nlp",
    title: "Natural Language Processing",
    category: "NLP & GenAI",
    description:
      "Computational linguistics, subword tokenization (BPE), semantic word vectors, syntactic parsing, sentiment analysis, and NER.",
    technologies: ["Word2Vec", "GloVe", "Tokenization", "Spacy", "Hugging Face"],
    icon: <FaLanguage />,
  },
  {
    id: "llms",
    title: "Large Language Models",
    category: "NLP & GenAI",
    description:
      "Billion-parameter autoregressive models, instruction fine-tuning, RLHF, alignment, in-context few-shot learning, and quantization.",
    technologies: ["Llama 3", "Mistral", "LoRA / QLoRA", "Inference Opt", "GGUF / vLLM"],
    icon: <FaServer />,
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    category: "NLP & GenAI",
    description:
      "Creative synthesis spanning text generation, latent diffusion visual generation, multimodal models, and variational inference.",
    technologies: ["Diffusion Models", "Prompt Engineering", "Multimodal APIs", "GANs", "VAE"],
    icon: <BsStars />,
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation",
    category: "NLP & GenAI",
    description:
      "Grounding LLM reasoning over proprietary documents with dense vector embeddings, hybrid keyword search, chunking strategies, and re-ranking.",
    technologies: ["LangChain", "LlamaIndex", "ChromaDB", "FAISS", "Cross-Encoders"],
    icon: <FaCubes />,
  },
  {
    id: "ai-agents",
    title: "AI Agents",
    category: "Autonomous Systems",
    description:
      "Autonomous cognitive architectures with tool execution, plan-and-solve loops (ReAct), multi-agent coordination, and persistent episodic memory.",
    technologies: ["ReAct Framework", "Tool Calling", "LangGraph", "Multi-Agent Swarms", "Memory"],
    icon: <FaRobot />,
  },
];

const AIMLSection = () => {
  return (
    <div className="aiml-section section-container" id="aiml">
      <div className="aiml-header">
        <div className="aiml-badge">
          <BsStars /> Artificial Intelligence &amp; Deep Learning
        </div>
        <h2>
          AI &amp; Machine Learning <span>Expertise</span>
        </h2>
        <p className="aiml-subtitle">
          Comprehensive practical and theoretical mastery across foundational machine learning,
          deep neural architectures, generative models, and autonomous AI systems.
        </p>
      </div>

      <div className="aiml-grid">
        {aimlTopics.map((item) => (
          <div key={item.id} className="aiml-card">
            <div className="aiml-card-top">
              <div className="aiml-icon-box">{item.icon}</div>
              <span className="aiml-card-cat">{item.category}</span>
            </div>
            <h3 className="aiml-card-title">{item.title}</h3>
            <p className="aiml-card-desc">{item.description}</p>
            <div className="aiml-card-techs">
              {item.technologies.map((tech, idx) => (
                <span key={idx} className="aiml-tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIMLSection;
