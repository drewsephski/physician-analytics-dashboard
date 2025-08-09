import React from 'react';
import './onboarding-card.css';

interface OnboardingCardProps {
  title: string;
  description: string;
  onDismiss: () => void;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title,
  description,
  onDismiss
}) => {
  return (
    <div className='onboarding-card'>
      <div className='onboarding-card-header'>
        <h3>{title}</h3>
        <button onClick={onDismiss}>×</button>
      </div>
      <div className='onboarding-card-content'>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default OnboardingCard;
