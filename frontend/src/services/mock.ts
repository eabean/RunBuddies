import { UserProfile } from '../types';

const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Alice',
    age: 25,
    interests: ['Hiking', 'Reading', 'Traveling'],
    bio: 'Adventure seeker and book lover.',
  },
  {
    id: '2',
    name: 'Bob',
    age: 30,
    interests: ['Cooking', 'Gaming', 'Music'],
    bio: 'Foodie and gaming enthusiast.',
  },
  {
    id: '3',
    name: 'Charlie',
    age: 28,
    interests: ['Photography', 'Traveling', 'Fitness'],
    bio: 'Capturing moments and staying active.',
  },
];

const getMockUsers = () => {
  return new Promise<UserProfile[]>((resolve) => {
    setTimeout(() => {
      resolve(mockUsers);
    }, 1000);
  });
};

export const mockApi = {
  register: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      userId: 'user-' + Math.random(),
      email,
      token: 'mock-token-' + Math.random(),
      hasProfile: false,
    };
  },

  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      userId: 'user-' + Math.random(),
      email,
      token: 'mock-token-' + Math.random(),
      hasProfile: true,
    };
  },

  getPrompts: async (token: string) => {
    return [
      { id: '1', promptText: 'What is your favorite running route?' },
      { id: '2', promptText: 'What is your running goal?' },
      { id: '3', promptText: 'Describe your ideal running buddy' },
    ];
  },

  createProfile: async (token: string, profileData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  savePromptAnswers: async (token: string, answers: any) => {
    return { success: true };
  },

  getDiscovery: async (token: string, page: number = 1) => {
    return [
      {
        userId: 'user-1',
        firstName: 'Sarah',
        age: 28,
        experienceLevel: 2,
        paceMinutes: 8,
        paceUnit: 1,
        biography: 'Love running in the morning!',
        lookingFor: 'Running buddy for marathons',
        contactInfo: '@sarah_runs • sarah@email.com',
        mainPhotoUrl: 'https://via.placeholder.com/400x500?text=Sarah',
        promptAnswers: [{ promptText: 'Favorite route?', answerText: 'Beach runs at sunset' }],
      },
      {
        userId: 'user-2',
        firstName: 'Jessica',
        age: 26,
        experienceLevel: 3,
        paceMinutes: 7,
        paceUnit: 1,
        biography: 'Half marathoner, always training',
        lookingFor: 'Competitive running partner',
        contactInfo: '@jessica.strides • jessica@email.com',
        mainPhotoUrl: 'https://via.placeholder.com/400x500?text=Jessica',
        promptAnswers: [{ promptText: 'Favorite route?', answerText: 'Mountain trails' }],
      },
    ];
  },

  swipe: async (token: string, swipedUserId: string, isLike: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { isMatch: isLike && Math.random() > 0.5, matchId: isLike ? 'match-' + Math.random() : null };
  },

  getMatches: async (token: string) => {
    return [
      {
        matchId: 'match-1',
        matchedAt: new Date().toISOString(),
        matchedUser: {
          firstName: 'Sarah',
          contactInfo: 'sarah@email.com',
          mainPhotoUrl: 'https://via.placeholder.com/400x500?text=Sarah',
          experienceLevel: 2,
          paceMinutes: 8,
          paceUnit: 1,
          promptAnswers: [{ promptText: 'Favorite route?', answerText: 'Beach runs' }],
        },
      },
    ];
  },
};

export { getMockUsers };