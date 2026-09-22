// ============================================================
//  ALL PORTFOLIO CONTENT LIVES HERE.
//  Edit this file to update text, projects, experience, links.
//  Images/files go in the /public folder (photo.jpg, resume.pdf).
// ============================================================

export const profile = {
  name: 'Churnika Marappa Reddy',
  firstName: 'Churnika',
  shortName: 'CMR',
  roles: ['Data Engineer', 'Full-Stack Developer', 'AI/ML Engineer'],
  tagline:
    'I build scalable data pipelines, production-ready full-stack apps, and AI/ML systems, turning raw data into things people can query, predict with, and ship.',
  location: 'Buffalo, NY',
  locationCoords: [42.8864, -78.8784],
  status: 'Open to opportunities',
  email: 'churnika13@gmail.com',
  phone: '+1 716-440-3872',
  photo: 'photo.jpg',
  resume: 'resume.pdf',
  resumeFileName: 'Churnika_Marappa_Reddy_Resume.pdf',
  socials: {
    github: 'https://github.com/churnika67',
    linkedin: 'https://www.linkedin.com/in/churnika',
  },
}

export const about = {
  headline: 'A data problem isn’t solved until someone can actually use the answer.',
  body: [
    'I’m a graduate Data Science student at the University at Buffalo, working as a Research Assistant building Python tooling for generative AI research, workflow automation, and LLM output evaluation.',
    'Before UB, I was a Software Engineering Intern at Tirumala Tirupati Devasthanams and a Python Intern at Slash Mark, and completed my B.Tech in Computer Science at Amrita Vishwa Vidyapeetham.',
  ],
  stats: [
    { value: 7, suffix: '', label: 'Projects shipped' },
    { value: 3, suffix: '', label: 'Internships & research roles' },
    { value: 20, suffix: '+', label: 'Tools & frameworks' },
    { value: 'MS', suffix: '', label: 'Data Science · Dec 2026' },
  ],
  // Words that light up on scroll in the statement section
  statement:
    'I don’t just train models. I build the whole path, from raw data to pipeline to prediction to the interface someone actually clicks.',
}

