// ============================================
// NAFIZ AHMED - PORTFOLIO RPG
// A Pokemon-style exploration game
// ============================================

const S = 16; // tile size
const COLS = 30;
const ROWS = 20;

// Tile types
const T = {
  GRASS: 0, PATH: 1, TREE: 2, WATER: 3, WALL: 4, DOOR: 5,
  ROOF_C: 6, ROOF_R: 7, ROOF_Y: 8, ROOF_P: 9,
  FLOWER_R: 10, FLOWER_Y: 11,
  FLOOR: 12, EXIT: 13
};

// Walkable tiles
const WALKABLE = new Set([T.GRASS, T.PATH, T.FLOWER_R, T.FLOWER_Y, T.WATER]);

// Map (30x20)
const MAP = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,0,0,6,6,6,6,6,0,0,0,0,0,0,1,1,0,0,0,0,0,7,7,7,7,7,0,0,0,2],
  [2,0,0,4,4,4,4,4,0,0,10,0,0,0,1,1,0,0,0,10,0,4,4,4,4,4,0,0,0,2],
  [2,0,0,4,4,4,4,4,0,0,0,0,0,0,1,1,0,0,0,0,0,4,4,4,4,4,0,0,0,2],
  [2,0,0,4,4,5,4,4,0,0,0,0,0,0,1,1,0,0,0,0,0,4,4,5,4,4,0,0,0,2],
  [2,0,0,0,0,1,0,0,0,0,11,0,0,0,1,1,0,0,11,0,0,0,0,1,0,0,0,0,0,2],
  [2,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,2],
  [2,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,2],
  [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
  [2,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,3,3,0,2],
  [2,0,0,0,0,1,0,0,0,10,0,0,0,0,1,1,0,0,0,10,0,0,0,1,0,0,3,3,0,2],
  [2,0,0,8,8,8,8,8,0,0,0,0,0,0,1,1,0,0,0,0,0,9,9,9,9,9,0,0,0,2],
  [2,0,0,4,4,4,4,4,0,0,11,0,0,0,1,1,0,0,0,11,0,4,4,4,4,4,0,0,0,2],
  [2,0,0,4,4,4,4,4,0,0,0,0,0,0,1,1,0,0,0,0,0,4,4,4,4,4,0,0,0,2],
  [2,0,0,4,4,5,4,4,0,0,0,0,0,0,1,1,0,0,0,0,0,4,4,5,4,4,0,0,0,2],
  [2,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,2],
  [2,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,2],
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

// Door -> building mapping (key = "x,y")
const DOOR_MAP = {
  '5,5': 'lab',
  '23,5': 'workshop',
  '5,15': 'career',
  '23,15': 'academy'
};

// Building dialog content
const BUILDINGS = {
  lab: {
    name: 'RESEARCH LAB',
    pages: [
      { speaker: 'RESEARCH LAB', text: 'Welcome! This lab houses all of Nafiz\'s published research and ongoing work.' },
      { speaker: 'PUBLISHED', text: '"Deep Learning-Based NLP in Human-Agent Interaction" - Elsevier NLP Journal, 2024. A comprehensive survey on DL techniques in NLP for dialogue systems.' },
      { speaker: 'PUBLISHED', text: '"Blockchain-Based Data Security for ERP Systems" - IJIEEB, 2023. Two proposed models for securing enterprise data with blockchain.' },
      { speaker: 'UNDER REVIEW', text: '"Hybrid MedT" - A novel few-shot architecture achieving 92.72% Dice coefficient with only 5% training data for retinal vessel segmentation.' },
      { speaker: 'UNDER REVIEW', text: '"Explainable Brain Tumor Localization" - Custom YOLOv12 with DenseBlock achieving 94.35% mAP@50 on 4-class brain tumor dataset.' },
      { speaker: 'ONGOING', text: '"AI-Driven Staging of Pediatric Nephroblastoma" - Dual-stream system achieving 90.81% Dice score for Wilms\' tumor detection on CT scans.' }
    ]
  },
  workshop: {
    name: 'PROJECT WORKSHOP',
    pages: [
      { speaker: 'PROJECT WORKSHOP', text: 'Here you\'ll find Nafiz\'s most impressive engineering projects!' },
      { speaker: 'RETINAL SEGMENTATION', text: 'Few-shot learning architecture with 92.72% Dice using Medical Transformer + hybrid attention. Built with TensorFlow.' },
      { speaker: 'BENGALI LEGAL RAG', text: 'Enterprise-scale RAG pipeline for 50,000+ legal documents. 98% layout fidelity, 0.95 Faithfulness score using YOLOv8 + GPT-4.' },
      { speaker: 'BANK WARNING SYSTEM', text: 'Financial risk prediction for DBH Bank using XGBoost + Prophet. Time-series analysis for proactive defaulter identification. Live in production!' },
      { speaker: 'PASSPORTED', text: 'Generative AI system using Latent Diffusion + ControlNet to transform casual photos into standardized passport photos.' },
      { speaker: 'BRAIN TUMOR AI', text: 'Custom YOLOv12 with DenseBlock integration. 94.35% mAP@50 across 4 tumor classes with Grad-CAM explainability.' }
    ]
  },
  career: {
    name: 'CAREER CENTER',
    pages: [
      { speaker: 'CAREER CENTER', text: 'Nafiz\'s professional journey spans multiple countries and cutting-edge AI domains!' },
      { speaker: 'PERISCOPELABS', text: 'ML Engineer (Mid-Level) | Oct 2025 - Present | Banani, Bangladesh. Architecting defaulter warning systems, RAG pipelines with YOLOv5n + GPT-4, multi-agentic AI solutions.' },
      { speaker: 'ELITE LAB', text: 'Researcher | Sep 2025 - Present | New York (Remote). Contributing to 3 papers on CV and LLMs. Built modified U-Net for retinal segmentation. Designed child-safe LLM guardrails.' },
      { speaker: 'METROSOFTS', text: 'ML Engineer | Jan 2024 - Oct 2025 | Gothenburg, Sweden (Remote). Multi-modal AI pipeline with dual-YOLOv5n (87% acc, 120 FPS). LLaVaNext for UI annotation.' },
      { speaker: 'AMIR LAB', text: 'Research Intern | Sep 2023 - Mar 2024 | Dhaka. Published peer-reviewed literature review on NLP + Deep Learning. Led 3-member research team.' },
      { speaker: 'SHAPLA INFOSYS', text: 'Jr Software Engineer | Jan - Dec 2023 | Dhaka. Built web apps with Laravel/React (+40% satisfaction). 200+ Figma prototypes. 98% Lighthouse score.' }
    ]
  },
  academy: {
    name: 'ACADEMY',
    pages: [
      { speaker: 'ACADEMY', text: 'Welcome to the Academy! Here lies Nafiz\'s academic achievements and credentials.' },
      { speaker: 'EDUCATION', text: 'B.Sc. in Computer Science & Engineering from American International University-Bangladesh (AIUB). CGPA: 3.93/4.00 - Top 2% of graduating class!' },
      { speaker: 'HONORS', text: 'Magna Cum Laude honor! That\'s the highest academic distinction. Plus 4 consecutive Dean\'s List Awards for outstanding performance.' },
      { speaker: 'SKILLS', text: 'ML/DL: PyTorch, TensorFlow, Keras, Transformers. CV: YOLO, U-Net, Segmentation, Medical Imaging. GenAI: RAG, LangChain, CrewAI, Prompt Engineering.' },
      { speaker: 'SKILLS', text: 'MLOps: Docker, FastAPI, AWS, ChromaDB. Languages: Python, JavaScript, SQL. Research: Medical AI, Explainable AI, Few-Shot Learning.' },
      { speaker: 'CONTACT', text: 'Email: nafizahmed273273@gmail.com | GitHub: Nafishsy | LinkedIn: Nafishy | Google Scholar: Nafiz Ahmed' }
    ]
  }
};

// NPC data
const NPCS = [
  {
    x: 13, y: 8, name: 'Guide Chip', hair: '#40cc40', body: '#308830', skin: '#ffcc99',
    acc: null, idleDir: 'down', idleTimer: 0, idleCycle: 0,
    dialog: [
      { speaker: 'GUIDE CHIP', text: 'Welcome to Nafiz\'s world! I\'m your guide.' },
      { speaker: 'GUIDE CHIP', text: 'Explore the 4 buildings to learn about Nafiz. Walk up to doors and press SPACE!' },
      { speaker: 'GUIDE CHIP', text: 'Collect all 10 glowing items scattered around town. Press I to view your inventory!' },
      { speaker: 'GUIDE CHIP', text: 'Talk to the NPCs near each building for more details. Good luck, explorer!' }
    ]
  },
  {
    x: 8, y: 3, name: 'Prof. Synapse', hair: '#4060cc', body: '#3050aa', skin: '#e8bb88',
    acc: 'glasses', idleDir: 'down', idleTimer: 0, idleCycle: 0,
    dialog: [
      { speaker: 'PROF. SYNAPSE', text: 'I study Nafiz\'s research output. Quite impressive!' },
      { speaker: 'PROF. SYNAPSE', text: 'He\'s published in Elsevier and contributed to medical AI breakthroughs.' },
      { speaker: 'PROF. SYNAPSE', text: 'His retinal vessel segmentation work achieves 92.72% Dice with just 5% training data. Remarkable few-shot learning!' }
    ]
  },
  {
    x: 20, y: 4, name: 'Dev.0', hair: '#dd8820', body: '#bb6610', skin: '#ffcc99',
    acc: 'hat', idleDir: 'down', idleTimer: 0, idleCycle: 0,
    dialog: [
      { speaker: 'DEV.0', text: 'Yo! I\'m Dev.0, the project specialist.' },
      { speaker: 'DEV.0', text: 'Nafiz built a RAG system handling 50,000+ Bengali legal documents. That\'s enterprise-scale NLP!' },
      { speaker: 'DEV.0', text: 'He also built a bank early warning system that\'s live in production. Real-world ML impact!' }
    ]
  },
  {
    x: 8, y: 16, name: 'Cpt. Vector', hair: '#ccaa20', body: '#aa8810', skin: '#ddaa77',
    acc: 'badge', idleDir: 'down', idleTimer: 0, idleCycle: 0,
    dialog: [
      { speaker: 'CPT. VECTOR', text: 'At ease, explorer! I track Nafiz\'s career deployments.' },
      { speaker: 'CPT. VECTOR', text: 'He\'s worked across Bangladesh, Sweden, and the USA. A truly global ML engineer!' },
      { speaker: 'CPT. VECTOR', text: 'Currently at Periscopelabs building Agentic AI for banking and travel sectors. Plus research at ELITE Lab in New York!' }
    ]
  },
  {
    x: 20, y: 16, name: 'Scholar Bit', hair: '#9944cc', body: '#7733aa', skin: '#ffcc99',
    acc: 'book', idleDir: 'down', idleTimer: 0, idleCycle: 0,
    dialog: [
      { speaker: 'SCHOLAR BIT', text: 'Greetings! I\'m the Academy\'s keeper of knowledge.' },
      { speaker: 'SCHOLAR BIT', text: 'Nafiz graduated with 3.93 CGPA from AIUB. That\'s Top 2% - earning Magna Cum Laude!' },
      { speaker: 'SCHOLAR BIT', text: '4 consecutive Dean\'s Awards! His mastery spans PyTorch, TensorFlow, YOLO, LangChain, and much more.' }
    ]
  }
];

// Collectible items
const ITEMS = [
  { x: 2, y: 2, style: 'fire', name: 'PyTorch Flame', desc: 'Mastery of PyTorch deep learning framework. Nafiz\'s primary research tool.', color: '#ff4422' },
  { x: 27, y: 2, style: 'crystal', name: 'TensorFlow Crystal', desc: 'TensorFlow expertise for production ML systems and medical imaging.', color: '#ff8800' },
  { x: 12, y: 1, style: 'star', name: 'Research Star', desc: 'Published peer-reviewed research in Elsevier NLP Journal (2024).', color: '#ffd700' },
  { x: 19, y: 7, style: 'mushroom', name: 'YOLO Shroom', desc: 'YOLO object detection mastery. YOLOv5, v8, v12 - customized architectures.', color: '#44cc44' },
  { x: 1, y: 18, style: 'trophy', name: 'Dean\'s Trophy', desc: '4 consecutive Dean\'s List Awards from AIUB. Academic excellence!', color: '#ffd700' },
  { x: 28, y: 18, style: 'coin', name: 'RAG Coin', desc: 'RAG pipeline expertise. Built systems for 50K+ documents with 0.95 Faithfulness.', color: '#ffd700' },
  { x: 9, y: 18, style: 'star', name: 'Magna Star', desc: 'Magna Cum Laude honor. Top 2% graduate with 3.93 CGPA.', color: '#ffd700' },
  { x: 19, y: 18, style: 'mushroom', name: 'Docker Shroom', desc: 'MLOps deployment with Docker, FastAPI, and AWS. Production-ready ML.', color: '#2288dd' },
  { x: 28, y: 10, style: 'coin', name: 'LangChain Coin', desc: 'LangChain + CrewAI orchestration. Multi-agent AI system architect.', color: '#cc88ff' },
  { x: 12, y: 18, style: 'crystal', name: 'Vision Crystal', desc: 'Computer Vision specialist. Medical imaging, segmentation, detection.', color: '#00ccdd' }
];

// Building labels
const LABELS = [
  { x: 5, y: 2, text: 'RESEARCH', color: '#00ccdd' },
  { x: 23, y: 2, text: 'PROJECTS', color: '#cc3040' },
  { x: 5, y: 12, text: 'CAREER', color: '#ccaa30' },
  { x: 23, y: 12, text: 'ACADEMY', color: '#8844aa' }
];

// ============================================
// INTERIOR MAPS (12x10 each)
// ============================================
const INTERIOR_COLS = 12;
const INTERIOR_ROWS = 10;

const INTERIOR_MAPS = {
  lab: [
    [4,4,4,4,4,4,4,4,4,4,4,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,4,4,4,4,13,13,4,4,4,4,4]
  ],
  workshop: [
    [4,4,4,4,4,4,4,4,4,4,4,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,4,4,4,4,13,13,4,4,4,4,4]
  ],
  career: [
    [4,4,4,4,4,4,4,4,4,4,4,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,4,4,4,4,13,13,4,4,4,4,4]
  ],
  academy: [
    [4,4,4,4,4,4,4,4,4,4,4,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,12,12,12,12,12,12,12,12,12,12,4],
    [4,4,4,4,4,13,13,4,4,4,4,4]
  ]
};

// Interior objects for each building
const INTERIOR_OBJECTS = {
  lab: [
    { x: 5, y: 1, type: 'board', name: 'Research Whiteboard',
      dialog: [
        { speaker: 'RESEARCH WHITEBOARD', text: 'Welcome! This lab houses all of Nafiz\'s published research and ongoing work.' },
        { speaker: 'RESEARCH WHITEBOARD', text: 'Check the terminals and desks around the room for details on each project.' }
      ]},
    { x: 2, y: 3, type: 'computer', name: 'Publication Terminal',
      link: 'https://doi.org/10.1016/j.nlp.2024.100112',
      dialog: [
        { speaker: 'PUBLICATION TERMINAL', text: '"Deep Learning-Based NLP in Human-Agent Interaction" - Elsevier NLP Journal, 2024. A comprehensive survey on DL techniques in NLP for dialogue systems.' },
        { speaker: 'PUBLICATION TERMINAL', text: '"Blockchain-Based Data Security for ERP Systems" - IJIEEB, 2023. Two proposed models for securing enterprise data with blockchain.' }
      ]},
    { x: 9, y: 3, type: 'computer', name: 'Review Terminal',
      dialog: [
        { speaker: 'REVIEW TERMINAL', text: '"Hybrid MedT" - A novel few-shot architecture achieving 92.72% Dice coefficient with only 5% training data for retinal vessel segmentation.' },
        { speaker: 'REVIEW TERMINAL', text: '"Explainable Brain Tumor Localization" - Custom YOLOv12 with DenseBlock achieving 94.35% mAP@50 on 4-class brain tumor dataset.' }
      ]},
    { x: 5, y: 6, type: 'desk', name: 'Ongoing Research Desk',
      dialog: [
        { speaker: 'ONGOING RESEARCH', text: '"AI-Driven Staging of Pediatric Nephroblastoma" - Dual-stream system achieving 90.81% Dice score for Wilms\' tumor detection on CT scans.' }
      ]},
    { x: 2, y: 6, type: 'shelf', name: 'Reference Shelf',
      dialog: [
        { speaker: 'REFERENCE SHELF', text: 'Stacked with papers on Medical AI, Explainable AI, and Few-Shot Learning. Nafiz\'s core research domains.' }
      ]}
  ],
  workshop: [
    { x: 5, y: 1, type: 'board', name: 'Project Board',
      dialog: [
        { speaker: 'PROJECT BOARD', text: 'Here you\'ll find Nafiz\'s most impressive engineering projects! Check each workstation for details.' }
      ]},
    { x: 2, y: 3, type: 'computer', name: 'Segmentation Station',
      link: 'https://huggingface.co/spaces/Suzera1n/Few_Shot',
      dialog: [
        { speaker: 'RETINAL SEGMENTATION', text: 'Few-shot learning architecture with 92.72% Dice using Medical Transformer + hybrid attention. Built with TensorFlow.' }
      ]},
    { x: 9, y: 3, type: 'computer', name: 'RAG Terminal',
      link: 'https://huggingface.co/spaces/Suzera1n/ScoBoba',
      dialog: [
        { speaker: 'BENGALI LEGAL RAG', text: 'Enterprise-scale RAG pipeline for 50,000+ legal documents. 98% layout fidelity, 0.95 Faithfulness score using YOLOv8 + GPT-4.' }
      ]},
    { x: 2, y: 6, type: 'workbench', name: 'Bank System Bench',
      dialog: [
        { speaker: 'BANK WARNING SYSTEM', text: 'Financial risk prediction for DBH Bank using XGBoost + Prophet. Time-series analysis for proactive defaulter identification. Live in production!' }
      ]},
    { x: 9, y: 6, type: 'workbench', name: 'PassPorted Station',
      link: 'https://huggingface.co/spaces/Suzera1n/PassPorted',
      dialog: [
        { speaker: 'PASSPORTED', text: 'Generative AI system using Latent Diffusion + ControlNet to transform casual photos into standardized passport photos. Deployed on HuggingFace Spaces.' }
      ]},
    { x: 5, y: 6, type: 'computer', name: 'Brain Tumor Terminal',
      dialog: [
        { speaker: 'BRAIN TUMOR AI', text: 'Custom YOLOv12 with DenseBlock integration. 94.35% mAP@50 across 4 tumor classes with Grad-CAM explainability.' }
      ]}
  ],
  career: [
    { x: 5, y: 1, type: 'board', name: 'Career Timeline',
      dialog: [
        { speaker: 'CAREER TIMELINE', text: 'Nafiz\'s professional journey spans multiple countries and cutting-edge AI domains!' }
      ]},
    { x: 2, y: 3, type: 'desk', name: 'Periscopelabs Desk',
      dialog: [
        { speaker: 'PERISCOPELABS', text: 'ML Engineer (Mid-Level) | Oct 2025 - Present | Banani, Bangladesh. Architecting defaulter warning systems, RAG pipelines with YOLOv5n + GPT-4, multi-agentic AI solutions.' }
      ]},
    { x: 9, y: 3, type: 'computer', name: 'ELITE Lab Terminal',
      dialog: [
        { speaker: 'ELITE LAB', text: 'Researcher | Sep 2025 - Present | New York (Remote). Contributing to 3 papers on CV and LLMs. Built modified U-Net for retinal segmentation. Designed child-safe LLM guardrails.' }
      ]},
    { x: 2, y: 6, type: 'computer', name: 'Metrosofts Station',
      dialog: [
        { speaker: 'METROSOFTS', text: 'ML Engineer | Jan 2024 - Oct 2025 | Gothenburg, Sweden (Remote). Multi-modal AI pipeline with dual-YOLOv5n (87% acc, 120 FPS). LLaVaNext for UI annotation.' }
      ]},
    { x: 9, y: 6, type: 'desk', name: 'Previous Roles Desk',
      dialog: [
        { speaker: 'AMIR LAB', text: 'Research Intern | Sep 2023 - Mar 2024 | Dhaka. Published peer-reviewed literature review on NLP + Deep Learning. Led 3-member research team.' },
        { speaker: 'SHAPLA INFOSYS', text: 'Jr Software Engineer | Jan - Dec 2023 | Dhaka. Built web apps with Laravel/React (+40% satisfaction). 200+ Figma prototypes. 98% Lighthouse score.' }
      ]}
  ],
  academy: [
    { x: 5, y: 1, type: 'board', name: 'Welcome Board',
      dialog: [
        { speaker: 'ACADEMY', text: 'Welcome to the Academy! Here lies Nafiz\'s academic achievements and credentials.' }
      ]},
    { x: 2, y: 2, type: 'shelf', name: 'Diploma Shelf',
      dialog: [
        { speaker: 'EDUCATION', text: 'B.Sc. in Computer Science & Engineering from American International University-Bangladesh (AIUB). CGPA: 3.93/4.00 - Top 2% of graduating class!' }
      ]},
    { x: 9, y: 2, type: 'trophy', name: 'Trophy Case',
      dialog: [
        { speaker: 'HONORS', text: 'Magna Cum Laude honor! That\'s the highest academic distinction. Plus 4 consecutive Dean\'s List Awards for outstanding performance.' }
      ]},
    { x: 2, y: 6, type: 'computer', name: 'Skills Terminal',
      dialog: [
        { speaker: 'SKILLS', text: 'ML/DL: PyTorch, TensorFlow, Keras, Transformers. CV: YOLO, U-Net, Segmentation, Medical Imaging. GenAI: RAG, LangChain, CrewAI, Prompt Engineering.' },
        { speaker: 'SKILLS', text: 'MLOps: Docker, FastAPI, AWS, ChromaDB. Languages: Python, JavaScript, SQL. Research: Medical AI, Explainable AI, Few-Shot Learning.' }
      ]},
    { x: 9, y: 6, type: 'cabinet', name: 'Contact Directory',
      dialog: [
        { speaker: 'CONTACT', text: 'Email: nafizahmed273273@gmail.com | GitHub: Nafishsy | LinkedIn: Nafishy | Google Scholar: Nafiz Ahmed' }
      ]}
  ]
};

// ============================================
// PARTICLE SYSTEM
// ============================================
class Particles {
  constructor() {
    this.list = [];
  }

  emit(x, y, type, count) {
    for (let i = 0; i < count; i++) {
      const p = { x, y, type, life: 1, maxLife: 1 };
      switch (type) {
        case 'dust':
          p.vx = (Math.random() - 0.5) * 0.8;
          p.vy = -Math.random() * 0.5 - 0.2;
          p.maxLife = 0.4 + Math.random() * 0.3;
          p.life = p.maxLife;
          p.size = 1 + Math.random();
          p.color = '#c8a868';
          break;
        case 'sparkle':
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = -Math.random() * 2 - 0.5;
          p.maxLife = 0.5 + Math.random() * 0.4;
          p.life = p.maxLife;
          p.size = 1 + Math.random() * 2;
          p.color = '#ffd700';
          break;
        case 'pickup':
          const angle = (Math.PI * 2 / count) * i;
          p.vx = Math.cos(angle) * 2;
          p.vy = Math.sin(angle) * 2;
          p.maxLife = 0.6;
          p.life = 0.6;
          p.size = 2;
          p.color = '#ffd700';
          break;
        case 'splash':
          p.vx = (Math.random() - 0.5) * 1.5;
          p.vy = -Math.random() * 1.5 - 0.5;
          p.maxLife = 0.3 + Math.random() * 0.2;
          p.life = p.maxLife;
          p.size = 1 + Math.random();
          p.color = '#88ccff';
          break;
        case 'firefly':
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = (Math.random() - 0.5) * 0.3;
          p.maxLife = 2 + Math.random() * 3;
          p.life = p.maxLife;
          p.size = 1;
          p.phase = Math.random() * Math.PI * 2;
          p.color = '#aaffaa';
          break;
      }
      this.list.push(p);
    }
  }

  update(dt) {
    const sec = dt / 1000;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.life -= sec;
      if (p.life <= 0) { this.list.splice(i, 1); continue; }
      p.x += p.vx;
      p.y += p.vy;
      if (p.type === 'dust') p.vy -= sec * 0.5;
      if (p.type === 'firefly') {
        p.vx += (Math.random() - 0.5) * 0.1;
        p.vy += (Math.random() - 0.5) * 0.1;
        p.vx *= 0.98;
        p.vy *= 0.98;
      }
    }
  }

  draw(ctx) {
    for (const p of this.list) {
      const alpha = Math.min(1, p.life / p.maxLife * 2);
      if (p.type === 'firefly') {
        const glow = (Math.sin(Date.now() / 300 + p.phase) + 1) * 0.5;
        ctx.fillStyle = `rgba(170,255,170,${alpha * glow * 0.6})`;
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
        ctx.fillStyle = `rgba(220,255,220,${alpha * glow})`;
        ctx.fillRect(p.x, p.y, 1, 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.globalAlpha = 1;
      }
    }
  }
}

// ============================================
// TILE DRAWING (improved)
// ============================================
function drawTile(ctx, x, y, type, time) {
  const px = x * S, py = y * S;
  const t = time || Date.now();
  switch (type) {
    case T.GRASS: {
      // Rich multi-tone grass
      ctx.fillStyle = '#5a9e4f';
      ctx.fillRect(px, py, S, S);
      // Varied grass blades
      const seed = (x * 7 + y * 13) % 17;
      ctx.fillStyle = '#4e9045';
      ctx.fillRect(px + (seed % 5) + 1, py + 4, 1, 3);
      ctx.fillRect(px + ((seed * 3) % 11) + 2, py + 9, 1, 2);
      ctx.fillStyle = '#68b05a';
      ctx.fillRect(px + ((seed * 7) % 13) + 1, py + 2, 1, 2);
      // Subtle wind sway on some blades
      const sway = Math.sin(t / 1200 + x * 0.7 + y * 0.3);
      if (seed % 3 === 0) {
        ctx.fillStyle = '#72b864';
        ctx.fillRect(px + 7 + Math.round(sway), py + 1, 1, 3);
      }
      break;
    }
    case T.PATH: {
      ctx.fillStyle = '#c8a868';
      ctx.fillRect(px, py, S, S);
      // Gravel detail
      const ps = (x * 11 + y * 7) % 13;
      ctx.fillStyle = '#ba9a5e';
      ctx.fillRect(px + (ps % 6) + 2, py + 6, 2, 2);
      ctx.fillRect(px + ((ps * 3) % 10) + 3, py + 12, 2, 1);
      ctx.fillStyle = '#d4b878';
      ctx.fillRect(px + ((ps * 5) % 8) + 4, py + 3, 1, 1);
      ctx.fillRect(px + ((ps * 2) % 9) + 1, py + 10, 1, 1);
      break;
    }
    case T.TREE: {
      // Ground beneath
      ctx.fillStyle = '#4a8a3f';
      ctx.fillRect(px, py, S, S);
      // Trunk with bark texture
      ctx.fillStyle = '#6b4025';
      ctx.fillRect(px + 6, py + 9, 4, 7);
      ctx.fillStyle = '#5a3520';
      ctx.fillRect(px + 7, py + 10, 1, 5);
      // Canopy - layered for depth
      ctx.fillStyle = '#245520';
      ctx.fillRect(px + 1, py + 2, 14, 8);
      ctx.fillStyle = '#2d6028';
      ctx.fillRect(px + 2, py + 1, 12, 7);
      ctx.fillStyle = '#3a7535';
      ctx.fillRect(px + 3, py + 2, 10, 5);
      // Leaf highlights
      ctx.fillStyle = '#4a8a42';
      ctx.fillRect(px + 4, py + 2, 3, 2);
      ctx.fillRect(px + 9, py + 3, 2, 2);
      // Depth shadow at base
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(px + 2, py + 9, 12, 2);
      break;
    }
    case T.WATER: {
      // Animated water with wave layers
      ctx.fillStyle = '#2a6ac0';
      ctx.fillRect(px, py, S, S);
      const w1 = Math.sin(t / 700 + x * 0.8 + y * 0.3);
      const w2 = Math.sin(t / 500 + x * 1.2 + y * 0.6);
      ctx.fillStyle = '#3b7dd8';
      ctx.fillRect(px, py + 4 + Math.round(w1), S, 4);
      ctx.fillStyle = '#4a90e8';
      ctx.fillRect(px + 2, py + 3 + Math.round(w1 * 1.5), 5, 1);
      ctx.fillRect(px + 9, py + 8 + Math.round(w2), 4, 1);
      // Foam/shimmer
      ctx.fillStyle = 'rgba(180,220,255,0.3)';
      ctx.fillRect(px + 1 + Math.round(w2), py + 6, 3, 1);
      // Sparkle
      if ((Math.floor(t / 400) + x + y) % 7 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillRect(px + ((t / 100 + x * 3) % 12) + 2, py + ((t / 150 + y * 5) % 10) + 3, 1, 1);
      }
      break;
    }
    case T.WALL: {
      ctx.fillStyle = '#8888a0';
      ctx.fillRect(px, py, S, S);
      // Brick pattern
      ctx.fillStyle = '#7a7a90';
      ctx.fillRect(px, py + 4, S, 1);
      ctx.fillRect(px, py + 9, S, 1);
      ctx.fillRect(px, py + 14, S, 1);
      ctx.fillRect(px + 8, py, 1, 4);
      ctx.fillRect(px + 4, py + 5, 1, 4);
      ctx.fillRect(px + 12, py + 5, 1, 4);
      ctx.fillRect(px + 8, py + 10, 1, 4);
      // Mortar highlight
      ctx.fillStyle = '#9494a8';
      ctx.fillRect(px + 2, py + 1, 1, 1);
      ctx.fillRect(px + 10, py + 6, 1, 1);
      break;
    }
    case T.DOOR: {
      ctx.fillStyle = '#8b5e3c';
      ctx.fillRect(px, py, S, S);
      // Door frame
      ctx.fillStyle = '#6a4528';
      ctx.fillRect(px + 2, py, 12, 16);
      // Door panels
      ctx.fillStyle = '#7a5030';
      ctx.fillRect(px + 3, py + 1, 10, 15);
      // Panel lines
      ctx.fillStyle = '#684428';
      ctx.fillRect(px + 3, py + 7, 10, 1);
      ctx.fillRect(px + 8, py + 1, 1, 15);
      // Doorknob with shine
      ctx.fillStyle = '#f0c040';
      ctx.fillRect(px + 10, py + 8, 2, 2);
      ctx.fillStyle = '#ffe080';
      ctx.fillRect(px + 10, py + 8, 1, 1);
      // Welcome mat
      ctx.fillStyle = '#996644';
      ctx.fillRect(px + 2, py + 15, 12, 1);
      break;
    }
    case T.ROOF_C: {
      ctx.fillStyle = '#00b8c0';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#009da5';
      ctx.fillRect(px, py + S - 3, S, 3);
      // Tile pattern
      ctx.fillStyle = '#00d0d8';
      ctx.fillRect(px + 2, py + 2, 4, 2);
      ctx.fillRect(px + 10, py + 5, 4, 2);
      ctx.fillStyle = '#00a8b0';
      ctx.fillRect(px + 7, py + 1, 3, 2);
      break;
    }
    case T.ROOF_R: {
      ctx.fillStyle = '#cc3040';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#b02838';
      ctx.fillRect(px, py + S - 3, S, 3);
      ctx.fillStyle = '#dd4050';
      ctx.fillRect(px + 2, py + 2, 4, 2);
      ctx.fillRect(px + 10, py + 5, 4, 2);
      ctx.fillStyle = '#aa2030';
      ctx.fillRect(px + 7, py + 1, 3, 2);
      break;
    }
    case T.ROOF_Y: {
      ctx.fillStyle = '#ccaa30';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#b09428';
      ctx.fillRect(px, py + S - 3, S, 3);
      ctx.fillStyle = '#ddbb40';
      ctx.fillRect(px + 2, py + 2, 4, 2);
      ctx.fillRect(px + 10, py + 5, 4, 2);
      ctx.fillStyle = '#aa8820';
      ctx.fillRect(px + 7, py + 1, 3, 2);
      break;
    }
    case T.ROOF_P: {
      ctx.fillStyle = '#7744aa';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#663898';
      ctx.fillRect(px, py + S - 3, S, 3);
      ctx.fillStyle = '#8855bb';
      ctx.fillRect(px + 2, py + 2, 4, 2);
      ctx.fillRect(px + 10, py + 5, 4, 2);
      ctx.fillStyle = '#5e2e90';
      ctx.fillRect(px + 7, py + 1, 3, 2);
      break;
    }
    case T.FLOWER_R: {
      // Grass base
      ctx.fillStyle = '#5a9e4f';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#4e9045';
      ctx.fillRect(px + 11, py + 3, 1, 2);
      // Stem with sway
      const fSway = Math.sin(t / 800 + x * 2) * 0.8;
      ctx.fillStyle = '#3a7030';
      ctx.fillRect(px + 7 + Math.round(fSway), py + 7, 2, 6);
      // Petals
      ctx.fillStyle = '#ee3344';
      ctx.fillRect(px + 5, py + 4, 2, 3);
      ctx.fillRect(px + 9, py + 4, 2, 3);
      ctx.fillRect(px + 6, py + 3, 4, 2);
      ctx.fillRect(px + 6, py + 7, 4, 2);
      // Center
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(px + 7, py + 5, 2, 2);
      // Petal highlight
      ctx.fillStyle = '#ff6677';
      ctx.fillRect(px + 6, py + 4, 1, 1);
      break;
    }
    case T.FLOWER_Y: {
      ctx.fillStyle = '#5a9e4f';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#4e9045';
      ctx.fillRect(px + 3, py + 8, 1, 2);
      const fSway2 = Math.sin(t / 900 + x * 1.5) * 0.8;
      ctx.fillStyle = '#3a7030';
      ctx.fillRect(px + 7 + Math.round(fSway2), py + 7, 2, 6);
      ctx.fillStyle = '#eebb22';
      ctx.fillRect(px + 5, py + 4, 2, 3);
      ctx.fillRect(px + 9, py + 4, 2, 3);
      ctx.fillRect(px + 6, py + 3, 4, 2);
      ctx.fillRect(px + 6, py + 7, 4, 2);
      ctx.fillStyle = '#ff8800';
      ctx.fillRect(px + 7, py + 5, 2, 2);
      ctx.fillStyle = '#ffdd55';
      ctx.fillRect(px + 6, py + 4, 1, 1);
      break;
    }
    case T.FLOOR: {
      // Wooden floor with plank pattern
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px, py, S, S);
      ctx.fillStyle = '#7d6340';
      ctx.fillRect(px, py + 5, S, 1);
      ctx.fillRect(px, py + 11, S, 1);
      // Plank grain
      const fs = (x * 5 + y * 11) % 9;
      ctx.fillStyle = '#977a52';
      ctx.fillRect(px + (fs % 7) + 2, py + 2, 3, 1);
      ctx.fillRect(px + ((fs * 3) % 10) + 1, py + 8, 2, 1);
      ctx.fillStyle = '#826a42';
      ctx.fillRect(px + ((fs * 2) % 8) + 3, py + 13, 2, 1);
      break;
    }
    case T.EXIT: {
      // Exit door mat - visible return point
      ctx.fillStyle = '#8b6f47';
      ctx.fillRect(px, py, S, S);
      // Red carpet / mat
      ctx.fillStyle = '#994444';
      ctx.fillRect(px + 1, py + 1, 14, 14);
      ctx.fillStyle = '#aa5555';
      ctx.fillRect(px + 2, py + 2, 12, 12);
      // Arrow pointing down (exit indicator)
      ctx.fillStyle = '#ddccaa';
      ctx.fillRect(px + 7, py + 3, 2, 7);
      ctx.fillRect(px + 5, py + 7, 6, 2);
      ctx.fillRect(px + 6, py + 9, 4, 2);
      ctx.fillRect(px + 7, py + 11, 2, 1);
      break;
    }
  }
}

