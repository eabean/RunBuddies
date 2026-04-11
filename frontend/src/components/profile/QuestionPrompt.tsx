import React from 'react';

interface QuestionPromptProps {
  question: string;
  onAnswer: (answer: string) => void;
}

const QuestionPrompt: React.FC<QuestionPromptProps> = ({ question, onAnswer }) => {
  const [answer, setAnswer] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <div className="question-prompt">
      <h3>{question}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default QuestionPrompt;