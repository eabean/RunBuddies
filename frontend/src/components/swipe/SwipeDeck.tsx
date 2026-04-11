import React from 'react';
import SwipeCard from './SwipeCard';

const SwipeDeck = () => {
  const users = [
    { id: 1, name: 'User 1', age: 25, bio: 'Loves hiking and outdoor adventures.' },
    { id: 2, name: 'User 2', age: 30, bio: 'Avid reader and coffee enthusiast.' },
    { id: 3, name: 'User 3', age: 28, bio: 'Passionate about technology and coding.' },
    // Add more user profiles as needed
  ];

  return (
    <div className="swipe-deck">
      {users.map(user => (
        <SwipeCard key={user.id} user={user} />
      ))}
    </div>
  );
};

export default SwipeDeck;