// ============================================
// INTERIOR OBJECT DRAWING
// ============================================
function drawInteriorObject(ctx, x, y, type, time) {
  const px = x * S, py = y * S;
  const t = time || Date.now();

  switch (type) {
    case 'desk': {
      // Wooden desk
      ctx.fillStyle = '#6b4025';
      ctx.fillRect(px + 1, py + 6, 14, 8);
      ctx.fillStyle = '#8b5e3c';
      ctx.fillRect(px + 1, py + 5, 14, 3);
      // Desk surface highlight
      ctx.fillStyle = '#9a6d4a';
      ctx.fillRect(px + 2, py + 5, 12, 1);
      // Legs
      ctx.fillStyle = '#5a3520';
      ctx.fillRect(px + 2, py + 13, 2, 3);
      ctx.fillRect(px + 12, py + 13, 2, 3);
      // Papers on desk
      ctx.fillStyle = '#eee8d5';
      ctx.fillRect(px + 3, py + 3, 5, 3);
      ctx.fillStyle = '#ddd8c5';
      ctx.fillRect(px + 5, py + 2, 4, 4);
      // Pen
      ctx.fillStyle = '#2244aa';
      ctx.fillRect(px + 10, py + 4, 1, 3);
      break;
    }
    case 'computer': {
      // Desk base
      ctx.fillStyle = '#6b4025';
      ctx.fillRect(px + 1, py + 8, 14, 6);
      ctx.fillStyle = '#8b5e3c';
      ctx.fillRect(px + 1, py + 7, 14, 3);
      // Legs
      ctx.fillStyle = '#5a3520';
      ctx.fillRect(px + 2, py + 13, 2, 3);
      ctx.fillRect(px + 12, py + 13, 2, 3);
      // Monitor
      ctx.fillStyle = '#333340';
      ctx.fillRect(px + 3, py + 1, 10, 7);
      // Screen
      const screenGlow = Math.sin(t / 2000) * 0.1 + 0.9;
      ctx.fillStyle = `rgba(60,180,220,${screenGlow})`;
      ctx.fillRect(px + 4, py + 2, 8, 5);
      // Screen content lines
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(px + 5, py + 3, 5, 1);
      ctx.fillRect(px + 5, py + 5, 3, 1);
      // Monitor stand
      ctx.fillStyle = '#333340';
      ctx.fillRect(px + 7, py + 7, 2, 2);
      ctx.fillRect(px + 5, py + 8, 6, 1);
      // Keyboard
      ctx.fillStyle = '#444450';
      ctx.fillRect(px + 4, py + 9, 8, 2);
      ctx.fillStyle = '#555560';
      ctx.fillRect(px + 5, py + 9, 6, 1);
      break;
    }
    case 'shelf': {
      // Bookshelf
      ctx.fillStyle = '#5a3520';
      ctx.fillRect(px + 1, py + 0, 14, 16);
      // Shelf boards
      ctx.fillStyle = '#6b4025';
      ctx.fillRect(px + 1, py + 5, 14, 1);
      ctx.fillRect(px + 1, py + 10, 14, 1);
      // Books - top shelf
      ctx.fillStyle = '#cc3344';
      ctx.fillRect(px + 2, py + 1, 2, 4);
      ctx.fillStyle = '#3366cc';
      ctx.fillRect(px + 4, py + 2, 2, 3);
      ctx.fillStyle = '#44aa44';
      ctx.fillRect(px + 7, py + 1, 3, 4);
      ctx.fillStyle = '#cc8833';
      ctx.fillRect(px + 11, py + 2, 2, 3);
      // Books - middle shelf
      ctx.fillStyle = '#884488';
      ctx.fillRect(px + 2, py + 6, 3, 4);
      ctx.fillStyle = '#cc6633';
      ctx.fillRect(px + 6, py + 7, 2, 3);
      ctx.fillStyle = '#3388aa';
      ctx.fillRect(px + 9, py + 6, 2, 4);
      ctx.fillStyle = '#aa3333';
      ctx.fillRect(px + 12, py + 7, 2, 3);
      // Books - bottom shelf
      ctx.fillStyle = '#5577aa';
      ctx.fillRect(px + 2, py + 11, 4, 4);
      ctx.fillStyle = '#778833';
      ctx.fillRect(px + 7, py + 12, 3, 3);
      ctx.fillStyle = '#993366';
      ctx.fillRect(px + 11, py + 11, 2, 4);
      break;
    }
    case 'board': {
      // Whiteboard / bulletin board
      ctx.fillStyle = '#888890';
      ctx.fillRect(px + 1, py + 1, 14, 12);
      // White surface
      ctx.fillStyle = '#e8e8e0';
      ctx.fillRect(px + 2, py + 2, 12, 10);
      // Content (colored markers / pins)
      ctx.fillStyle = '#cc3344';
      ctx.fillRect(px + 3, py + 3, 5, 1);
      ctx.fillStyle = '#3366cc';
      ctx.fillRect(px + 3, py + 5, 7, 1);
      ctx.fillStyle = '#44aa44';
      ctx.fillRect(px + 3, py + 7, 4, 1);
      ctx.fillStyle = '#cc8833';
      ctx.fillRect(px + 9, py + 4, 3, 3);
      // Tray
      ctx.fillStyle = '#666670';
      ctx.fillRect(px + 2, py + 13, 12, 2);
      // Markers in tray
      ctx.fillStyle = '#cc3344';
      ctx.fillRect(px + 4, py + 13, 1, 2);
      ctx.fillStyle = '#3366cc';
      ctx.fillRect(px + 6, py + 13, 1, 2);
      ctx.fillStyle = '#44aa44';
      ctx.fillRect(px + 8, py + 13, 1, 2);
      break;
    }
    case 'workbench': {
      // Heavy work table
      ctx.fillStyle = '#555560';
      ctx.fillRect(px + 0, py + 6, 16, 8);
      ctx.fillStyle = '#666670';
      ctx.fillRect(px + 0, py + 5, 16, 3);
      // Metal legs
      ctx.fillStyle = '#444450';
      ctx.fillRect(px + 1, py + 13, 2, 3);
      ctx.fillRect(px + 13, py + 13, 2, 3);
      // Tools on bench
      ctx.fillStyle = '#cc8833';
      ctx.fillRect(px + 2, py + 3, 2, 4); // wrench
      ctx.fillStyle = '#aaaaaa';
      ctx.fillRect(px + 2, py + 2, 2, 2);
      // Circuit board
      ctx.fillStyle = '#226633';
      ctx.fillRect(px + 6, py + 3, 5, 3);
      ctx.fillStyle = '#44cc44';
      ctx.fillRect(px + 7, py + 4, 1, 1);
      ctx.fillRect(px + 9, py + 4, 1, 1);
      // Soldering iron
      ctx.fillStyle = '#888888';
      ctx.fillRect(px + 13, py + 2, 1, 5);
      ctx.fillStyle = '#ff6633';
      ctx.fillRect(px + 13, py + 2, 1, 1);
      break;
    }
    case 'trophy': {
      // Trophy display case
      ctx.fillStyle = '#5a3520';
      ctx.fillRect(px + 1, py + 0, 14, 16);
      // Glass front
      ctx.fillStyle = 'rgba(180,220,255,0.3)';
      ctx.fillRect(px + 2, py + 1, 12, 14);
      // Shelf
      ctx.fillStyle = '#6b4025';
      ctx.fillRect(px + 2, py + 8, 12, 1);
      // Trophy top
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(px + 6, py + 2, 4, 2);
      ctx.fillRect(px + 5, py + 2, 1, 1);
      ctx.fillRect(px + 10, py + 2, 1, 1);
      ctx.fillRect(px + 7, py + 4, 2, 1);
      ctx.fillRect(px + 6, py + 5, 4, 1);
      ctx.fillRect(px + 7, py + 6, 2, 2);
      // Trophy shine
      ctx.fillStyle = '#ffee88';
      ctx.fillRect(px + 6, py + 2, 1, 1);
      // Medal bottom shelf
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(px + 4, py + 10, 3, 3);
      ctx.fillStyle = '#cc4444';
      ctx.fillRect(px + 9, py + 10, 3, 3);
      // Ribbon
      ctx.fillStyle = '#cc3344';
      ctx.fillRect(px + 5, py + 9, 1, 2);
      ctx.fillStyle = '#3366cc';
      ctx.fillRect(px + 10, py + 9, 1, 2);
      break;
    }
    case 'cabinet': {
      // File cabinet
      ctx.fillStyle = '#707080';
      ctx.fillRect(px + 2, py + 0, 12, 16);
      ctx.fillStyle = '#606070';
      ctx.fillRect(px + 2, py + 5, 12, 1);
      ctx.fillRect(px + 2, py + 10, 12, 1);
      // Drawer handles
      ctx.fillStyle = '#aaaaaa';
      ctx.fillRect(px + 7, py + 2, 3, 1);
      ctx.fillRect(px + 7, py + 7, 3, 1);
      ctx.fillRect(px + 7, py + 12, 3, 1);
      // Label slots
      ctx.fillStyle = '#e8e8e0';
      ctx.fillRect(px + 5, py + 3, 4, 1);
      ctx.fillRect(px + 5, py + 8, 4, 1);
      ctx.fillRect(px + 5, py + 13, 4, 1);
      // Highlight edge
      ctx.fillStyle = '#808090';
      ctx.fillRect(px + 2, py + 0, 1, 16);
      break;
    }
  }
}

