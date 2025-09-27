import { User, Doubt, Answer, Feedback, Role, Subject, AcademicYear, Branch } from '../types';

// In-memory database
let users: User[] = [
    { id: '1', name: 'mihir', email: 'mihir@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=1', role: Role.STUDENT, points: 150, branch: Branch.CSE, accessGranted: true },
    { id: '2', name: 'sasidhar', email: 'sasidhar@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=2', role: Role.STUDENT, points: 75, branch: Branch.ECE, accessGranted: true },
    { id: '4', name: 'tharun', email: 'tharun@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=4', role: Role.STUDENT, points: 120, branch: Branch.MECH, accessGranted: true },
    { id: '5', name: 'raghu', email: 'raghu@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=5', role: Role.STUDENT, points: 95, branch: Branch.CIVIL, accessGranted: true },
    { id: '6', name: 'suraj', email: 'suraj@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=6', role: Role.STUDENT, points: 210, branch: Branch.EEE, accessGranted: true },
    { id: '7', name: 'karthik', email: 'karthik@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=7', role: Role.STUDENT, points: 45, branch: Branch.CSE, accessGranted: true },
    { id: '8', name: 'mohasin', email: 'mohasin@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=8', role: Role.STUDENT, points: 180, branch: Branch.ECE, accessGranted: true },
    { id: '9', name: 'hasish', email: 'hasish@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=9', role: Role.STUDENT, points: 110, branch: Branch.MECH, accessGranted: true },
    { id: '10', name: 'saketh', email: 'saketh@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=10', role: Role.STUDENT, points: 88, branch: Branch.CIVIL, accessGranted: true },
    { id: '11', name: 'amith', email: 'amith@college.edu', avatarUrl: 'https://i.pravatar.cc/150?u=11', role: Role.STUDENT, points: 165, branch: Branch.EEE, accessGranted: true },
];

const userMap = new Map(users.map(u => [u.id, u]));
const getUserProps = (id: string) => {
    const user = userMap.get(id);
    return {
        authorName: user?.name || 'Unknown User',
        authorAvatar: user?.avatarUrl || 'https://i.pravatar.cc/150',
    };
};


