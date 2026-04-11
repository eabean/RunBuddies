# RunBuddies

RunBuddies is a web application designed to connect users through a swiping mechanism similar to popular dating apps. The application allows users to create accounts, set up profiles, swipe on potential matches, and engage in chat with matched profiles.

## Features

- **User Authentication**: Users can log in or create a new account.
- **Profile Setup**: Users can fill out their profiles with relevant information and answer prompts to enhance their profiles.
- **Swipe Functionality**: Users can swipe through profiles of other users to find potential matches.
- **Chat Interface**: Users can view and chat with their matched profiles.

## Project Structure

```
RunBuddies
├── src
│   ├── main.tsx                # Entry point of the application
│   ├── App.tsx                 # Main application component with routing
│   ├── index.css               # Global CSS styles
│   ├── pages                   # Contains all page components
│   │   ├── IntroPage.tsx       # Login and signup forms
│   │   ├── ProfileSetupPage.tsx # Profile creation page
│   │   ├── SwipePage.tsx       # Swiping interface for users
│   │   └── ChatPage.tsx        # Chat interface for matched profiles
│   ├── components               # Reusable components
│   │   ├── auth                 # Authentication components
│   │   │   ├── LoginForm.tsx    # User login form
│   │   │   └── SignupForm.tsx   # User signup form
│   │   ├── profile              # Profile-related components
│   │   │   ├── ProfileForm.tsx   # Form for user profile information
│   │   │   └── QuestionPrompt.tsx # Prompts for user profile setup
│   │   ├── swipe                # Swiping components
│   │   │   ├── SwipeCard.tsx     # Individual user profile card
│   │   │   └── SwipeDeck.tsx     # Collection of SwipeCards
│   │   └── chat                 # Chat components
│   │       ├── ChatWindow.tsx    # Window for displaying matched profiles
│   │       └── MessageBubble.tsx  # Individual message representation
│   ├── routes                   # Application routing
│   │   └── AppRouter.tsx        # Defines application routes
│   ├── context                  # Context providers for state management
│   │   ├── AuthContext.tsx      # Provides authentication state
│   │   └── ProfileContext.tsx    # Provides profile data
│   ├── hooks                    # Custom hooks
│   │   └── useMatches.ts        # Logic for handling matched profiles
│   ├── services                 # API and mock services
│   │   ├── api.ts               # API calls for user data
│   │   └── mock.ts              # Mock data for testing
│   ├── types                    # TypeScript types and interfaces
│   │   └── index.ts             # Common types used in the application
│   └── utils                    # Utility functions
│       └── validators.ts        # Input validation functions
├── public                       # Public assets
│   └── icons.svg               # SVG icons used in the application
├── package.json                 # NPM configuration file
├── tsconfig.json                # TypeScript configuration file
├── vite.config.ts               # Vite configuration file
└── README.md                    # Project documentation
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd RunBuddies
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.