// ============================================
// MARIO-STYLE ITEM DRAWING
// ============================================
function drawItem(ctx, px, py, style, time, color) {
  const t = time || Date.now();
  const bob = Math.sin(t / 400) * 2;
  const y = py + bob;

  switch (style) {
    case 'star': {
      // Mario-style super star
      ctx.fillStyle = '#ffd700';
      // Star body (5-pointed via pixels)
      ctx.fillRect(px + 6, y + 1, 4, 2);
      ctx.fillRect(px + 5, y + 3, 6, 2);
      ctx.fillRect(px + 3, y + 5, 10, 3);
      ctx.fillRect(px + 2, y + 6, 12, 2);
      ctx.fillRect(px + 3, y + 8, 3, 3);
      ctx.fillRect(px + 10, y + 8, 3, 3);
      ctx.fillRect(px + 5, y + 10, 2, 2);
      ctx.fillRect(px + 9, y + 10, 2, 2);
      // Eyes
      ctx.fillStyle = '#111';
      ctx.fillRect(px + 6, y + 5, 1, 2);
      ctx.fillRect(px + 9, y + 5, 1, 2);
      // Shine
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 5, y + 3, 2, 1);
      ctx.fillRect(px + 4, y + 5, 1, 1);
      break;
    }
    case 'mushroom': {
      // Super mushroom style
      const mc = color === '#2288dd' ? '#2288dd' : '#ee2222';
      // Cap
      ctx.fillStyle = mc;
      ctx.fillRect(px + 3, y + 2, 10, 5);
      ctx.fillRect(px + 2, y + 3, 12, 3);
      // Cap spots
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 4, y + 3, 3, 2);
      ctx.fillRect(px + 9, y + 3, 3, 2);
      ctx.fillRect(px + 7, y + 2, 2, 2);
      // Face
      ctx.fillStyle = '#f5deb3';
      ctx.fillRect(px + 4, y + 7, 8, 4);
      ctx.fillRect(px + 3, y + 8, 10, 2);
      // Eyes
      ctx.fillStyle = '#111';
      ctx.fillRect(px + 5, y + 8, 2, 2);
      ctx.fillRect(px + 9, y + 8, 2, 2);
      // Feet
      ctx.fillStyle = mc;
      ctx.fillRect(px + 3, y + 11, 3, 2);
      ctx.fillRect(px + 10, y + 11, 3, 2);
      break;
    }
    case 'coin': {
      // Spinning coin effect
      const spin = Math.abs(Math.sin(t / 300));
      const w = Math.max(2, Math.round(spin * 10));
      const cx = px + 8 - Math.floor(w / 2);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(cx, y + 2, w, 12);
      ctx.fillStyle = '#ffee55';
      ctx.fillRect(cx + 1, y + 3, Math.max(1, w - 2), 10);
      // Line detail
      if (w > 4) {
        ctx.fillStyle = '#cc9900';
        ctx.fillRect(cx + Math.floor(w / 2), y + 4, 1, 8);
      }
      // Shine
      ctx.fillStyle = '#fff';
      if (w > 3) ctx.fillRect(cx + 1, y + 3, 1, 1);
      break;
    }
    case 'fire': {
      // Fire flower
      ctx.fillStyle = '#22aa22';
      ctx.fillRect(px + 7, y + 9, 2, 4);
      // Leaves
      ctx.fillRect(px + 5, y + 10, 3, 2);
      ctx.fillRect(px + 9, y + 11, 2, 1);
      // Flower head
      ctx.fillStyle = '#ff4422';
      ctx.fillRect(px + 5, y + 3, 6, 5);
      ctx.fillRect(px + 4, y + 4, 8, 3);
      // Petals
      ctx.fillStyle = '#ff8844';
      ctx.fillRect(px + 5, y + 2, 2, 2);
      ctx.fillRect(px + 9, y + 2, 2, 2);
      ctx.fillRect(px + 4, y + 5, 2, 2);
      ctx.fillRect(px + 10, y + 5, 2, 2);
      // Center
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 7, y + 4, 2, 3);
      ctx.fillStyle = '#ffdd00';
      ctx.fillRect(px + 7, y + 5, 2, 1);
      // Eyes
      ctx.fillStyle = '#111';
      ctx.fillRect(px + 6, y + 5, 1, 1);
      ctx.fillRect(px + 9, y + 5, 1, 1);
      break;
    }
    case 'crystal': {
      // Power crystal / diamond
      const cc = color || '#00ccdd';
      ctx.fillStyle = cc;
      ctx.fillRect(px + 6, y + 1, 4, 2);
      ctx.fillRect(px + 5, y + 3, 6, 2);
      ctx.fillRect(px + 4, y + 5, 8, 2);
      ctx.fillRect(px + 3, y + 7, 10, 2);
      ctx.fillRect(px + 4, y + 9, 8, 2);
      ctx.fillRect(px + 5, y + 11, 6, 2);
      ctx.fillRect(px + 6, y + 13, 4, 1);
      // Shine
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillRect(px + 5, y + 3, 2, 3);
      ctx.fillRect(px + 4, y + 6, 1, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(px + 7, y + 2, 1, 2);
      break;
    }
    case 'trophy': {
      // Gold trophy cup
      ctx.fillStyle = '#ffd700';
      // Cup
      ctx.fillRect(px + 4, y + 2, 8, 5);
      ctx.fillRect(px + 3, y + 3, 10, 3);
      // Handles
      ctx.fillRect(px + 2, y + 3, 2, 3);
      ctx.fillRect(px + 12, y + 3, 2, 3);
      // Stem
      ctx.fillRect(px + 7, y + 7, 2, 3);
      // Base
      ctx.fillRect(px + 5, y + 10, 6, 2);
      ctx.fillRect(px + 4, y + 12, 8, 2);
      // Shine
      ctx.fillStyle = '#ffee88';
      ctx.fillRect(px + 5, y + 3, 2, 2);
      ctx.fillRect(px + 3, y + 4, 1, 1);
      // Star on cup
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 7, y + 4, 2, 1);
      ctx.fillRect(px + 8, y + 3, 1, 3);
      break;
    }
  }
}

