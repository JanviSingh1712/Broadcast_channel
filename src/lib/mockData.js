import { subHours, addHours, subDays, addDays } from 'date-fns';

const now = new Date();

export const MOCK_USERS = [
  {
    id: 'teacher-1',
    name: 'Sarah Johnson',
    email: 'teacher@demo.com',
    password: 'password',
    role: 'teacher',
    initials: 'SJ',
    department: 'Mathematics',
    color: '#5B5EF5',
  },
  {
    id: 'teacher-2',
    name: 'Michael Chen',
    email: 'teacher2@demo.com',
    password: 'password',
    role: 'teacher',
    initials: 'MC',
    department: 'Science',
    color: '#FF6B6B',
  },
  {
    id: 'principal-1',
    name: 'Dr. Amanda Lee',
    email: 'principal@demo.com',
    password: 'password',
    role: 'principal',
    initials: 'AL',
    color: '#C6F135',
  },
];

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Art',
  'Music',
  'Physical Education',
];

const TITLES = [
  'Introduction to Algebra — Chapter 3',
  'Photosynthesis: The Complete Process',
  'Shakespeare Sonnets Deep Dive',
  'World War II — Key Timeline',
  'Cell Division and Mitosis',
  "Newton's Laws of Motion",
  'Periodic Table: Groups & Periods',
  'Grammar Mastery — Advanced Rules',
  'Climate Change & Geography',
  'Binary Number System Explained',
  'Renaissance Art Overview',
  'Trigonometry Fundamentals',
  'Chemical Bonding Types',
  'English Romanticism Era',
  'The Water Cycle Visualised',
  'Quadratic Equations Made Easy',
  'Ecosystems & Food Webs',
  'The French Revolution',
  'Plate Tectonics & Earthquakes',
  'Programming Loops & Conditions',
];

const DESCRIPTIONS = [
  'This lesson covers essential concepts with detailed explanations, visual aids, and worked examples to help students build strong foundational knowledge.',
  'A comprehensive visual guide including diagrams, labeled illustrations, and step-by-step walkthroughs designed for classroom broadcast.',
  'Engaging content tailored for students at the intermediate level, featuring real-world applications and practice problem references.',
];

const seedRand = (seed) => {
  let x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

let _mockContent = null;

export const generateMockContent = () => {
  const items = [];
  const statuses = ['pending', 'approved', 'rejected', 'approved', 'approved', 'pending', 'approved', 'rejected'];

  for (let i = 0; i < 42; i++) {
    const r = seedRand(i);
    const status = statuses[i % statuses.length];
    const teacherId = i % 3 === 0 ? 'teacher-2' : 'teacher-1';
    const teacher = MOCK_USERS.find(u => u.id === teacherId);
    const hoursAgo = Math.floor(r * 72);
    const startTime = subHours(now, hoursAgo);
    const endTime = addHours(startTime, Math.floor(r * 10) + 2);
    const rotations = [15, 30, 45, 60];

    items.push({
      id: `content-${i + 1}`,
      title: TITLES[i % TITLES.length],
      subject: SUBJECTS[i % SUBJECTS.length],
      description: DESCRIPTIONS[i % DESCRIPTIONS.length],
      fileUrl: `https://picsum.photos/seed/${(i * 7 + 3)}/800/600`,
      fileType: 'image/jpeg',
      fileName: `content-slide-${i + 1}.jpg`,
      fileSize: Math.floor(r * 7000000) + 800000,
      status,
      teacherId,
      teacherName: teacher.name,
      teacherInitials: teacher.initials,
      teacherColor: teacher.color,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      rotationDuration: rotations[i % rotations.length],
      rejectionReason:
        status === 'rejected'
          ? 'This content does not align with the current curriculum framework. Please revise the material and ensure it meets the Grade-level learning objectives before resubmitting.'
          : null,
      createdAt: subDays(now, Math.floor(r * 14) + 1).toISOString(),
      updatedAt: subDays(now, Math.floor(r * 3)).toISOString(),
    });
  }
  return items;
};

export const getMockContent = () => {
  if (!_mockContent) _mockContent = generateMockContent();
  return [..._mockContent];
};

export const addMockUser = (user) => {
  MOCK_USERS.push(user);
};

export const addMockContent = (item) => {
  if (!_mockContent) _mockContent = generateMockContent();
  _mockContent = [item, ..._mockContent];
  return item;
};

export const updateMockContent = (id, updates) => {
  if (!_mockContent) _mockContent = generateMockContent();
  _mockContent = _mockContent.map(c => c.id === id ? { ...c, ...updates } : c);
  return _mockContent.find(c => c.id === id);
};
