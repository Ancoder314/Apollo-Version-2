import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Play, 
  Pause, 
  CheckCircle, 
  Star,
  Clock,
  ArrowRight,
  Youtube,
  ExternalLink,
  Users,
  Headphones,
  PenTool,
  Eye,
  Brain,
  Target,
  Zap,
  Timer,
  Award,
  MessageSquare,
  Lightbulb,
  BarChart3,
  Settings,
  Filter,
  Search,
  Shuffle,
  RefreshCw,
  Layers,
  Cpu,
  Globe,
  Database,
  Gamepad2,
  Microscope,
  Calculator,
  Palette,
  Music,
  Camera,
  Code,
  Beaker,
  Atom,
  Dna,
  FlaskConical
} from 'lucide-react';

interface StudySessionProps {
  userData: any;
  setUserData: (data: any) => void;
}

const StudySession: React.FC<StudySessionProps> = ({ userData, setUserData }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [selectedStudyType, setSelectedStudyType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [scrollY, setScrollY] = useState(0);
  const [visibleSessions, setVisibleSessions] = useState<Set<number>>(new Set());

  // Enhanced scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which sessions are visible
      const sessionElements = document.querySelectorAll('[data-session-id]');
      const newVisible = new Set<number>();
      
      sessionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
          const sessionId = parseInt(el.getAttribute('data-session-id') || '0');
          newVisible.add(sessionId);
        }
      });
      
      setVisibleSessions(newVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Enhanced study types with more detailed options
  const studyTypes = [
    { 
      id: 'visual', 
      name: 'Visual Learning', 
      icon: Eye, 
      description: 'Diagrams, charts, and visual aids', 
      color: 'blue',
      effectiveness: '89%',
      avgDuration: '45 min',
      features: ['3D Models', 'Interactive Diagrams', 'Color-coded Content', 'Visual Mnemonics']
    },
    { 
      id: 'auditory', 
      name: 'Auditory Learning', 
      icon: Headphones, 
      description: 'Lectures, discussions, and audio content', 
      color: 'green',
      effectiveness: '76%',
      avgDuration: '35 min',
      features: ['Audio Lectures', 'Discussion Forums', 'Voice Notes', 'Music Integration']
    },
    { 
      id: 'kinesthetic', 
      name: 'Hands-on Practice', 
      icon: PenTool, 
      description: 'Interactive exercises and simulations', 
      color: 'purple',
      effectiveness: '82%',
      avgDuration: '60 min',
      features: ['Lab Simulations', 'Interactive Exercises', 'Physical Models', 'Gesture Learning']
    },
    { 
      id: 'reading', 
      name: 'Reading & Writing', 
      icon: FileText, 
      description: 'Text-based learning and note-taking', 
      color: 'yellow',
      effectiveness: '91%',
      avgDuration: '40 min',
      features: ['Structured Notes', 'Text Analysis', 'Writing Exercises', 'Research Skills']
    },
    { 
      id: 'collaborative', 
      name: 'Group Study', 
      icon: Users, 
      description: 'Peer discussions and group activities', 
      color: 'pink',
      effectiveness: '78%',
      avgDuration: '50 min',
      features: ['Study Groups', 'Peer Review', 'Collaborative Projects', 'Discussion Boards']
    },
    { 
      id: 'gamified', 
      name: 'Gamified Learning', 
      icon: Gamepad2, 
      description: 'Game-based learning and challenges', 
      color: 'red',
      effectiveness: '85%',
      avgDuration: '55 min',
      features: ['Learning Games', 'Challenges', 'Leaderboards', 'Achievement System']
    },
    { 
      id: 'adaptive', 
      name: 'AI Adaptive', 
      icon: Brain, 
      description: 'AI-powered personalized learning', 
      color: 'indigo',
      effectiveness: '94%',
      avgDuration: '50 min',
      features: ['Real-time Adaptation', 'Personalized Paths', 'Smart Recommendations', 'Performance Analytics']
    },
    { 
      id: 'immersive', 
      name: 'Immersive VR/AR', 
      icon: Eye, 
      description: 'Virtual and augmented reality experiences', 
      color: 'cyan',
      effectiveness: '87%',
      avgDuration: '30 min',
      features: ['VR Environments', 'AR Overlays', '3D Interactions', 'Spatial Learning']
    }
  ];

  // Comprehensive study sessions with detailed content
  const studySessions = [
    {
      id: 1,
      subject: 'Advanced Mathematics',
      topic: 'Multivariable Calculus: Vector Fields and Line Integrals',
      type: 'visual',
      studyMethod: 'Visual Learning',
      duration: 75,
      difficulty: 'Very Hard',
      stars: 30,
      confidence: 68,
      adaptiveLevel: 'Advanced',
      popularity: 94,
      rating: 4.8,
      completionRate: 78,
      resources: [
        { 
          type: 'video', 
          title: 'MIT OpenCourseWare: Vector Calculus Visualization', 
          duration: '28 min', 
          quality: 'HD',
          instructor: 'Prof. Denis Auroux',
          rating: 4.9,
          views: '3.2M',
          features: ['3D Animations', 'Interactive Plots', 'Step-by-step Solutions']
        },
        { 
          type: 'interactive', 
          title: 'Wolfram Alpha 3D Vector Field Visualizer', 
          interactions: 25,
          features: ['Real-time manipulation', '3D plotting', 'Custom field generation'],
          difficulty: 'Advanced',
          accuracy: '99.9%'
        },
        { 
          type: 'practice', 
          title: 'Adaptive Problem Set: Line Integrals', 
          problems: 40, 
          adaptive: true,
          successRate: '82%',
          avgTime: '4.2 min/problem',
          difficulty: 'Progressive'
        },
        { 
          type: 'assessment', 
          title: 'Comprehensive Vector Calculus Exam', 
          questions: 25, 
          adaptive: true,
          timeLimit: '120 min',
          passingScore: '75%',
          certification: 'Available'
        }
      ],
      description: 'Master vector fields and line integrals through advanced 3D visualizations, interactive problem-solving, and real-world applications in physics and engineering.',
      aiReasoning: 'Your visual learning preference (89% match) and strong mathematical foundation make this session ideal. Previous calculus performance shows 35% improvement with 3D visualizations.',
      personalizedNotes: 'Focus on parameterization techniques - you scored 58% on similar problems. Your spatial reasoning skills will help with vector field visualization.',
      prerequisites: ['Multivariable calculus basics', 'Vector algebra', 'Parametric equations', 'Basic line integrals'],
      learningObjectives: [
        'Visualize and interpret vector fields in 3D space',
        'Calculate line integrals along various curves',
        'Apply Green\'s theorem and Stokes\' theorem',
        'Solve real-world physics problems involving work and circulation',
        'Master parameterization of complex curves and surfaces'
      ],
      estimatedMastery: 85,
      nextSteps: ['Surface integrals', 'Divergence theorem', 'Maxwell\'s equations'],
      studyPath: [
        { step: 1, title: 'Vector field visualization', duration: 20, type: 'visual', concepts: ['Vector fields', '3D plotting'] },
        { step: 2, title: 'Parameterization techniques', duration: 18, type: 'practice', concepts: ['Curve parameterization', 'Arc length'] },
        { step: 3, title: 'Line integral calculations', duration: 22, type: 'problem-solving', concepts: ['Scalar line integrals', 'Vector line integrals'] },
        { step: 4, title: 'Physics applications', duration: 15, type: 'application', concepts: ['Work calculations', 'Circulation', 'Flux'] }
      ],
      tags: ['Calculus', 'Vector Fields', 'Physics Applications', 'Advanced Mathematics'],
      category: 'STEM',
      level: 'Graduate',
      institution: 'MIT',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      subject: 'Quantum Physics',
      topic: 'Advanced Quantum Mechanics: Schrödinger Equation Solutions',
      type: 'kinesthetic',
      studyMethod: 'Hands-on Practice',
      duration: 85,
      difficulty: 'Very Hard',
      stars: 35,
      confidence: 74,
      adaptiveLevel: 'Expert',
      popularity: 91,
      rating: 4.9,
      completionRate: 72,
      resources: [
        { 
          type: 'simulation', 
          title: 'Quantum Mechanics Laboratory Simulator', 
          experiments: 15,
          features: ['Wave function evolution', 'Potential well simulations', 'Measurement effects'],
          complexity: 'Research-grade',
          accuracy: 'Peer-reviewed'
        },
        { 
          type: 'interactive', 
          title: 'Schrödinger Equation Solver', 
          interactions: 30,
          features: ['Custom potential functions', 'Eigenvalue calculations', 'Probability distributions'],
          difficulty: 'Expert',
          computationalPower: 'High-performance'
        },
        { 
          type: 'video', 
          title: 'Feynman Lectures: Quantum Behavior Deep Dive', 
          duration: '45 min',
          series: 'The Feynman Lectures on Physics',
          rating: 4.95,
          concepts: 12,
          animations: 'Professional'
        },
        { 
          type: 'problems', 
          title: 'Graduate-Level Quantum Problems', 
          problems: 35,
          difficulty: 'PhD level',
          solutions: 'Detailed with physical interpretation',
          peerReview: 'Available'
        }
      ],
      description: 'Explore advanced quantum mechanical systems through hands-on simulations, solve the Schrödinger equation for complex potentials, and understand quantum behavior at the deepest level.',
      aiReasoning: 'Your physics excellence (91% average) and preference for interactive learning make this session highly effective. Kinesthetic approach addresses complex mathematical concepts through manipulation.',
      personalizedNotes: 'Your conceptual understanding is exceptional - leverage this for mathematical formalism. Focus on boundary condition applications where you scored 67% previously.',
      prerequisites: ['Linear algebra', 'Differential equations', 'Classical mechanics', 'Basic quantum mechanics', 'Complex analysis'],
      learningObjectives: [
        'Solve time-independent Schrödinger equation for various potentials',
        'Understand quantum tunneling and barrier penetration',
        'Master separation of variables in quantum systems',
        'Interpret wave function collapse and measurement',
        'Apply quantum mechanics to real physical systems'
      ],
      estimatedMastery: 88,
      nextSteps: ['Quantum field theory', 'Many-body systems', 'Quantum computing'],
      studyPath: [
        { step: 1, title: 'Wave function properties', duration: 20, type: 'theory', concepts: ['Normalization', 'Probability interpretation'] },
        { step: 2, title: 'Potential well simulations', duration: 25, type: 'simulation', concepts: ['Infinite wells', 'Finite wells', 'Harmonic oscillator'] },
        { step: 3, title: 'Tunneling experiments', duration: 20, type: 'experiment', concepts: ['Barrier penetration', 'Transmission coefficients'] },
        { step: 4, title: 'Advanced applications', duration: 20, type: 'application', concepts: ['Quantum dots', 'Scanning tunneling microscopy'] }
      ],
      tags: ['Quantum Mechanics', 'Schrödinger Equation', 'Wave Functions', 'Advanced Physics'],
      category: 'STEM',
      level: 'Graduate',
      institution: 'Caltech',
      lastUpdated: '2024-01-12'
    },
    {
      id: 3,
      subject: 'Organic Chemistry',
      topic: 'Advanced Synthesis: Multi-step Reaction Planning',
      type: 'visual',
      studyMethod: 'Visual Learning + 3D Modeling',
      duration: 90,
      difficulty: 'Hard',
      stars: 28,
      confidence: 61,
      adaptiveLevel: 'Advanced',
      popularity: 87,
      rating: 4.7,
      completionRate: 75,
      resources: [
        { 
          type: 'modeling', 
          title: 'ChemDraw 3D Professional Suite', 
          interactions: 40,
          features: ['Molecular dynamics', 'Reaction pathway visualization', 'Energy calculations'],
          accuracy: 'Research-grade',
          database: '10M+ compounds'
        },
        { 
          type: 'video', 
          title: 'Total Synthesis Masterclass Series', 
          duration: '55 min',
          series: 'Advanced Organic Chemistry',
          examples: 30,
          rating: 4.8,
          difficulty: 'Graduate level'
        },
        { 
          type: 'practice', 
          title: 'Retrosynthetic Analysis Trainer', 
          problems: 50,
          features: ['AI-powered feedback', 'Multiple pathway exploration', 'Literature integration'],
          difficulty: 'Adaptive',
          database: 'Reaxys integrated'
        },
        { 
          type: 'assessment', 
          title: 'Synthesis Planning Challenge', 
          questions: 20, 
          adaptive: true,
          format: 'Open-ended synthesis problems',
          timeLimit: '180 min',
          peerReview: 'Expert chemists'
        }
      ],
      description: 'Master complex multi-step organic synthesis through 3D molecular modeling, retrosynthetic analysis, and strategic reaction planning with real-world pharmaceutical applications.',
      aiReasoning: 'Organic chemistry is your challenge area (61% confidence). Visual learning approach (89% preference) with 3D modeling addresses spatial reasoning needs for complex molecular transformations.',
      personalizedNotes: 'Focus on protecting group strategies - common weakness in 68% of your synthesis attempts. Your analytical skills are strong; apply systematic retrosynthetic analysis.',
      prerequisites: ['Advanced organic reactions', 'Stereochemistry', 'Reaction mechanisms', 'Functional group chemistry', 'Spectroscopy'],
      learningObjectives: [
        'Design efficient multi-step synthetic routes',
        'Master retrosynthetic analysis strategies',
        'Understand protecting group chemistry',
        'Apply green chemistry principles',
        'Analyze and optimize reaction conditions'
      ],
      estimatedMastery: 78,
      nextSteps: ['Organometallic chemistry', 'Natural product synthesis', 'Medicinal chemistry'],
      studyPath: [
        { step: 1, title: 'Retrosynthetic strategy', duration: 25, type: 'strategy', concepts: ['Disconnection approaches', 'Synthetic equivalents'] },
        { step: 2, title: '3D molecular modeling', duration: 30, type: 'modeling', concepts: ['Conformational analysis', 'Transition states'] },
        { step: 3, title: 'Protecting group selection', duration: 20, type: 'selection', concepts: ['Orthogonal protection', 'Deprotection strategies'] },
        { step: 4, title: 'Route optimization', duration: 15, type: 'optimization', concepts: ['Atom economy', 'Step efficiency'] }
      ],
      tags: ['Organic Synthesis', 'Retrosynthesis', 'Medicinal Chemistry', 'Advanced Chemistry'],
      category: 'STEM',
      level: 'Graduate',
      institution: 'Harvard',
      lastUpdated: '2024-01-10'
    },
    {
      id: 4,
      subject: 'Computer Science',
      topic: 'Machine Learning: Deep Neural Networks and Backpropagation',
      type: 'adaptive',
      studyMethod: 'AI Adaptive Learning',
      duration: 95,
      difficulty: 'Very Hard',
      stars: 40,
      confidence: 79,
      adaptiveLevel: 'Expert',
      popularity: 96,
      rating: 4.9,
      completionRate: 81,
      resources: [
        { 
          type: 'interactive', 
          title: 'Neural Network Playground Advanced', 
          interactions: 50,
          features: ['Custom architectures', 'Real-time training visualization', 'Hyperparameter tuning'],
          datasets: '20+ included',
          frameworks: 'TensorFlow, PyTorch'
        },
        { 
          type: 'coding', 
          title: 'Deep Learning Implementation Lab', 
          exercises: 25,
          languages: ['Python', 'R', 'Julia'],
          frameworks: ['TensorFlow', 'PyTorch', 'JAX'],
          difficulty: 'Progressive',
          autoGrading: 'Available'
        },
        { 
          type: 'video', 
          title: 'Stanford CS229: Deep Learning Lectures', 
          duration: '8 hours',
          instructor: 'Andrew Ng',
          rating: 4.95,
          concepts: 25,
          assignments: 'Included'
        },
        { 
          type: 'project', 
          title: 'End-to-end ML Project Portfolio', 
          projects: 5,
          domains: ['Computer Vision', 'NLP', 'Time Series', 'Reinforcement Learning'],
          mentorship: 'Industry experts',
          deployment: 'Cloud platforms'
        }
      ],
      description: 'Master deep learning through hands-on implementation, understand backpropagation algorithms, and build production-ready neural networks with real-world applications.',
      aiReasoning: 'Your programming skills (85% proficiency) and mathematical background make this session highly effective. Adaptive AI approach personalizes difficulty and pacing.',
      personalizedNotes: 'Your linear algebra is strong - leverage this for understanding matrix operations in neural networks. Focus on regularization techniques where you scored 71%.',
      prerequisites: ['Linear algebra', 'Calculus', 'Python programming', 'Statistics', 'Basic machine learning'],
      learningObjectives: [
        'Implement neural networks from scratch',
        'Understand and derive backpropagation algorithm',
        'Master optimization techniques (Adam, RMSprop, etc.)',
        'Apply regularization and normalization techniques',
        'Deploy models to production environments'
      ],
      estimatedMastery: 86,
      nextSteps: ['Transformer architectures', 'Generative models', 'MLOps'],
      studyPath: [
        { step: 1, title: 'Neural network fundamentals', duration: 25, type: 'theory', concepts: ['Perceptrons', 'Activation functions', 'Forward propagation'] },
        { step: 2, title: 'Backpropagation derivation', duration: 30, type: 'mathematical', concepts: ['Chain rule', 'Gradient computation', 'Weight updates'] },
        { step: 3, title: 'Implementation practice', duration: 25, type: 'coding', concepts: ['NumPy implementation', 'Framework comparison', 'Debugging techniques'] },
        { step: 4, title: 'Advanced architectures', duration: 15, type: 'advanced', concepts: ['CNNs', 'RNNs', 'Attention mechanisms'] }
      ],
      tags: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'AI'],
      category: 'Technology',
      level: 'Graduate',
      institution: 'Stanford',
      lastUpdated: '2024-01-18'
    },
    {
      id: 5,
      subject: 'Molecular Biology',
      topic: 'CRISPR-Cas9 Gene Editing: Mechanisms and Applications',
      type: 'immersive',
      studyMethod: 'Immersive VR/AR Learning',
      duration: 70,
      difficulty: 'Hard',
      stars: 25,
      confidence: 73,
      adaptiveLevel: 'Advanced',
      popularity: 89,
      rating: 4.8,
      completionRate: 77,
      resources: [
        { 
          type: 'vr', 
          title: 'Virtual Molecular Laboratory', 
          experiences: 8,
          features: ['3D protein visualization', 'Molecular docking', 'Gene editing simulation'],
          platforms: ['Oculus', 'HTC Vive', 'WebXR'],
          resolution: '4K per eye'
        },
        { 
          type: 'ar', 
          title: 'Augmented DNA Manipulation', 
          interactions: 20,
          features: ['Holographic DNA models', 'Real-time editing visualization', 'Collaborative spaces'],
          devices: ['HoloLens', 'Magic Leap', 'Mobile AR'],
          tracking: '6DOF'
        },
        { 
          type: 'simulation', 
          title: 'CRISPR Design Studio', 
          tools: 15,
          features: ['Guide RNA design', 'Off-target prediction', 'Efficiency scoring'],
          databases: 'Integrated genomic data',
          validation: 'Experimental correlation'
        },
        { 
          type: 'case_studies', 
          title: 'Real-world CRISPR Applications', 
          cases: 12,
          domains: ['Medicine', 'Agriculture', 'Research'],
          updates: 'Monthly',
          experts: 'Leading researchers'
        }
      ],
      description: 'Explore CRISPR-Cas9 gene editing through immersive VR/AR experiences, design guide RNAs, and understand the ethical implications of genetic engineering.',
      aiReasoning: 'Your biology background (78% proficiency) and visual learning style make immersive experiences highly effective. VR/AR provides unprecedented molecular-level understanding.',
      personalizedNotes: 'Your biochemistry foundation is solid - build on this for understanding Cas9 protein structure. Focus on guide RNA design principles where you need improvement.',
      prerequisites: ['Molecular biology basics', 'DNA structure', 'Protein function', 'Cell biology', 'Genetics'],
      learningObjectives: [
        'Understand CRISPR-Cas9 molecular mechanisms',
        'Design effective guide RNAs',
        'Evaluate off-target effects and safety',
        'Explore therapeutic applications',
        'Consider ethical implications of gene editing'
      ],
      estimatedMastery: 82,
      nextSteps: ['Base editing', 'Prime editing', 'Epigenome editing'],
      studyPath: [
        { step: 1, title: 'CRISPR system overview', duration: 18, type: 'overview', concepts: ['Adaptive immunity', 'Cas proteins', 'PAM sequences'] },
        { step: 2, title: 'VR molecular exploration', duration: 25, type: 'immersive', concepts: ['Protein-DNA interactions', 'Conformational changes', 'Cleavage mechanism'] },
        { step: 3, title: 'Guide RNA design', duration: 20, type: 'design', concepts: ['Target selection', 'Specificity optimization', 'Delivery methods'] },
        { step: 4, title: 'Applications and ethics', duration: 7, type: 'discussion', concepts: ['Therapeutic uses', 'Agricultural applications', 'Ethical considerations'] }
      ],
      tags: ['CRISPR', 'Gene Editing', 'Molecular Biology', 'Biotechnology'],
      category: 'Life Sciences',
      level: 'Advanced',
      institution: 'Broad Institute',
      lastUpdated: '2024-01-14'
    },
    {
      id: 6,
      subject: 'Astrophysics',
      topic: 'Black Holes and General Relativity: Spacetime Curvature',
      type: 'visual',
      studyMethod: 'Visual Learning',
      duration: 80,
      difficulty: 'Very Hard',
      stars: 32,
      confidence: 69,
      adaptiveLevel: 'Advanced',
      popularity: 93,
      rating: 4.9,
      completionRate: 74,
      resources: [
        { 
          type: 'simulation', 
          title: 'Spacetime Curvature Visualizer', 
          simulations: 12,
          features: ['4D spacetime visualization', 'Geodesic calculations', 'Event horizon dynamics'],
          accuracy: 'Einstein field equations',
          performance: 'Real-time rendering'
        },
        { 
          type: 'video', 
          title: 'Black Hole Physics Masterclass', 
          duration: '60 min',
          instructor: 'Kip Thorne',
          rating: 4.95,
          animations: 'Hollywood-grade',
          concepts: 15
        },
        { 
          type: 'interactive', 
          title: 'General Relativity Playground', 
          experiments: 18,
          features: ['Metric tensor manipulation', 'Christoffel symbol calculation', 'Curvature visualization'],
          mathematics: 'Symbolic computation',
          validation: 'Peer-reviewed'
        },
        { 
          type: 'observatory', 
          title: 'Virtual Observatory Access', 
          telescopes: 8,
          data: 'Real astronomical observations',
          analysis: 'Professional tools',
          collaboration: 'Research community'
        }
      ],
      description: 'Explore the fascinating world of black holes through advanced spacetime visualizations, understand general relativity, and analyze real astronomical data.',
      aiReasoning: 'Your physics excellence (91% average) and visual learning preference make this session ideal. Complex spacetime concepts benefit from advanced visualization techniques.',
      personalizedNotes: 'Your mathematical foundation is strong - apply tensor calculus skills to general relativity. Focus on physical interpretation of mathematical formalism.',
      prerequisites: ['Special relativity', 'Tensor calculus', 'Differential geometry', 'Classical mechanics', 'Electromagnetism'],
      learningObjectives: [
        'Understand Einstein field equations',
        'Visualize spacetime curvature around massive objects',
        'Calculate black hole properties (mass, spin, charge)',
        'Interpret gravitational wave signatures',
        'Analyze real astronomical observations'
      ],
      estimatedMastery: 84,
      nextSteps: ['Cosmology', 'Quantum gravity', 'String theory'],
      studyPath: [
        { step: 1, title: 'Spacetime geometry', duration: 20, type: 'geometry', concepts: ['Minkowski space', 'Metric tensors', 'Geodesics'] },
        { step: 2, title: 'Einstein field equations', duration: 25, type: 'mathematical', concepts: ['Stress-energy tensor', 'Curvature tensor', 'Field equation solutions'] },
        { step: 3, title: 'Black hole physics', duration: 20, type: 'physics', concepts: ['Event horizons', 'Hawking radiation', 'Information paradox'] },
        { step: 4, title: 'Observational astronomy', duration: 15, type: 'observational', concepts: ['Gravitational lensing', 'LIGO detections', 'Event Horizon Telescope'] }
      ],
      tags: ['Black Holes', 'General Relativity', 'Astrophysics', 'Einstein'],
      category: 'STEM',
      level: 'Graduate',
      institution: 'Caltech',
      lastUpdated: '2024-01-16'
    }
  ];

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology', 'Astrophysics'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Very Hard'];
  const durations = ['All', 'Short (< 30 min)', 'Medium (30-60 min)', 'Long (60+ min)'];

  const filteredSessions = studySessions.filter(session => {
    const typeMatch = selectedStudyType === 'all' || session.type === selectedStudyType;
    const difficultyMatch = selectedDifficulty === 'all' || session.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const subjectMatch = selectedSubject === 'all' || session.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const durationMatch = selectedDuration === 'all' || 
      (selectedDuration === 'short' && session.duration < 30) ||
      (selectedDuration === 'medium' && session.duration >= 30 && session.duration <= 60) ||
      (selectedDuration === 'long' && session.duration > 60);
    const searchMatch = searchTerm === '' || 
      session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return typeMatch && difficultyMatch && subjectMatch && durationMatch && searchMatch;
  });

  // Sort sessions based on selected criteria
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    switch (sortBy) {
      case 'recommended':
        return b.confidence - a.confidence;
      case 'popularity':
        return b.popularity - a.popularity;
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return a.duration - b.duration;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3, 'Very Hard': 4 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      default:
        return 0;
    }
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      video: Video,
      article: FileText,
      practice: BookOpen,
      interactive: Play,
      quiz: CheckCircle,
      simulation: Eye,
      podcast: Headphones,
      discussion: MessageSquare,
      audio: Headphones,
      game: Gamepad2,
      coding: Code,
      leaderboard: BarChart3,
      achievement: Award,
      timeline: Clock,
      writing: FileText,
      notes: BookOpen,
      peer: Users,
      modeling: Beaker,
      vr: Eye,
      ar: Camera,
      case_studies: FileText,
      observatory: Microscope,
      project: Settings
    };
    const Icon = icons[type as keyof typeof icons] || BookOpen;
    return <Icon className="w-4 h-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'Very Hard': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const startSession = (session: any) => {
    setActiveSession(session);
    setSessionProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setSessionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeSession(session);
          return 100;
        }
        return prev + 1.2;
      });
    }, 150);
  };

  const completeSession = (session: any) => {
    setUserData({
      ...userData,
      totalStars: userData.totalStars + session.stars,
      completedLessons: userData.completedLessons + 1,
      studyTime: userData.studyTime + session.duration
    });
    setActiveSession(null);
  };

  if (activeSession) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Session Header */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white">{activeSession.subject}</h2>
                <p className="text-purple-400 font-semibold text-lg">{activeSession.topic}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-gray-400 text-sm">{activeSession.studyMethod}</p>
                  <span className="text-gray-500">•</span>
                  <p className="text-gray-400 text-sm">{activeSession.institution}</p>
                  <span className="text-gray-500">•</span>
                  <p className="text-gray-400 text-sm">Updated {activeSession.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-yellow-400 text-2xl font-bold">{activeSession.rating}</div>
                  <div className="text-gray-400 text-xs">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 text-2xl font-bold">{activeSession.popularity}%</div>
                  <div className="text-gray-400 text-xs">Popularity</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(activeSession.difficulty)}`}>
                  {activeSession.difficulty}
                </span>
                <span className={`text-sm font-medium ${getConfidenceColor(activeSession.confidence)}`}>
                  {activeSession.confidence}% confidence
                </span>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-5 h-5" />
                  <span className="font-bold text-lg">{activeSession.stars}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Session Progress</span>
                <div className="flex items-center space-x-4">
                  <span className="text-purple-400 font-semibold">{Math.round(sessionProgress)}%</span>
                  <span className="text-gray-400 text-sm">Est. {activeSession.duration} min</span>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                  style={{ width: `${sessionProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 mb-4 text-lg">{activeSession.description}</p>
            
            {/* Enhanced AI Insight */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-4 transform transition-all duration-200 hover:scale-[1.01]">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">AI Learning Insight</span>
              </div>
              <p className="text-blue-300 text-sm">{activeSession.aiReasoning}</p>
            </div>

            {/* Personalized Notes */}
            {activeSession.personalizedNotes && (
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 transform transition-all duration-200 hover:scale-[1.01]">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Personal Learning Note</span>
                </div>
                <p className="text-yellow-300 text-sm">{activeSession.personalizedNotes}</p>
              </div>
            )}
          </div>

          {/* Enhanced Study Path */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6 transform transition-all duration-300 hover:scale-[1.01]">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span>Adaptive Learning Path</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeSession.studyPath.map((step: any, index: number) => (
                <div key={step.step} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50 transform transition-all duration-200 hover:scale-105 hover:border-purple-500/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                    <span className="text-white font-semibold">{step.title}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{step.duration} min</span>
                      <span className="text-purple-400 capitalize">{step.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {step.concepts.map((concept: string, idx: number) => (
                        <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Session Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {activeSession.resources.map((resource: any, index: number) => (
              <div key={index} className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 transform">
                <div className="flex items-center space-x-3 mb-4">
                  {getTypeIcon(resource.type)}
                  <h3 className="font-semibold text-white text-lg">{resource.title}</h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  {resource.duration && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{resource.duration}</span>
                    </div>
                  )}
                  {resource.instructor && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{resource.instructor}</span>
                    </div>
                  )}
                  {resource.rating && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">{resource.rating}/5.0</span>
                    </div>
                  )}
                  {resource.problems && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{resource.problems} problems</span>
                    </div>
                  )}
                  {resource.features && (
                    <div className="space-y-1">
                      <span className="text-gray-400 text-sm font-medium">Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {resource.features.slice(0, 3).map((feature: string, idx: number) => (
                          <span key={idx} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {resource.features.length > 3 && (
                          <span className="text-xs text-purple-400">+{resource.features.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <Play className="w-4 h-4" />
                  <span>Launch Resource</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Enhanced Learning Objectives & Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 transform transition-all duration-300 hover:scale-[1.01]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Learning Objectives</span>
              </h3>
              <ul className="space-y-3">
                {activeSession.learningObjectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 transform transition-all duration-300 hover:scale-[1.01]">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span>Prerequisites</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeSession.prerequisites.map((prereq: string, index: number) => (
                  <span key={index} className="px-3 py-2 bg-slate-600/50 rounded-lg text-sm text-gray-300 border border-slate-500/30">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Session Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveSession(null)}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              End Session
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105">
              Take Break
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-200 hover:scale-105">
              Save Progress
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 relative">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translateY(${scrollY * (0.1 + Math.random() * 0.3)}px)`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Header */}
      <div 
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20 transform transition-all duration-1000 relative overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Advanced Personalized Study Sessions</h2>
          <p className="text-gray-300 text-lg">
            Choose your preferred learning style and dive into AI-curated content from world-class institutions
          </p>
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-white">{sortedSessions.length} sessions available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white">Avg rating: 4.8/5.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-white">2.3M+ learners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Study Type Selection */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 transform transition-all duration-1000">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-2">Choose Your Learning Experience</h3>
          <p className="text-gray-400">Select the approach that matches your learning style and goals</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedStudyType(type.id)}
                className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 transform ${
                  selectedStudyType === type.id
                    ? `bg-${type.color}-500/20 border-${type.color}-500/50 text-${type.color}-300 scale-105`
                    : 'bg-slate-700/30 border-slate-600/50 text-gray-300 hover:border-purple-500/50'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: visibleSessions.has(index) ? 'scale(1)' : 'scale(0.95)'
                }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold">{type.name}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{type.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Effectiveness:</span>
                    <div className="font-semibold">{type.effectiveness}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Avg Duration:</span>
                    <div className="font-semibold">{type.avgDuration}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-gray-400 mb-1">Key Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {type.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-slate-600/50 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 transform transition-all duration-1000">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions, topics, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none transition-all duration-200"
              />
            </div>
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject.toLowerCase()}>{subject}</option>
            ))}
          </select>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty.toLowerCase()}>{difficulty}</option>
            ))}
          </select>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            {durations.map(duration => (
              <option key={duration} value={duration.toLowerCase()}>{duration}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Shortest First</option>
            <option value="difficulty">Easiest First</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setSelectedStudyType('all');
                setSelectedDifficulty('all');
                setSelectedSubject('all');
                setSelectedDuration('all');
                setSearchTerm('');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
            >
              Clear All Filters
            </button>
            <span className="text-gray-400 text-sm">
              {sortedSessions.length} sessions found
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : 'bg-slate-600'} transition-all duration-200 hover:scale-105`}
            >
              <BarChart3 className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : 'bg-slate-600'} transition-all duration-200 hover:scale-105`}
            >
              <FileText className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Available Sessions */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {sortedSessions.map((session, index) => (
          <div 
            key={session.id} 
            data-session-id={session.id}
            className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all duration-500 group hover:scale-[1.02] transform"
            style={{ 
              animationDelay: `${index * 100}ms`,
              transform: visibleSessions.has(session.id) ? 'scale(1)' : 'scale(0.95)',
              opacity: visibleSessions.has(session.id) ? 1 : 0.8
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {session.subject}
                    </h3>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                      {session.category}
                    </span>
                  </div>
                  <p className="text-purple-400 font-semibold mb-1">{session.topic}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{session.studyMethod}</span>
                    <span>•</span>
                    <span>{session.institution}</span>
                    <span>•</span>
                    <span>{session.level}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{session.stars}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-4 line-clamp-2">{session.description}</p>

              {/* Enhanced Session Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-white font-semibold">{session.duration}min</p>
                  <p className="text-gray-400 text-xs">Duration</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Brain className="w-4 h-4" />
                  </div>
                  <p className={`font-semibold ${getConfidenceColor(session.confidence)}`}>{session.confidence}%</p>
                  <p className="text-gray-400 text-xs">Confidence</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Star className="w-4 h-4" />
                  </div>
                  <p className="text-yellow-400 font-semibold">{session.rating}</p>
                  <p className="text-gray-400 text-xs">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 text-gray-400 mb-1">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-green-400 font-semibold">{session.popularity}%</p>
                  <p className="text-gray-400 text-xs">Popularity</p>
                </div>
              </div>

              {/* AI Insight Preview */}
              <div className="bg-blue-500/10 rounded-lg p-3 mb-4 border border-blue-500/20">
                <p className="text-blue-300 text-sm">
                  <strong>AI Insight:</strong> {session.aiReasoning.substring(0, 120)}...
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {session.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Resources Preview */}
              <div className="space-y-2 mb-4">
                <h4 className="text-white font-medium text-sm">Resources ({session.resources.length}):</h4>
                {session.resources.slice(0, 3).map((resource, resIndex) => (
                  <div key={resIndex} className="flex items-center space-x-2 text-sm text-gray-400">
                    {getTypeIcon(resource.type)}
                    <span className="flex-1">{resource.title}</span>
                    {resource.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        <span className="text-yellow-400">{resource.rating}</span>
                      </div>
                    )}
                  </div>
                ))}
                {session.resources.length > 3 && (
                  <p className="text-sm text-purple-400">+{session.resources.length - 3} more resources</p>
                )}
              </div>

              <button
                onClick={() => startSession(session)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 group-hover:shadow-lg hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Start {session.studyMethod} Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedSessions.length === 0 && (
        <div className="text-center py-12 transform transition-all duration-1000">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No sessions match your criteria</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSelectedStudyType('all');
              setSelectedDifficulty('all');
              setSelectedSubject('all');
              setSelectedDuration('all');
              setSearchTerm('');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default StudySession;