// ============================================
// COMPANION CREATURE DRAWING (Pikachu-like)
// ============================================
function drawCompanion(ctx, px, py, dir, frame, time) {
  const t = time || Date.now();
  const breathe = Math.round(Math.sin(t / 800 * Math.PI * 2) * 0.5);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(px + 2, py + 13, 10, 2);

  // Tail
  ctx.fillStyle = '#cc8800';
  if (dir === 'left') {
    ctx.fillRect(px + 11, py + 5, 2, 2);
    ctx.fillRect(px + 12, py + 3, 2, 3);
    ctx.fillRect(px + 13, py + 1, 2, 3);
  } else if (dir === 'right') {
    ctx.fillRect(px + 1, py + 5, 2, 2);
    ctx.fillRect(px + 0, py + 3, 2, 3);
    ctx.fillRect(px - 1, py + 1, 2, 3);
  } else {
    ctx.fillRect(px + 10, py + 4, 2, 2);
    ctx.fillRect(px + 11, py + 2, 2, 3);
    ctx.fillRect(px + 12, py + 0, 2, 3);
  }
  // Tail tip
  ctx.fillStyle = '#aa6600';
  if (dir === 'left') ctx.fillRect(px + 13, py + 1, 2, 1);
  else if (dir === 'right') ctx.fillRect(px - 1, py + 1, 2, 1);
  else ctx.fillRect(px + 12, py + 0, 2, 1);

  // Body
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(px + 3, py + 6 + breathe, 8, 6);
  ctx.fillRect(px + 4, py + 5 + breathe, 6, 8);

  // Feet
  const legOff = frame % 2 === 1 ? 1 : 0;
  ctx.fillStyle = '#ddbb33';
  ctx.fillRect(px + 3 + legOff, py + 12, 3, 2);
  ctx.fillRect(px + 8 - legOff, py + 12, 3, 2);

  // Head
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(px + 3, py + 1, 8, 6);
  ctx.fillRect(px + 2, py + 2, 10, 4);

  // Ears
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(px + 2, py - 2, 2, 4);
  ctx.fillRect(px + 10, py - 2, 2, 4);
  // Ear tips
  ctx.fillStyle = '#222';
  ctx.fillRect(px + 2, py - 2, 2, 1);
  ctx.fillRect(px + 10, py - 2, 2, 1);

  // Face (front/side)
  if (dir === 'down' || dir === 'up') {
    // Eyes
    ctx.fillStyle = '#111';
    ctx.fillRect(px + 4, py + 3, 2, 2);
    ctx.fillRect(px + 8, py + 3, 2, 2);
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + 4, py + 3, 1, 1);
    ctx.fillRect(px + 8, py + 3, 1, 1);
    // Cheeks
    ctx.fillStyle = '#ff5544';
    ctx.fillRect(px + 2, py + 4, 2, 2);
    ctx.fillRect(px + 10, py + 4, 2, 2);
    // Nose
    ctx.fillStyle = '#222';
    ctx.fillRect(px + 7, py + 4, 1, 1);
    // Mouth
    if (dir === 'down') {
      ctx.fillStyle = '#cc8800';
      ctx.fillRect(px + 6, py + 5, 3, 1);
    }
  } else {
    // Side view
    const flip = dir === 'right' ? 1 : 0;
    ctx.fillStyle = '#111';
    ctx.fillRect(px + (flip ? 8 : 4), py + 3, 2, 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + (flip ? 8 : 4), py + 3, 1, 1);
    ctx.fillStyle = '#ff5544';
    ctx.fillRect(px + (flip ? 10 : 2), py + 4, 2, 2);
    ctx.fillStyle = '#222';
    ctx.fillRect(px + (flip ? 9 : 5), py + 4, 1, 1);
  }

  // Brown back stripes
  ctx.fillStyle = '#cc8800';
  ctx.fillRect(px + 5, py + 7 + breathe, 4, 1);
  ctx.fillRect(px + 4, py + 9 + breathe, 2, 1);
  ctx.fillRect(px + 8, py + 9 + breathe, 2, 1);
}

