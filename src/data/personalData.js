// ══════════════════════════════════════
// Personal Data — Single source of truth (ME config)
// All command handlers pull from this object.
// ══════════════════════════════════════

const DATA = {
  name: 'Rathod Adesh Siddhartha',
  displayName: 'Adesh Siddhartha',
  shortName: 'Sidd',
  title: 'MSc Software Engineering Student',
  role: 'MSc Software Engineering Student · AI Agents & Traceable Systems',
  location: 'Karlskrona, Sweden',
  country: 'Sweden',
  timezone: 'Europe/Stockholm',
  email: 'adrt25@student.bth.se',
  phone: '+46 79 325 66 88',
  linkedin: 'https://www.linkedin.com/in/rathod-adesh-siddhartha-5751703bb',
  github: 'https://github.com/siddharth250305',
  x: '', // Add your X/Twitter URL here
  resumeUrl: '/my_resume.pdf',

  // Short bio for the about command (one line per paragraph)
  shortBio: `Master's student in Software Engineering at Blekinge Institute of Technology (BTH), Sweden.
I build AI-agent systems whose output engineers can trace, audit and review — evidence over guesswork.
Built GateKeep, a test-gated agent harness for AI-generated code, and CarbonLenz AI, which extracts evidence from messy documents and leaves decisions to explainable rules.`,

  availability: 'Available from spring 2027',

  education: [
    {
      degree: 'M.Sc. in Software Engineering',
      school: 'Blekinge Institute of Technology (BTH)',
      location: 'Karlskrona, Sweden',
      period: 'Expected June 2027',
      emoji: '🎓'
    },
    {
      degree: 'B.Tech. in Computer Science and Engineering',
      school: 'JNTU Hyderabad',
      location: 'India',
      period: 'Graduated 2025',
      emoji: '🎓'
    }
  ],

  experience: [
    {
      role: 'Regulatory & Systems Analyst',
      org: 'CarbonLenz AI',
      program: 'Leapfrogs Program, Lund University Innovation',
      location: 'Karlskrona / Lund, Sweden',
      period: 'Jun – Aug 2026',
      highlights: [
        'Translated Regulation (EU) 2023/956 and Annex VI into 12 deterministic, testable verification rules behind a 0–100 risk score that flags the missing criterion with a remediation step.',
        'Cut supplier-certificate review from ~3–4 hours of manual work to under 5 seconds by extracting 12 fields into schema-validated JSON with Gemini structured outputs and OCR — returning null instead of a guess.',
        'Kept AI output out of financial figures: every 2026–2034 cost projection comes from a deterministic formula, separate from LLM evidence extraction.',
        'Chose a structured knowledge-graph retrieval design (Google OKF) over vector RAG so every legal value resolves to one named, auditable node.'
      ],
      tags: ['React', 'Node.js', 'Express', 'Gemini API', 'OCR'],
      emoji: '💼'
    }
  ],

  // Grouped skills for the skills command
  skillGroups: {
    'ai agents': ['LangGraph', 'LangChain', 'MCP server design', 'Gemini API', 'Structured outputs', 'Knowledge graph vs. RAG', 'Prompt engineering'],
    oversight: ['Audit trails', 'Approval gates', 'Reviewer UIs', 'Rejection-with-feedback', 'Log parsing', 'Test-failure triage'],
    research: ['Controlled experiments', 't-test', 'Mann–Whitney U', 'Effect sizes', 'Threats to validity', 'Research ethics'],
    languages: ['Python', 'JavaScript', 'C++'],
    frameworks: ['FastAPI', 'React', 'Node.js', 'PostgreSQL'],
    engineering: ['Software architecture', 'REST APIs', 'Git', 'Docker', 'CI/CD', 'pytest', 'scikit-learn'],
  },

  projects: [
    {
      name: 'GateKeep — Test-Gated Agent Harness for AI-Generated Code',
      description: 'An agent harness that checks coding-agent work against evidence from real test runs and human approval gates.',
      highlights: [
        '100% of pass/fail outcomes come from container exit codes (68 passing tests), parsed from pytest logs in an air-gapped Docker sandbox.',
        'Three-phase agent workflow (requirements → architecture → code) with 20 governed MCP tools and 3 human approval gates, enforced by a server-side policy engine.',
        'Prompts, diffs and test results chained in a SHA-256 audit ledger with a real-time review dashboard. Validated on pallets/itsdangerous.'
      ],
      tags: ['Python', 'FastAPI', 'LangGraph', 'MCP', 'PostgreSQL', 'Docker', 'React'],
      link: 'https://github.com/siddharth250305/Gatekeep--Agentic-SDLC'
    },
    {
      name: 'CI Test-Failure Triage — Log Parsing & Fault Classification',
      status: 'in progress',
      description: 'Attributes each CI failure to its likely cause: product, test, infrastructure or external library.',
      highlights: [
        'Parses raw build logs from public open-source projects into structured failure records.',
        'TF-IDF + logistic-regression baseline, evaluated by precision, recall and macro-F1 on a hand-labelled set.'
      ],
      tags: ['Python', 'scikit-learn', 'Regex log parsing', 'JSON'],
      link: ''
    }
  ],

  research: [
    {
      title: 'AI-Assisted Unit Test Generation in Safety-Critical Systems',
      org: 'BTH',
      period: 'Mar 2026 · team of 4',
      highlights: [
        'Controlled-experiment proposal (research methodology course; not conducted) with 30–40 planned participants: GitHub Copilot vs. manual CppUnit testing on a bug-seeded PX4 Autopilot C++ module.',
        'Defined 3 measurable outcomes (completion time, test error rate, seeded-bug detection) with pre-specified hypotheses, statistical tests and effect sizes; mapped threats to validity and ethics.'
      ]
    }
  ],

  interests: [
    'LLM agents and retrieval applied to root cause analysis — where uncertainty must stay visible',
    'Traceable, auditable AI: evidence trails, approval gates and human-in-the-loop review',
    'Agent orchestration and MCP tooling for the software development lifecycle',
    'Test-failure triage and CI log analysis',
    'Empirical software engineering and AI-assisted testing'
  ],

  // Neofetch card fields (PRD FR-4)
  neofetchInfo: {
    role: 'MSc Software Engineering',
    focus: 'AI agents · Traceability',
    stack: 'Python · LangGraph · FastAPI',
    based: 'Karlskrona, Sweden',
    status: 'available spring 2027',
  }
};

export default DATA;