let doubts: Doubt[] = [
    { id: 'd1', title: 'How to implement a linked list in Python?', description: 'I am struggling with the concept of nodes and pointers. Can someone walk me through creating a Node class and then a LinkedList class that can append and print nodes?', authorId: '2', ...getUserProps('2'), subject: Subject.COMPUTER_SCIENCE, year: AcademicYear.FIRST, branch: Branch.ECE, createdAt: new Date(Date.now() - 86400000).toISOString(), isResolved: true },
    { id: 'd2', title: 'What is the Schrödinger equation?', description: 'Can someone explain the time-dependent Schrödinger equation in simple terms? I am confused about the Hamiltonian operator.', authorId: '4', ...getUserProps('4'), subject: Subject.PHYSICS, year: AcademicYear.THIRD, branch: Branch.MECH, createdAt: new Date(Date.now() - 172800000).toISOString(), isResolved: false },
    { id: 'd3', title: 'Derivatives vs. Integrals: what\'s the core difference?', description: 'I know one is about slopes and the other is about areas, but I get them mixed up conceptually. Can someone provide an intuitive analogy?', authorId: '7', ...getUserProps('7'), subject: Subject.MATHEMATICS, year: AcademicYear.FIRST, branch: Branch.CSE, createdAt: new Date(Date.now() - 3600000).toISOString(), isResolved: false },
    { id: 'd4', title: 'Help with balancing a chemical equation', description: 'I\'m stuck on this one: C3H8 + O2 -> CO2 + H2O. How do I balance it step-by-step?', authorId: '5', ...getUserProps('5'), subject: Subject.CHEMISTRY, year: AcademicYear.SECOND, branch: Branch.CIVIL, createdAt: new Date(Date.now() - 604800000).toISOString(), isResolved: true },
    { id: 'd5', title: 'Understanding Ohm\'s Law (V=IR)', description: 'What is the relationship between voltage, current, and resistance? I need a practical example to understand it better.', authorId: '2', ...getUserProps('2'), subject: Subject.ELECTRICAL_ENGINEERING, year: AcademicYear.SECOND, branch: Branch.ECE, createdAt: new Date(Date.now() - 259200000).toISOString(), isResolved: false },
    { id: 'd6', title: 'What is the process of Mitosis?', description: 'I need a summary of the different phases of mitosis (Prophase, Metaphase, Anaphase, Telophase) and what happens in each.', authorId: '4', ...getUserProps('4'), subject: Subject.BIOLOGY, year: AcademicYear.FIRST, branch: Branch.MECH, createdAt: new Date(Date.now() - 864000000).toISOString(), isResolved: true },
    { id: 'd7', title: 'Best way to manage state in a large React application?', description: 'I\'m working on a big project and useState is becoming messy. Should I use Context, Redux, or something else like Zustand? What are the pros and cons?', authorId: '9', ...getUserProps('9'), subject: Subject.COMPUTER_SCIENCE, year: AcademicYear.THIRD, branch: Branch.MECH, createdAt: new Date(Date.now() - 50000000).toISOString(), isResolved: true },
    { id: 'd8', title: 'How does a transformer work?', description: 'Can someone explain the principle of mutual induction in a transformer? How does it step up or step down voltage?', authorId: '11', ...getUserProps('11'), subject: Subject.ELECTRICAL_ENGINEERING, year: AcademicYear.SECOND, branch: Branch.EEE, createdAt: new Date(Date.now() - 200000000).toISOString(), isResolved: false },
    { id: 'd9', title: 'Stress-Strain curve for different materials', description: 'What are the key differences in the stress-strain curve for ductile vs. brittle materials? Points like elastic limit, yield point, and ultimate tensile strength are confusing.', authorId: '4', ...getUserProps('4'), subject: Subject.PHYSICS, year: AcademicYear.SECOND, branch: Branch.MECH, createdAt: new Date(Date.now() - 300000000).toISOString(), isResolved: false },
    { id: 'd10', title: 'Solving linear differential equations', description: 'I need help with the method of using an integrating factor to solve first-order linear differential equations. A worked example would be great.', authorId: '7', ...getUserProps('7'), subject: Subject.MATHEMATICS, year: AcademicYear.SECOND, branch: Branch.CSE, createdAt: new Date(Date.now() - 400000000).toISOString(), isResolved: true },
    { id: 'd11', title: 'What is DNS and how does it work?', description: 'I understand it translates domain names to IP addresses, but what is the step-by-step process? What are recursive and iterative queries?', authorId: '1', ...getUserProps('1'), subject: Subject.COMPUTER_SCIENCE, year: AcademicYear.THIRD, branch: Branch.CSE, createdAt: new Date(Date.now() - 500000000).toISOString(), isResolved: false },
    { id: 'd12', title: 'Explain the concept of entropy.', description: 'I\'m having trouble grasping the concept of entropy in thermodynamics. Is it just "disorder" or is there more to it? How does it relate to the second law of thermodynamics?', authorId: '10', ...getUserProps('10'), subject: Subject.PHYSICS, year: AcademicYear.THIRD, branch: Branch.CIVIL, createdAt: new Date(Date.now() - 700000000).toISOString(), isResolved: false },
];

let answers: Answer[] = [
    { id: 'a1', doubtId: 'd1', text: "Sure! A linked list is made of nodes. Each node contains data and a reference (or pointer) to the next node in the sequence. Here's a simple Node class:\n\n```python\nclass Node:\n    def __init__(self, data=None):\n        self.data = data\n        self.next = None\n```\n\nThen your LinkedList class will have a `head` that points to the first node. You can add methods to it like `append`.", authorId: '5', ...getUserProps('5'), createdAt: new Date(Date.now() - 80000000).toISOString(), feedback: { rating: 5, review: 'Excellent explanation! Super clear.' } },
    { id: 'a2', doubtId: 'd4', text: 'To balance C3H8 + O2 -> CO2 + H2O:\n1. Balance Carbons: You have 3 C on the left, so you need 3 CO2 on the right.\n   C3H8 + O2 -> 3CO2 + H2O\n2. Balance Hydrogens: You have 8 H on the left, so you need 4 H2O on the right (4 * 2 = 8).\n   C3H8 + O2 -> 3CO2 + 4H2O\n3. Balance Oxygens: Now count O on the right. You have (3 * 2) + 4 = 10. So you need 5 O2 on the left.\n   Final: C3H8 + 5O2 -> 3CO2 + 4H2O', authorId: '6', ...getUserProps('6'), createdAt: new Date(Date.now() - 500000000).toISOString(), feedback: { rating: 5, review: 'This was so helpful, thank you!' } },
    { id: 'a3', doubtId: 'd6', text: 'In short:\n- Prophase: Chromosomes condense and become visible.\n- Metaphase: Chromosomes line up at the middle of the cell.\n- Anaphase: Sister chromatids are pulled apart to opposite poles.\n- Telophase: New nuclei form around the two sets of chromosomes.', authorId: '8', ...getUserProps('8'), createdAt: new Date(Date.now() - 800000000).toISOString(), feedback: { rating: 4, review: 'Great summary!' } },
    { id: 'a4', doubtId: 'd3', text: 'Think of a car trip. The derivative is your speedometer at any single moment (your instantaneous speed). The integral is the total distance you traveled over the entire trip (the accumulation of your speed over time).', authorId: '1', ...getUserProps('1'), createdAt: new Date(Date.now() - 3000000).toISOString() },
    { id: 'a5', doubtId: 'd7', text: 'For large apps, Redux Toolkit is a great, robust option. Zustand is much simpler and has less boilerplate if you prefer that. Context is good for state that doesn\'t change often, like theming.', authorId: '1', ...getUserProps('1'), createdAt: new Date(Date.now() - 40000000).toISOString(), feedback: { rating: 5, review: 'Great overview, helped me decide!' } },
    { id: 'a6', doubtId: 'd10', text: 'To solve y\' + P(x)y = Q(x), the integrating factor is e^(integral of P(x)dx). Multiply the whole equation by it, and the left side becomes the derivative of (y * integrating_factor). Then integrate both sides.', authorId: '8', ...getUserProps('8'), createdAt: new Date(Date.now() - 350000000).toISOString(), feedback: { rating: 4, review: 'The explanation of the method was very clear.' } },
];