// ============================================
// CHARACTER DRAWING (much improved)
// ============================================
function drawChar(ctx, px, py, hairCol, bodyCol, dir, frame, skinCol, acc, breathe) {
  const sk = skinCol || '#ffcc99';
  const b = breathe || 0; // 0-1 breathing phase
  const breatheOff = Math.round(Math.sin(b * Math.PI * 2) * 0.5);

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(px + 2, py + 14, 12, 2);

  if (dir === 'up') {
    // === BACK VIEW ===
    // Legs (walk animation: 4 frames)
    ctx.fillStyle = '#2a2a50';
    const legOff = [0, 1, 0, -1][frame % 4];
    ctx.fillRect(px + 4 + legOff, py + 12, 3, 4);
    ctx.fillRect(px + 9 - legOff, py + 12, 3, 4);
    // Shoes
    ctx.fillStyle = '#1a1a35';
    ctx.fillRect(px + 4 + legOff, py + 14, 3, 2);
    ctx.fillRect(px + 9 - legOff, py + 14, 3, 2);
    // Body
    ctx.fillStyle = bodyCol;
    ctx.fillRect(px + 3, py + 7 + breatheOff, 10, 6);
    // Arms
    ctx.fillStyle = bodyCol;
    const armSwing = [0, -1, 0, 1][frame % 4];
    ctx.fillRect(px + 1, py + 7 + breatheOff + armSwing, 3, 5);
    ctx.fillRect(px + 12, py + 7 + breatheOff - armSwing, 3, 5);
    // Hands
    ctx.fillStyle = sk;
    ctx.fillRect(px + 1, py + 11 + breatheOff + armSwing, 3, 2);
    ctx.fillRect(px + 12, py + 11 + breatheOff - armSwing, 3, 2);
    // Neck
    ctx.fillStyle = sk;
    ctx.fillRect(px + 6, py + 5, 4, 3);
    // Head
    ctx.fillStyle = sk;
    ctx.fillRect(px + 4, py + 1, 8, 6);
    // Hair (covers most of back of head)
    ctx.fillStyle = hairCol;
    ctx.fillRect(px + 3, py + 0, 10, 5);
    ctx.fillRect(px + 4, py + 5, 8, 2);
  } else if (dir === 'left' || dir === 'right') {
    // === SIDE VIEW ===
    const flip = dir === 'left' ? 0 : 1;
    // Legs
    ctx.fillStyle = '#2a2a50';
    const sLegOff = [0, 1, 0, -1][frame % 4];
    if (dir === 'left') {
      ctx.fillRect(px + 5 + sLegOff, py + 12, 3, 4);
      ctx.fillRect(px + 8 - sLegOff, py + 12, 3, 4);
    } else {
      ctx.fillRect(px + 5 + sLegOff, py + 12, 3, 4);
      ctx.fillRect(px + 8 - sLegOff, py + 12, 3, 4);
    }
    // Shoes
    ctx.fillStyle = '#1a1a35';
    ctx.fillRect(px + 5 + sLegOff, py + 14, 3, 2);
    ctx.fillRect(px + 8 - sLegOff, py + 14, 3, 2);
    // Body
    ctx.fillStyle = bodyCol;
    ctx.fillRect(px + 4, py + 7 + breatheOff, 8, 6);
    // Back arm
    const aSwing = [0, -1, 0, 1][frame % 4];
    ctx.fillStyle = bodyCol;
    if (dir === 'left') {
      ctx.fillRect(px + 10, py + 7 + breatheOff - aSwing, 3, 5);
      ctx.fillStyle = sk;
      ctx.fillRect(px + 10, py + 11 + breatheOff - aSwing, 3, 2);
    } else {
      ctx.fillRect(px + 3, py + 7 + breatheOff - aSwing, 3, 5);
      ctx.fillStyle = sk;
      ctx.fillRect(px + 3, py + 11 + breatheOff - aSwing, 3, 2);
    }
    // Neck
    ctx.fillStyle = sk;
    ctx.fillRect(px + 6, py + 5, 4, 3);
    // Head
    ctx.fillStyle = sk;
    ctx.fillRect(px + 4, py + 1, 8, 6);
    // Hair
    ctx.fillStyle = hairCol;
    ctx.fillRect(px + 3, py + 0, 10, 3);
    if (dir === 'left') {
      ctx.fillRect(px + 9, py + 3, 4, 3);
    } else {
      ctx.fillRect(px + 3, py + 3, 4, 3);
    }
    // Eye
    ctx.fillStyle = '#fff';
    if (dir === 'left') {
      ctx.fillRect(px + 4, py + 3, 3, 2);
      ctx.fillStyle = '#111';
      ctx.fillRect(px + 4, py + 3, 2, 2);
    } else {
      ctx.fillRect(px + 9, py + 3, 3, 2);
      ctx.fillStyle = '#111';
      ctx.fillRect(px + 10, py + 3, 2, 2);
    }
    // Front arm
    ctx.fillStyle = bodyCol;
    if (dir === 'left') {
      ctx.fillRect(px + 2, py + 7 + breatheOff + aSwing, 3, 5);
      ctx.fillStyle = sk;
      ctx.fillRect(px + 2, py + 11 + breatheOff + aSwing, 3, 2);
    } else {
      ctx.fillRect(px + 11, py + 7 + breatheOff + aSwing, 3, 5);
      ctx.fillStyle = sk;
      ctx.fillRect(px + 11, py + 11 + breatheOff + aSwing, 3, 2);
    }
    // Accessories
    if (acc === 'glasses' && dir === 'left') {
      ctx.fillStyle = '#aaddff';
      ctx.fillRect(px + 3, py + 3, 4, 2);
      ctx.fillStyle = '#8899aa';
      ctx.fillRect(px + 3, py + 3, 1, 2);
      ctx.fillRect(px + 6, py + 3, 1, 2);
    } else if (acc === 'glasses' && dir === 'right') {
      ctx.fillStyle = '#aaddff';
      ctx.fillRect(px + 9, py + 3, 4, 2);
      ctx.fillStyle = '#8899aa';
      ctx.fillRect(px + 9, py + 3, 1, 2);
      ctx.fillRect(px + 12, py + 3, 1, 2);
    }
  } else {
    // === FRONT VIEW (down) ===
    // Legs
    ctx.fillStyle = '#2a2a50';
    const fLegOff = [0, 1, 0, -1][frame % 4];
    ctx.fillRect(px + 4 + fLegOff, py + 12, 3, 4);
    ctx.fillRect(px + 9 - fLegOff, py + 12, 3, 4);
    // Shoes
    ctx.fillStyle = '#1a1a35';
    ctx.fillRect(px + 4 + fLegOff, py + 14, 3, 2);
    ctx.fillRect(px + 9 - fLegOff, py + 14, 3, 2);
    // Body
    ctx.fillStyle = bodyCol;
    ctx.fillRect(px + 3, py + 7 + breatheOff, 10, 6);
    // Shirt detail / stripe
    const bodyLight = bodyCol.replace(/[0-9a-f]{2}$/i, m => {
      const v = Math.min(255, parseInt(m, 16) + 30);
      return v.toString(16).padStart(2, '0');
    });
    ctx.fillStyle = bodyLight;
    ctx.fillRect(px + 6, py + 8 + breatheOff, 4, 1);
    // Arms
    const armOff = [0, -1, 0, 1][frame % 4];
    ctx.fillStyle = bodyCol;
    ctx.fillRect(px + 1, py + 7 + breatheOff + armOff, 3, 5);
    ctx.fillRect(px + 12, py + 7 + breatheOff - armOff, 3, 5);
    // Hands
    ctx.fillStyle = sk;
    ctx.fillRect(px + 1, py + 11 + breatheOff + armOff, 3, 2);
    ctx.fillRect(px + 12, py + 11 + breatheOff - armOff, 3, 2);
    // Neck
    ctx.fillStyle = sk;
    ctx.fillRect(px + 6, py + 5, 4, 3);
    // Head
    ctx.fillStyle = sk;
    ctx.fillRect(px + 4, py + 1, 8, 6);
    // Hair
    ctx.fillStyle = hairCol;
    ctx.fillRect(px + 3, py + 0, 10, 3);
    ctx.fillRect(px + 3, py + 1, 2, 3);
    ctx.fillRect(px + 11, py + 1, 2, 3);
    // Eyes (white + pupil)
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + 5, py + 3, 3, 2);
    ctx.fillRect(px + 9, py + 3, 3, 2);
    ctx.fillStyle = '#111';
    ctx.fillRect(px + 6, py + 3, 2, 2);
    ctx.fillRect(px + 10, py + 3, 2, 2);
    // Eye shine
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + 6, py + 3, 1, 1);
    ctx.fillRect(px + 10, py + 3, 1, 1);
    // Mouth
    ctx.fillStyle = '#cc8877';
    ctx.fillRect(px + 7, py + 6, 2, 1);
    // Accessories
    if (acc === 'glasses') {
      ctx.fillStyle = '#8899aa';
      ctx.fillRect(px + 4, py + 3, 1, 2);
      ctx.fillRect(px + 8, py + 3, 1, 1);
      ctx.fillRect(px + 12, py + 3, 1, 2);
      ctx.fillStyle = 'rgba(170,221,255,0.4)';
      ctx.fillRect(px + 5, py + 3, 3, 2);
      ctx.fillRect(px + 9, py + 3, 3, 2);
    }
    if (acc === 'hat') {
      ctx.fillStyle = hairCol;
      ctx.fillRect(px + 2, py - 1, 12, 3);
      ctx.fillRect(px + 4, py - 3, 8, 3);
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 5, py - 1, 6, 1);
    }
    if (acc === 'badge') {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(px + 5, py + 8 + breatheOff, 2, 2);
      ctx.fillStyle = '#ffee88';
      ctx.fillRect(px + 5, py + 8 + breatheOff, 1, 1);
    }
    if (acc === 'book') {
      ctx.fillStyle = '#cc4444';
      ctx.fillRect(px + 12, py + 9 + breatheOff, 3, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(px + 13, py + 10 + breatheOff, 1, 2);
    }
  }
}