// Skill groups. `color` is used on the 3D keycaps.
export const skills = [
  { group: 'Languages', color: '#a78bfa', items: ['Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'HTML/CSS'] },
  { group: 'Frontend', color: '#f472b6', items: ['React', 'React Native', 'Next.js', 'Vite', 'Expo', 'Tailwind'] },
  { group: 'Backend & APIs', color: '#fb923c', items: ['FastAPI', 'REST APIs', 'SQLAlchemy'] },
  { group: 'Data Engineering', color: '#22d3ee', items: ['Airflow', 'Spark', 'Iceberg', 'ETL/ELT', 'Databricks'] },
  { group: 'Databases', color: '#34d399', items: ['PostgreSQL', 'SQLite', 'Supabase'] },
  { group: 'AI / ML', color: '#facc15', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'LightGBM', 'MLflow', 'GenAI'] },
  { group: 'Cloud & DevOps', color: '#60a5fa', items: ['AWS', 'Docker', 'Git', 'GitHub Actions'] },
  { group: 'Data & Viz', color: '#e879f9', items: ['Pandas', 'NumPy', 'Streamlit', 'Matplotlib'] },
]

export const experience = [
  {
    period: 'Aug 2025 – Present',
    org: 'University at Buffalo',
    role: 'Research Assistant, Generative AI & Workflow Support',
    points: [
      'Develop Python utilities supporting AI research, data processing, validation, and workflow automation.',
      'Evaluate AI/LLM outputs, identify failure cases, and improve experimental workflows.',
      'Prepare technical documentation and collaborate with researchers on AI-driven solutions.',
    ],
    tags: ['Python', 'LLM Evaluation', 'Automation'],
    type: 'work',
  },
  {
    period: 'Expected Dec 2026',
    org: 'University at Buffalo, SUNY',
    role: 'MS, Engineering Science (Data Science)',
    points: [],
    tags: [],
    type: 'edu',
  },
  {
    period: 'Jun 2024 – Aug 2024',
    org: 'Tirumala Tirupati Devasthanams (TTD)',
    role: 'Software Engineering Intern',
    points: [
      'Supported development and testing of enterprise web applications.',
      'Debugged frontend, backend, and API-related issues and validated application workflows.',
      'Collaborated with development teams on application reliability and technical documentation.',
    ],
    tags: ['Web Apps', 'APIs', 'Testing'],
    type: 'work',
  },
  {
    period: 'Oct 2023 – Feb 2024',
    org: 'Slash Mark',
    role: 'Python Intern',
    points: [
      'Developed Python applications for automation, data processing, and algorithmic problem-solving.',
      'Debugged application logic, validated program outputs, and maintained reusable code.',
    ],
    tags: ['Python', 'Automation'],
    type: 'work',
  },
  {
    period: 'May 2025',
    org: 'Amrita Vishwa Vidyapeetham, Coimbatore',
    role: 'B.Tech, Computer Science and Engineering',
    points: [],
    tags: [],
    type: 'edu',
  },
]

// Projects. `accent` colors the card. `metric` and `caseStudy` are optional.
export const projects = [
  {
    name: 'Citi Bike Demand Prediction Pipeline',
    category: 'Data Engineering · ML',
    accent: '#22d3ee',
    blurb: 'Predicts next-hour station demand so bikes and docks are where riders need them.',
    metric: { value: '50.9%', label: 'lower operational penalty vs. a naïve baseline' },
    desc: 'Frames next-hour station demand as a 3-class problem (Low / Normal / High), engineered from 1h, 2h, 24h and 168h lag features across months of Citi Bike trip data. Orchestrated with Airflow, served through FastAPI and Streamlit, containerized with Docker.',
    caseStudy: {
      problem:
        'A station is only useful if it has bikes to rent and docks to return them to, so whether the next hour tips a station into shortage or overflow matters more than a raw demand number.',
      approach:
        'Modeled demand as Low / Normal / High with lag features at four horizons (short-term momentum plus daily and weekly seasonality). Orchestrated end to end with Airflow, served via FastAPI + Streamlit, containerized with Docker.',
      result:
        '50.9% lower cumulative operational penalty than a naïve baseline on the evaluated window: fewer costly misses where a station is about to run empty or overflow.',
    },
    tags: ['Airflow', 'Spark', 'Iceberg', 'LightGBM', 'Optuna', 'FastAPI', 'Docker'],
    link: 'https://github.com/churnika67/citibike-demand-prediction-pipeline-DataEngineer',
  },
  {
    name: 'Evently',
    category: 'Mobile · Full-Stack',
    accent: '#f472b6',
    blurb: 'A mobile app to discover, RSVP to and create local events.',
    metric: { value: '10+', label: 'core user flows implemented end to end' },
    desc: 'Discovery, search and category filtering, recommendations, saved events, RSVP/ticketing, event creation, sharing, communities and profile interests. Supabase client wired in for backend integration.',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    link: 'https://github.com/churnika67/Evently',
  },
  {
    name: 'Telco Customer Churn Prediction',
    category: 'Machine Learning',
    accent: '#facc15',
    blurb: 'Finds customers about to leave, with every experiment tracked and reproducible.',
    metric: { value: '16', label: 'experiment configs across 4 algorithms' },
    desc: 'Benchmarked Logistic Regression, Random Forest, SVC and XGBoost across PCA / no-PCA and default / Optuna-tuned settings, tracked through MLflow and DagsHub. Selected model served behind FastAPI and Streamlit in Docker.',
    caseStudy: {
      problem:
        'Miss an at-risk customer and they are gone; flag too many and retention spend is wasted. The right model and configuration isn’t obvious up front.',
      approach:
        'Benchmarked four algorithms across 16 configurations, varying dimensionality reduction and hyperparameter tuning, with every run logged in MLflow + DagsHub.',
      result:
        'A usable prediction tool (FastAPI + Streamlit + Docker), not a notebook that ends at the last cell.',
    },
    tags: ['Scikit-learn', 'XGBoost', 'MLflow', 'Optuna', 'Streamlit'],
    link: 'https://github.com/churnika67/Telco-customer-churn',
  },
  {
    name: 'AI-Powered SQL Query Assistant',
    category: 'AI · Backend',
    accent: '#a78bfa',
    blurb: 'Ask your database questions in plain English.',
    desc: 'Natural-language interface over a PostgreSQL database hosted on Render, powered by the OpenAI API, with bcrypt authentication and data utilities. Served through a Streamlit front end.',
    tags: ['PostgreSQL', 'OpenAI API', 'Streamlit', 'bcrypt'],
    link: 'https://github.com/churnika67/customers',
  },
  {
    name: 'Cognitive Stress Identification',
    category: 'Computer Vision',
    accent: '#34d399',
    blurb: 'Reads stress signals from a live webcam feed in real time.',
    metric: { value: '3', label: 'fused facial signal families' },
    desc: 'Fuses emotion recognition, eyebrow displacement and blink-pattern analysis from live webcam or video into a single stress assessment, with live visualization and session history.',
    tags: ['TensorFlow', 'OpenCV', 'dlib', 'NumPy'],
    link: 'https://github.com/churnika67/Cognitive-Stress-Identification-via-Facial-Signals',
  },
  {
    name: 'Real-Time Weather App',
    category: 'Full-Stack',
    accent: '#60a5fa',
    blurb: 'Search any place, get a 5-day forecast, save and export it.',
    desc: 'Built on live Open-Meteo geocoding and forecast APIs: city, ZIP, landmark, coordinate and geolocation search, 5-day forecasts, full CRUD with SQLite, validation, and JSON/CSV export.',
    tags: ['React', 'Vite', 'FastAPI', 'SQLAlchemy'],
    link: 'https://github.com/churnika67/weather-app',
  },
  {
    name: 'DeepSpace Smart Workout Buddy',
    category: 'Frontend',
    accent: '#fb923c',
    blurb: 'Goals become a workout plan, a live timer and a progress dashboard.',
    desc: 'A connected fitness workflow prototype: profile goals feed a dynamic workout plan, which drives an active workout timer, session logging and a progress dashboard.',
    tags: ['JavaScript', 'React', 'JSX'],
    link: 'https://github.com/churnika67/deepspace-smart-workout-buddy',
  },
]
