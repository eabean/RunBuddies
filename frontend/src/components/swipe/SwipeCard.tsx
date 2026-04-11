import React from 'react';

interface SwipeCardProps {
  name: string;
  age: number;
  bio: string;
  imageUrl: string;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ name, age, bio, imageUrl }) => {
  return (
    <div className="swipe-card">
      <img src={imageUrl} alt={`${name}'s profile`} className="profile-image" />
      <h2>{name}, {age}</h2>
      <p>{bio}</p>
    </div>
  );
};

export default SwipeCard;