// ============================================
// GAME CLASS
// ============================================
class PortfolioRPG {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.keys = {};
    this.keyJustPressed = {};
    this.player = { x: 14, y: 9, dir: 'down', moving: false, targetX: 14, targetY: 9, progress: 0, frame: 0 };
    this.collected = new Set();
    this.discovered = new Set();
    this.dialogActive = false;
    this.dialogPages = [];
    this.dialogIndex = 0;
    this.dialogLink = null;       // URL to open on confirm
    this.dialogConfirm = false;   // showing yes/no prompt
    this.dialogConfirmChoice = 0; // 0 = YES, 1 = NO
    this.inventoryOpen = false;
    this.pickupTimer = 0;
    this.pickupText = '';
    this.started = false;
    this.completed = false;
    this.lastTime = 0;
    this.moveTimer = 0;
    this.gameTime = 0;
    this.particles = new Particles();
    this.dustTimer = 0;
    this.fireflyTimer = 0;

    // Companion (Pikachu-like follower)
    this.companion = { x: 13, y: 9, dir: 'down', frame: 0, prevX: 13, prevY: 9, lerp: 1 };
    this.posHistory = []; // trail of player positions for companion to follow

    // Room/interior state
    this.currentMap = 'overworld';
    this.overworldPos = null; // saved player position when entering building

    // Pre-render map
    this.mapCanvas = document.createElement('canvas');
    this.mapCanvas.width = COLS * S;
    this.mapCanvas.height = ROWS * S;

    // Interior pre-render canvas
    this.interiorCanvas = document.createElement('canvas');
    this.interiorCanvas.width = INTERIOR_COLS * S;
    this.interiorCanvas.height = INTERIOR_ROWS * S;

    // DOM refs
    this.hudEl = document.getElementById('hud');
    this.roomNameEl = document.getElementById('room-name');
    this.dialogEl = document.getElementById('dialog');
    this.dialogSpeaker = document.getElementById('dialog-speaker');
    this.dialogText = document.getElementById('dialog-text');
    this.dialogConfirmEl = document.getElementById('dialog-confirm');
    this.confirmYesEl = document.getElementById('confirm-yes');
    this.confirmNoEl = document.getElementById('confirm-no');
    this.pickupEl = document.getElementById('pickup');
    this.pickupTextEl = document.getElementById('pickup-text');
    this.inventoryEl = document.getElementById('inventory');
    this.invGrid = document.getElementById('inv-grid');
    this.invDesc = document.getElementById('inv-desc');
    this.welcomeEl = document.getElementById('welcome');
    this.completeEl = document.getElementById('complete');
    this.itemCountEl = document.getElementById('item-count');
    this.areaCountEl = document.getElementById('area-count');