// --- AUTH ---

export const signInWithGoogle = async (): Promise<User> => {
    // For the mock, we'll log in as 'sasidhar'
    const user = users.find(u => u.id === '2');
    if (!user) throw new Error("Mock user not found");
    return user;
};

export const signOut = async (): Promise<void> => {
    return Promise.resolve(); // No-op
};


// --- DATA ---

export const getUserById = async (id: string): Promise<User | null> => {
    return users.find(u => u.id === id) || null;
};

export const getUsers = async (): Promise<User[]> => {
    return [...users];
};

export const getDoubts = async (): Promise<Doubt[]> => {
    return [...doubts];
};

export const getAllAnswers = async (): Promise<Answer[]> => {
    return [...answers];
};

export const getAnswersForDoubt = async (doubtId: string | null): Promise<Answer[]> => {
    if (!doubtId) return [];
    return answers.filter(a => a.doubtId === doubtId);
};

export const addDoubt = async (doubtData: Omit<Doubt, 'id' | 'createdAt' | 'authorName' | 'authorAvatar' | 'isResolved'>): Promise<void> => {
    const author = await getUserById(doubtData.authorId);
    if (!author) throw new Error("Author not found");
    const newDoubt: Doubt = {
        ...doubtData,
        id: `d${Date.now()}`,
        createdAt: new Date().toISOString(),
        authorName: author.name,
        authorAvatar: author.avatarUrl,
        isResolved: false
    };
    doubts.unshift(newDoubt);
};


export const addAnswer = async (answerData: Omit<Answer, 'id' | 'createdAt' | 'authorName' | 'authorAvatar'>): Promise<Answer> => {
    const author = await getUserById(answerData.authorId);
    if (!author) throw new Error("Author not found");
    const newAnswer: Answer = {
        ...answerData,
        id: `a${Date.now()}`,
        createdAt: new Date().toISOString(),
        authorName: author.name,
        authorAvatar: author.avatarUrl,
    };
    answers.push(newAnswer);
    return newAnswer;
};

export const addFeedbackToAnswer = async (answerId: string, doubtId: string, feedback: Feedback) => {
    const answer = answers.find(a => a.id === answerId);
    if (answer) {
        answer.feedback = feedback;
    }
    const doubt = doubts.find(d => d.id === doubtId);
    if (doubt) {
        doubt.isResolved = true;
    }
};

export const updateUserPoints = async (userId: string, pointsToAdd: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.points += pointsToAdd;
    }
};

export const updateUserName = async (userId: string, newName: string): Promise<User | null> => {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.name = newName;
        // Update denormalized names in doubts and answers
        doubts.forEach(d => { 
            if (d.authorId === userId) {
                d.authorName = newName;
            }
        });
        answers.forEach(a => {
            if (a.authorId === userId) {
                a.authorName = newName;
            }
        });
        return { ...user };
    }
    return null;
};

export const updateUserAccess = async (userId: string, accessGranted: boolean): Promise<User | null> => {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.accessGranted = accessGranted;
        return { ...user };
    }
    return null;
};

export const deleteDoubt = async (doubtId: string) => {
     doubts = doubts.filter(d => d.id !== doubtId);
     answers = answers.filter(a => a.doubtId !== doubtId);
};