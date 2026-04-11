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

export { getMockUsers };