    this.setupInput();
    this.buildInventoryUI();
  }

  setupInput() {
    window.addEventListener('keydown', e => {
      if (!this.keys[e.code]) this.keyJustPressed[e.code] = true;
      this.keys[e.code] = true;
      e.preventDefault();
    });
    window.addEventListener('keyup', e => {
      this.keys[e.code] = false;
    });

    // Welcome screen
    const startGame = () => {
      if (!this.started) {
        this.started = true;
        this.welcomeEl.classList.add('hidden');
        this.hudEl.classList.add('visible');
      }
    };
    this.welcomeEl.addEventListener('click', startGame);

    // On-screen D-pad controls (touch)
    const dpadBtns = document.querySelectorAll('.dpad-btn');
    const dirMap = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
    dpadBtns.forEach(btn => {
      const dir = btn.dataset.dir;
      const code = dirMap[dir];
      const press = (e) => {
        e.preventDefault();
        startGame();
        if (!this.keys[code]) this.keyJustPressed[code] = true;
        this.keys[code] = true;
        btn.classList.add('pressed');
      };
      const release = (e) => {
        e.preventDefault();
        this.keys[code] = false;
        btn.classList.remove('pressed');
      };
      btn.addEventListener('touchstart', press, { passive: false });
      btn.addEventListener('touchend', release, { passive: false });
      btn.addEventListener('touchcancel', release, { passive: false });
      btn.addEventListener('mousedown', press);
      btn.addEventListener('mouseup', release);
      btn.addEventListener('mouseleave', release);
    });

    // Action button (A = Space)
    const btnAction = document.getElementById('btn-action');
    btnAction.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startGame();
      this.keyJustPressed['Space'] = true;
      this.keys['Space'] = true;
      btnAction.classList.add('pressed');
    }, { passive: false });
    btnAction.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.keys['Space'] = false;
      btnAction.classList.remove('pressed');
    }, { passive: false });
    btnAction.addEventListener('mousedown', () => {
      startGame();
      this.keyJustPressed['Space'] = true;
      this.keys['Space'] = true;
    });
    btnAction.addEventListener('mouseup', () => { this.keys['Space'] = false; });

    // Inventory button (I)
    const btnInv = document.getElementById('btn-inv');
    btnInv.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startGame();
      this.keyJustPressed['KeyI'] = true;
      btnInv.classList.add('pressed');
    }, { passive: false });
    btnInv.addEventListener('touchend', (e) => {
      e.preventDefault();
      btnInv.classList.remove('pressed');
    }, { passive: false });
    btnInv.addEventListener('mousedown', () => {
      startGame();
      this.keyJustPressed['KeyI'] = true;
    });

    // Back button (exit building)
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
      const handleBack = (e) => {
        e.preventDefault();
        if (this.currentMap !== 'overworld') {
          this.exitBuilding();
        }
        if (this.inventoryOpen) {
          this.inventoryOpen = false;
          this.invEl.classList.add('hidden');
        }
      };
      btnBack.addEventListener('touchstart', (e) => {
        e.preventDefault();
        btnBack.classList.add('pressed');
      }, { passive: false });
      btnBack.addEventListener('touchend', (e) => {
        handleBack(e);
        btnBack.classList.remove('pressed');
      }, { passive: false });
      btnBack.addEventListener('click', handleBack);
    }

    // Store button refs for context updates
    this.btnActionEl = btnAction;
    this.btnBackEl = btnBack;

    // Tap dialog to advance (mobile-friendly)
    this.dialogEl.addEventListener('click', (e) => {
      // Don't advance if tapping confirm buttons
      if (e.target.closest('#dialog-confirm')) return;
      if (this.dialogConfirm) return;
      if (this.dialogActive) {
        this.advanceDialog();
      }
    });

    // Confirm dialog click/touch handlers
    const handleConfirmYes = (e) => {
      e.stopPropagation();
      if (this.dialogConfirm) {
        this.dialogConfirmChoice = 0;
        this.resolveConfirm();
      }
    };
    const handleConfirmNo = (e) => {
      e.stopPropagation();
      if (this.dialogConfirm) {
        this.dialogConfirmChoice = 1;
        this.resolveConfirm();
      }
    };
    this.confirmYesEl.addEventListener('click', handleConfirmYes);
    this.confirmNoEl.addEventListener('click', handleConfirmNo);
    this.confirmYesEl.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleConfirmYes(e);
    }, { passive: false });
    this.confirmNoEl.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleConfirmNo(e);
    }, { passive: false });
  }

  buildInventoryUI() {
    this.invGrid.innerHTML = '';
    ITEMS.forEach((item, i) => {
      const slot = document.createElement('div');
      slot.className = 'inv-slot' + (this.collected.has(i) ? ' collected' : ' empty');
      const styleIcons = { star: '\u2B50', mushroom: '\uD83C\uDF44', coin: '\uD83E\uDE99', fire: '\uD83D\uDD25', crystal: '\uD83D\uDC8E', trophy: '\uD83C\uDFC6' };
      slot.textContent = this.collected.has(i) ? (styleIcons[item.style] || '\u2B50') : '?';
      slot.addEventListener('click', () => {
        if (this.collected.has(i)) {
          this.invDesc.textContent = item.name + ': ' + item.desc;
          document.querySelectorAll('.inv-slot').forEach(s => s.classList.remove('selected'));
          slot.classList.add('selected');
        }
      });
      this.invGrid.appendChild(slot);
    });
  }

  renderMap() {
    const mctx = this.mapCanvas.getContext('2d');
    const t = Date.now();
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        drawTile(mctx, x, y, MAP[y][x], t);
      }
    }
  }

  renderInteriorMap() {
    const ictx = this.interiorCanvas.getContext('2d');
    const imap = INTERIOR_MAPS[this.currentMap];
    if (!imap) return;
    const t = Date.now();
    for (let y = 0; y < INTERIOR_ROWS; y++) {
      for (let x = 0; x < INTERIOR_COLS; x++) {
        drawTile(ictx, x, y, imap[y][x], t);
      }
    }
  }

  start() {
    this.renderMap();
    requestAnimationFrame(t => this.loop(t));
  }

  loop(time) {
    const dt = Math.min(time - this.lastTime, 50); // cap to prevent spiral
    this.lastTime = time;
    this.gameTime += dt;

    if (this.started && !this.completed) {
      this.update(dt);
    }
    this.render(time);
    this.keyJustPressed = {};
    requestAnimationFrame(t => this.loop(t));
  }

  update(dt) {
    if (!this.started) return;

    // Update particles
    this.particles.update(dt);

    // NPC idle animations (overworld only)
    if (this.currentMap === 'overworld') {
      for (const npc of NPCS) {
        npc.idleTimer += dt;
        if (npc.idleTimer > 2000 + Math.random() * 3000) {
          npc.idleTimer = 0;
          npc.idleCycle++;
          const dirs = ['down', 'left', 'right', 'down'];
          npc.idleDir = dirs[npc.idleCycle % dirs.length];
        }
        const dx = this.player.x - npc.x;
        const dy = this.player.y - npc.y;
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist <= 2) {
          if (Math.abs(dx) > Math.abs(dy)) {
            npc.idleDir = dx > 0 ? 'right' : 'left';
          } else {
            npc.idleDir = dy > 0 ? 'down' : 'up';
          }
        }
      }

      // Spawn ambient fireflies near grass
      this.fireflyTimer += dt;
      if (this.fireflyTimer > 800) {
        this.fireflyTimer = 0;
        if (Math.random() < 0.3) {
          const fx = (2 + Math.random() * 26) * S;
          const fy = (2 + Math.random() * 16) * S;
          this.particles.emit(fx, fy, 'firefly', 1);
        }
      }
    }

    // Dialog confirm left/right selection
    if (this.dialogConfirm) {
      if (this.keyJustPressed['ArrowLeft'] || this.keyJustPressed['KeyA']) {
        this.dialogConfirmChoice = 0; // YES
        this.updateConfirmUI();
      }
      if (this.keyJustPressed['ArrowRight'] || this.keyJustPressed['KeyD']) {
        this.dialogConfirmChoice = 1; // NO
        this.updateConfirmUI();
      }
    }

    // Space handling
    if (this.keyJustPressed['Space']) {
      if (this.completed) {
        this.restart();
        return;
      }
      if (this.dialogConfirm) {
        this.resolveConfirm();
        return;
      }
      if (this.dialogActive) {
        this.advanceDialog();
        return;
      }
      if (!this.inventoryOpen) {
        this.interact();
        return;
      }
    }

    // Inventory toggle
    if (this.keyJustPressed['KeyI']) {
      this.toggleInventory();
      return;
    }

    if (this.dialogActive || this.inventoryOpen) return;

    // Pickup timer
    if (this.pickupTimer > 0) {
      this.pickupTimer -= dt;
      if (this.pickupTimer <= 0) {
        this.pickupEl.classList.add('hidden');
      }
    }

    // Movement
    if (this.player.moving) {
      // Slower movement in water
      const targetTile = this.currentMap === 'overworld' ? (MAP[this.player.targetY] && MAP[this.player.targetY][this.player.targetX]) : null;
      const inWater = targetTile === T.WATER;
      const moveSpeed = inWater ? 240 : 150;
      this.player.progress += dt / moveSpeed;
      if (this.player.progress >= 1) {
        this.player.x = this.player.targetX;
        this.player.y = this.player.targetY;
        this.player.moving = false;
        this.player.progress = 0;
        this.player.frame++;
        // Splash when entering water
        if (inWater) {
          this.particles.emit(this.player.x * S + 8, this.player.y * S + 10, 'splash', 6);
        }
        // Update companion to follow (with smooth lerp)
        if (this.posHistory.length >= 2) {
          const followPos = this.posHistory[0];
          if (followPos.x !== this.companion.x || followPos.y !== this.companion.y) {
            this.companion.prevX = this.companion.x;
            this.companion.prevY = this.companion.y;
            this.companion.x = followPos.x;
            this.companion.y = followPos.y;
            this.companion.lerp = 0;
          }
          this.companion.dir = followPos.dir;
          this.companion.frame++;
        }
        // Check for exit tile in interior
        if (this.currentMap !== 'overworld') {
          const imap = INTERIOR_MAPS[this.currentMap];
          if (imap && imap[this.player.y] && imap[this.player.y][this.player.x] === T.EXIT) {
            this.exitBuilding();
            return;
          }
        }
        if (this.currentMap === 'overworld') {
          this.checkItemPickup();
        }
        // Immediately chain next move if key still held (no delay between tiles)
        let chained = false;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) { chained = this.tryMove(0, -1, 'up'); }
        else if (this.keys['ArrowDown'] || this.keys['KeyS']) { chained = this.tryMove(0, 1, 'down'); }
        else if (this.keys['ArrowLeft'] || this.keys['KeyA']) { chained = this.tryMove(-1, 0, 'left'); }
        else if (this.keys['ArrowRight'] || this.keys['KeyD']) { chained = this.tryMove(1, 0, 'right'); }
        if (chained) this.moveTimer = 0;
      }
      // Emit particles while moving
      this.dustTimer += dt;
      if (this.dustTimer > 100) {
        this.dustTimer = 0;
        if (this.currentMap === 'overworld') {
          const tile = MAP[this.player.targetY] && MAP[this.player.targetY][this.player.targetX];
          if (tile === T.PATH) {
            const ppx = (this.player.x + (this.player.targetX - this.player.x) * this.player.progress) * S + 8;
            const ppy = (this.player.y + (this.player.targetY - this.player.y) * this.player.progress) * S + 14;
            this.particles.emit(ppx, ppy, 'dust', 2);
          } else if (tile === T.WATER) {
            const ppx = (this.player.x + (this.player.targetX - this.player.x) * this.player.progress) * S + 8;
            const ppy = (this.player.y + (this.player.targetY - this.player.y) * this.player.progress) * S + 12;
            this.particles.emit(ppx, ppy, 'splash', 2);
          }
        }
      }
    } else {
      // Instant response — no delay before first step
      let moved = false;
      if (this.keys['ArrowUp'] || this.keys['KeyW']) { moved = this.tryMove(0, -1, 'up'); }
      else if (this.keys['ArrowDown'] || this.keys['KeyS']) { moved = this.tryMove(0, 1, 'down'); }
      else if (this.keys['ArrowLeft'] || this.keys['KeyA']) { moved = this.tryMove(-1, 0, 'left'); }
      else if (this.keys['ArrowRight'] || this.keys['KeyD']) { moved = this.tryMove(1, 0, 'right'); }
      if (moved) this.moveTimer = 0;
    }

    // Smooth companion lerp
    if (this.companion.lerp < 1) {
      this.companion.lerp = Math.min(1, this.companion.lerp + dt / 120);
    }
  }

  getCompanionScreenPos(offsetX, offsetY) {
    const c = this.companion;
    const t = c.lerp < 0.5 ? 4 * c.lerp * c.lerp * c.lerp : 1 - Math.pow(-2 * c.lerp + 2, 3) / 2;
    const cx = (c.prevX + (c.x - c.prevX) * t) * S + (offsetX || 0);
    const cy = (c.prevY + (c.y - c.prevY) * t) * S + (offsetY || 0);
    return [cx, cy];
  }

  tryMove(dx, dy, dir) {
    this.player.dir = dir;
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    if (this.isWalkable(nx, ny)) {
      // Record position for companion to follow
      this.posHistory.push({ x: this.player.x, y: this.player.y, dir: dir });
      if (this.posHistory.length > 3) this.posHistory.shift();

      this.player.targetX = nx;
      this.player.targetY = ny;
      this.player.moving = true;
      this.player.progress = 0;
      return true;
    }
    return false;
  }

  isWalkable(x, y) {
    if (this.currentMap === 'overworld') {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
      if (!WALKABLE.has(MAP[y][x])) return false;
      for (const npc of NPCS) {
        if (npc.x === x && npc.y === y) return false;
      }
      return true;
    } else {
      // Interior map
      const imap = INTERIOR_MAPS[this.currentMap];
      if (!imap) return false;
      if (x < 0 || x >= INTERIOR_COLS || y < 0 || y >= INTERIOR_ROWS) return false;
      const tile = imap[y][x];
      if (tile !== T.FLOOR && tile !== T.EXIT) return false;
      // Check interior objects block movement
      const objects = INTERIOR_OBJECTS[this.currentMap] || [];
      for (const obj of objects) {
        if (obj.x === x && obj.y === y) return false;
      }
      return true;
    }
  }

  getFacing() {
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const [dx, dy] = d[this.player.dir];
    return { x: this.player.x + dx, y: this.player.y + dy };
  }

  interact() {
    const f = this.getFacing();

    if (this.currentMap === 'overworld') {
      const key = f.x + ',' + f.y;

      // Check doors - enter building
      if (DOOR_MAP[key]) {
        this.enterBuilding(DOOR_MAP[key]);
        return;
      }

      // Check NPCs
      for (const npc of NPCS) {
        if (npc.x === f.x && npc.y === f.y) {
          this.showDialog(npc.dialog);
          return;
        }
      }
    } else {
      // Interior - check objects
      const objects = INTERIOR_OBJECTS[this.currentMap] || [];
      for (const obj of objects) {
        if (obj.x === f.x && obj.y === f.y) {
          this.showDialog(obj.dialog, obj.link || null);
          return;
        }
      }
    }
  }

  enterBuilding(buildingId) {
    // Save overworld position
    this.overworldPos = { x: this.player.x, y: this.player.y, dir: this.player.dir };
    // Mark as discovered
    if (!this.discovered.has(buildingId)) {
      this.discovered.add(buildingId);
      this.areaCountEl.textContent = this.discovered.size;
    }
    // Switch map
    this.currentMap = buildingId;
    // Place player at interior entrance (just above exit tiles)
    this.player.x = 5;
    this.player.y = 8;
    this.player.targetX = 5;
    this.player.targetY = 8;
    this.player.dir = 'up';
    this.player.moving = false;
    this.player.progress = 0;
    this.particles = new Particles();
    this.posHistory = [];
    this.companion.x = 6;
    this.companion.y = 8;
    this.companion.dir = 'up';
    // Show room name
    this.roomNameEl.textContent = BUILDINGS[buildingId].name;
    this.roomNameEl.classList.remove('hidden');
    // Render interior map
    this.renderInteriorMap();
    this.checkComplete();
  }

  exitBuilding() {
    if (!this.overworldPos) return;
    // Restore overworld position
    this.currentMap = 'overworld';
    this.player.x = this.overworldPos.x;
    this.player.y = this.overworldPos.y;
    this.player.targetX = this.overworldPos.x;
    this.player.targetY = this.overworldPos.y;
    this.player.dir = 'down';
    this.player.moving = false;
    this.player.progress = 0;
    this.overworldPos = null;
    this.particles = new Particles();
    this.posHistory = [];
    this.companion.x = this.player.x - 1;
    this.companion.y = this.player.y;
    this.companion.dir = 'down';
    // Hide room name
    this.roomNameEl.classList.add('hidden');
  }

  checkItemPickup() {
    for (let i = 0; i < ITEMS.length; i++) {
      if (!this.collected.has(i) && ITEMS[i].x === this.player.x && ITEMS[i].y === this.player.y) {
        this.collected.add(i);
        this.itemCountEl.textContent = this.collected.size;
        this.showPickup('Got ' + ITEMS[i].name + '!');
        // Burst particles on pickup
        this.particles.emit(ITEMS[i].x * S + 8, ITEMS[i].y * S + 8, 'pickup', 12);
        this.buildInventoryUI();
        this.checkComplete();
      }
    }
  }

  showPickup(text) {
    this.pickupTextEl.textContent = text;
    this.pickupEl.classList.remove('hidden');
    this.pickupEl.style.animation = 'none';
    void this.pickupEl.offsetHeight;
    this.pickupEl.style.animation = '';
    this.pickupTimer = 2000;
  }

  showDialog(pages, link) {
    this.dialogActive = true;
    this.dialogPages = pages;
    this.dialogIndex = 0;
    this.dialogLink = link || null;
    this.dialogConfirm = false;
    this.dialogConfirmEl.classList.add('hidden');
    this.renderDialogPage();
    this.dialogEl.classList.remove('hidden');
  }

  renderDialogPage() {
    const page = this.dialogPages[this.dialogIndex];
    this.dialogSpeaker.textContent = page.speaker;
    this.dialogText.textContent = page.text;
    const isLast = this.dialogIndex >= this.dialogPages.length - 1;
    if (isLast && this.dialogLink) {
      document.getElementById('dialog-prompt').textContent = '\u25BC SPACE';
    } else {
      document.getElementById('dialog-prompt').textContent =
        !isLast ? '\u25BC SPACE' : '\u25A0 CLOSE';
    }
  }

  advanceDialog() {
    this.dialogIndex++;
    if (this.dialogIndex >= this.dialogPages.length) {
      // If there's a link, show confirm instead of closing
      if (this.dialogLink && !this.dialogConfirm) {
        this.showConfirmPrompt();
        return;
      }
      this.closeDialog();
    } else {
      this.renderDialogPage();
    }
  }

  showConfirmPrompt() {
    this.dialogConfirm = true;
    this.dialogConfirmChoice = 0; // default to YES
    this.dialogConfirmEl.classList.remove('hidden');
    document.getElementById('dialog-prompt').textContent = '\u25C0\u25B6 Select   SPACE Confirm';
    this.updateConfirmUI();
  }

  updateConfirmUI() {
    this.confirmYesEl.classList.toggle('selected', this.dialogConfirmChoice === 0);
    this.confirmNoEl.classList.toggle('selected', this.dialogConfirmChoice === 1);
  }

  resolveConfirm() {
    if (this.dialogConfirmChoice === 0 && this.dialogLink) {
      // Open project link
      window.open(this.dialogLink, '_blank');
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogActive = false;
    this.dialogConfirm = false;
    this.dialogLink = null;
    this.dialogEl.classList.add('hidden');
    this.dialogConfirmEl.classList.add('hidden');
  }

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
    if (this.inventoryOpen) {
      this.buildInventoryUI();
      this.invDesc.textContent = 'Click an item for details. Press I to close.';
      this.inventoryEl.classList.remove('hidden');
    } else {
      this.inventoryEl.classList.add('hidden');
    }
  }

  checkComplete() {
    if (this.collected.size >= 10 && this.discovered.size >= 4) {
      setTimeout(() => {
        this.completed = true;
        document.getElementById('complete-stats').innerHTML =
          'Items: ' + this.collected.size + '/10<br>Areas: ' + this.discovered.size + '/4<br>Mission: COMPLETE';
        this.completeEl.classList.remove('hidden');
      }, 1500);
    }
  }

  restart() {
    this.collected = new Set();
    this.discovered = new Set();
    this.player = { x: 14, y: 9, dir: 'down', moving: false, targetX: 14, targetY: 9, progress: 0, frame: 0 };
    this.dialogActive = false;
    this.dialogConfirm = false;
    this.dialogLink = null;
    this.inventoryOpen = false;
    this.completed = false;
    this.pickupTimer = 0;
    this.particles = new Particles();
    this.currentMap = 'overworld';
    this.overworldPos = null;
    this.posHistory = [];
    this.companion = { x: 13, y: 9, dir: 'down', frame: 0, prevX: 13, prevY: 9, lerp: 1 };
    this.roomNameEl.classList.add('hidden');
    this.itemCountEl.textContent = '0';
    this.areaCountEl.textContent = '0';
    this.completeEl.classList.add('hidden');
    this.dialogEl.classList.add('hidden');
    this.dialogConfirmEl.classList.add('hidden');
    this.inventoryEl.classList.add('hidden');
    this.pickupEl.classList.add('hidden');
    this.buildInventoryUI();
  }

  // ============================================
  // RENDERING
  // ============================================
  updateMobileButtons() {
    if (!this.btnActionEl || !this.btnBackEl) return;
    const label = this.btnActionEl.querySelector('span');
    if (!label) return;

    // Update A button label based on context
    if (this.dialogActive) {
      label.textContent = this.dialogConfirm ? 'OK' : 'Next';
    } else {
      label.textContent = 'Interact';
    }

    // Show/hide back button with context label
    const backLabel = this.btnBackEl.querySelector('span');
    const showBack = this.currentMap !== 'overworld' || this.inventoryOpen;
    this.btnBackEl.style.display = showBack ? 'flex' : 'none';
    if (backLabel) {
      backLabel.textContent = this.inventoryOpen ? 'Close' : 'Exit';
    }
  }

  render(time) {
    const ctx = this.ctx;
    const t = time || Date.now();

    this.updateMobileButtons();

    if (this.currentMap === 'overworld') {
      this.renderOverworld(ctx, t);
    } else {
      this.renderInterior(ctx, t);
    }
  }

  renderOverworld(ctx, t) {
    // Re-render animated tiles (water, flowers, grass with wind)
    const mctx = this.mapCanvas.getContext('2d');
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const tile = MAP[y][x];
        if (tile === T.WATER || tile === T.FLOWER_R || tile === T.FLOWER_Y) {
          drawTile(mctx, x, y, tile, t);
        }
      }
    }

    // Blit map
    ctx.drawImage(this.mapCanvas, 0, 0);

    // Draw items (Mario-style)
    for (let i = 0; i < ITEMS.length; i++) {
      if (this.collected.has(i)) continue;
      const item = ITEMS[i];
      const px = item.x * S, py = item.y * S;

      // Glow pulse underneath
      const pulse = (Math.sin(t / 300 + i * 0.7) + 1) * 0.5;
      ctx.globalAlpha = 0.15 + pulse * 0.1;
      ctx.fillStyle = item.color;
      ctx.fillRect(px, py + 2, S, S - 2);
      ctx.globalAlpha = 1;

      // Draw the styled item
      drawItem(ctx, px, py, item.style, t + i * 500, item.color);

      // Rotating sparkle
      const sparkAngle = (t / 500 + i) % (Math.PI * 2);
      const sx = px + 8 + Math.cos(sparkAngle) * 8;
      const sy = py + 8 + Math.sin(sparkAngle) * 8;
      ctx.globalAlpha = (Math.sin(t / 200 + i * 2) + 1) * 0.5;
      ctx.fillStyle = '#fff';
      ctx.fillRect(sx, sy, 1, 1);
      ctx.globalAlpha = 1;
    }

    // Draw NPCs with idle animation
    for (const npc of NPCS) {
      const npcBreathe = (t / 1500 + NPCS.indexOf(npc) * 0.5) % 1;
      drawChar(ctx, npc.x * S, npc.y * S, npc.hair, npc.body, npc.idleDir, 0, npc.skin, npc.acc, npcBreathe);

      const bubBob = Math.sin(t / 500 + NPCS.indexOf(npc)) * 1.5;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(npc.x * S + 5, npc.y * S - 10 + bubBob, 6, 6);
      ctx.fillRect(npc.x * S + 7, npc.y * S - 5 + bubBob, 2, 2);
      ctx.fillStyle = '#333';
      ctx.fillRect(npc.x * S + 6, npc.y * S - 8 + bubBob, 1, 1);
      ctx.fillRect(npc.x * S + 8, npc.y * S - 8 + bubBob, 1, 1);
      ctx.fillRect(npc.x * S + 10, npc.y * S - 8 + bubBob, 1, 1);
    }

    // Check if player/companion is in water
    const playerCheckY = this.player.moving ? this.player.targetY : this.player.y;
    const playerCheckX = this.player.moving ? this.player.targetX : this.player.x;
    const playerTile = MAP[playerCheckY] && MAP[playerCheckY][playerCheckX];
    const companionTile = MAP[this.companion.y] && MAP[this.companion.y][this.companion.x];
    const playerInWater = playerTile === T.WATER;
    const companionInWater = companionTile === T.WATER;

    // Draw companion (behind player) with smooth position
    const [ccx, ccy] = this.getCompanionScreenPos(0, 0);
    if (companionInWater) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ccx, ccy, S, 8);
      ctx.clip();
      drawCompanion(ctx, ccx + 1, ccy, this.companion.dir, this.companion.frame, t);
      ctx.restore();
      const ripple = Math.sin(t / 300) * 1;
      ctx.fillStyle = 'rgba(100,180,255,0.4)';
      ctx.fillRect(ccx, ccy + 7 + ripple, 14, 2);
    } else {
      drawCompanion(ctx, ccx + 1, ccy, this.companion.dir, this.companion.frame, t);
    }

    // Draw player
    const [ppx, ppy] = this.getPlayerScreenPos();
    const playerBreathe = (t / 1200) % 1;
    const playerFrame = this.player.moving ? Math.floor(this.player.progress * 4) : 0;

    if (playerInWater) {
      // Swimming - clip bottom half, draw with bobbing
      const swimBob = Math.sin(t / 400) * 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.rect(ppx - 2, ppy - 4, S + 4, 12);
      ctx.clip();
      drawChar(ctx, ppx, ppy - 4 + swimBob, '#00c8d8', '#1a1a30', this.player.dir, playerFrame, '#ffcc99', null, playerBreathe);
      ctx.restore();
      // Water ripple around player
      const ripple = Math.sin(t / 300 + 1) * 1;
      ctx.fillStyle = 'rgba(80,160,240,0.5)';
      ctx.fillRect(ppx - 1, ppy + 7 + ripple, S + 2, 2);
      ctx.fillStyle = 'rgba(150,210,255,0.3)';
      ctx.fillRect(ppx + 1, ppy + 6 + ripple, S - 2, 1);
    } else {
      drawChar(ctx, ppx, ppy, '#00c8d8', '#1a1a30', this.player.dir, playerFrame, '#ffcc99', null, playerBreathe);
    }

    // Player direction indicator
    if (!this.player.moving && !playerInWater) {
      const indicatorPulse = (Math.sin(t / 400) + 1) * 0.3 + 0.2;
      ctx.globalAlpha = indicatorPulse;
      ctx.fillStyle = '#00ddee';
      const cx = ppx + 8, cy = ppy + 8;
      if (this.player.dir === 'down') ctx.fillRect(cx - 1, ppy + 17, 2, 2);
      else if (this.player.dir === 'up') ctx.fillRect(cx - 1, ppy - 3, 2, 2);
      else if (this.player.dir === 'left') ctx.fillRect(ppx - 3, cy - 1, 2, 2);
      else if (this.player.dir === 'right') ctx.fillRect(ppx + 17, cy - 1, 2, 2);
      ctx.globalAlpha = 1;
    }

    // Particles
    this.particles.draw(ctx);

    // Building labels with glow
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (const label of LABELS) {
      const labelPulse = (Math.sin(t / 1000 + LABELS.indexOf(label)) + 1) * 0.15;
      ctx.font = '5px "Press Start 2P"';
      ctx.globalAlpha = 0.3 + labelPulse;
      ctx.fillStyle = label.color;
      ctx.fillText(label.text, label.x * S + S / 2, label.y * S - 1);
      ctx.fillText(label.text, label.x * S + S / 2 + 1, label.y * S - 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillText(label.text, label.x * S + S / 2 + 1, label.y * S - 2);
      ctx.fillStyle = label.color;
      ctx.fillText(label.text, label.x * S + S / 2, label.y * S - 3);
    }

    // Door hints
    const doors = [[5, 5], [23, 5], [5, 15], [23, 15]];
    ctx.font = '4px "Press Start 2P"';
    for (const [dx, dy] of doors) {
      const dist = Math.abs(this.player.x - dx) + Math.abs(this.player.y - dy);
      if (dist <= 3) {
        const hintAlpha = Math.max(0, 1 - (dist - 1) * 0.4);
        ctx.globalAlpha = hintAlpha * ((Math.sin(t / 500) + 1) * 0.3 + 0.4);
        ctx.fillStyle = '#fff';
        ctx.fillText('SPACE', dx * S + S / 2, dy * S + S + 10);
        ctx.globalAlpha = 1;
      }
    }

    // Vignette
    const gradient = ctx.createRadialGradient(240, 160, 120, 240, 160, 280);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, COLS * S, ROWS * S);
  }

  renderInterior(ctx, t) {
    const imap = INTERIOR_MAPS[this.currentMap];
    if (!imap) return;

    // Clear canvas with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Center the interior map on the canvas
    const offsetX = Math.floor((COLS * S - INTERIOR_COLS * S) / 2);
    const offsetY = Math.floor((ROWS * S - INTERIOR_ROWS * S) / 2);

    // Re-render interior tiles
    const ictx = this.interiorCanvas.getContext('2d');
    for (let y = 0; y < INTERIOR_ROWS; y++) {
      for (let x = 0; x < INTERIOR_COLS; x++) {
        drawTile(ictx, x, y, imap[y][x], t);
      }
    }

    // Blit interior map centered
    ctx.drawImage(this.interiorCanvas, offsetX, offsetY);

    // Draw interior objects
    const objects = INTERIOR_OBJECTS[this.currentMap] || [];
    for (const obj of objects) {
      drawInteriorObject(ctx, obj.x + offsetX / S, obj.y + offsetY / S, obj.type, t);

      // Interaction hint when player is adjacent
      const f = this.getFacing();
      if (f.x === obj.x && f.y === obj.y && !this.player.moving) {
        const hintPulse = (Math.sin(t / 400) + 1) * 0.3 + 0.5;
        ctx.globalAlpha = hintPulse;
        ctx.fillStyle = '#fff';
        ctx.font = '4px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('SPACE', (obj.x + 0.5) * S + offsetX, obj.y * S + offsetY - 2);
        ctx.globalAlpha = 1;
      }
    }

    // Draw companion in interior
    const [ccx, ccy] = this.getCompanionScreenPos(offsetX, offsetY);
    drawCompanion(ctx, ccx + 1, ccy, this.companion.dir, this.companion.frame, t);

    // Draw player in interior
    const [ppx, ppy] = this.getPlayerScreenPos();
    const playerBreathe = (t / 1200) % 1;
    const playerFrame = this.player.moving ? Math.floor(this.player.progress * 4) : 0;
    drawChar(ctx, ppx + offsetX, ppy + offsetY, '#00c8d8', '#1a1a30', this.player.dir, playerFrame, '#ffcc99', null, playerBreathe);

    // Player direction indicator
    if (!this.player.moving) {
      const indicatorPulse = (Math.sin(t / 400) + 1) * 0.3 + 0.2;
      ctx.globalAlpha = indicatorPulse;
      ctx.fillStyle = '#00ddee';
      const cx = ppx + offsetX + 8, cy = ppy + offsetY + 8;
      if (this.player.dir === 'down') ctx.fillRect(cx - 1, ppy + offsetY + 17, 2, 2);
      else if (this.player.dir === 'up') ctx.fillRect(cx - 1, ppy + offsetY - 3, 2, 2);
      else if (this.player.dir === 'left') ctx.fillRect(ppx + offsetX - 3, cy - 1, 2, 2);
      else if (this.player.dir === 'right') ctx.fillRect(ppx + offsetX + 17, cy - 1, 2, 2);
      ctx.globalAlpha = 1;
    }

    // Particles
    this.particles.draw(ctx);

    // Exit hint near exit tiles
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const exitY = INTERIOR_ROWS - 1;
    const playerDist = Math.abs(this.player.y - exitY) + Math.min(Math.abs(this.player.x - 5), Math.abs(this.player.x - 6));
    if (playerDist <= 3) {
      const hintAlpha = Math.max(0, 1 - (playerDist - 1) * 0.4);
      ctx.globalAlpha = hintAlpha * ((Math.sin(t / 500) + 1) * 0.3 + 0.4);
      ctx.fillStyle = '#fff';
      ctx.fillText('EXIT', 5.5 * S + offsetX, exitY * S + offsetY - 2);
      ctx.globalAlpha = 1;
    }

    // Interior vignette (slightly warmer/darker)
    const gradient = ctx.createRadialGradient(240, 160, 80, 240, 160, 260);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, COLS * S, ROWS * S);
  }

  getPlayerScreenPos() {
    let ppx, ppy;
    if (this.player.moving) {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      // Smooth cubic ease-in-out
      const p = this.player.progress;
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      ppx = (this.player.x + dx * eased) * S;
      ppy = (this.player.y + dy * eased) * S;
    } else {
      ppx = this.player.x * S;
      ppy = this.player.y * S;
    }
    return [ppx, ppy];
  }
}

// ============================================
// INIT
// ============================================
window.addEventListener('load', async () => {
  // Wait for pixel font to load before rendering canvas text
  try {
    await document.fonts.load('16px "Press Start 2P"');
    await document.fonts.ready;
  } catch (e) { /* proceed anyway if font API unavailable */ }

  const game = new PortfolioRPG();
  game.start();

  // Space to start/complete handling
  window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
      if (!game.started) {
        game.started = true;
        game.welcomeEl.classList.add('hidden');
        game.hudEl.classList.add('visible');
      } else if (game.completed) {
        game.restart();
      }
    }
  });
});
