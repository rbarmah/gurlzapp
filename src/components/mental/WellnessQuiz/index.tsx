import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../common/Button';
import QuizQuestion from './QuizQuestion';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import { quizQuestions } from './questions';

export default function WellnessQuiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    console.log('Answers:', answers); // Debugging: Log current answers
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex, // Store the selected answer's index
    }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScores = () => {
    const categories = Array.from(new Set(quizQuestions.map((q) => q.category)));

    return categories.map((category) => {
      const categoryQuestions = quizQuestions.filter((q) => q.category === category);

      const totalScore = categoryQuestions.reduce((sum, q, index) => {
        const globalIndex = quizQuestions.indexOf(q);
        const answerIndex = answers[globalIndex];
        if (answerIndex !== undefined) {
          return sum + (answerIndex + 1) * 25; // Convert answerIndex to score
        }
        return sum;
      }, 0);

      const maxScore = categoryQuestions.length * 100;
      const percentageScore = Math.round((totalScore / maxScore) * 100);

      return {
        category,
        score: percentageScore,
        recommendations: getRecommendations(category, percentageScore),
      };
    });
  };

  const getRecommendations = (category: string, score: number) => {
    if (score < 50) {
      return [
        'Consider seeking professional support.',
        'Focus on building daily self-care habits.',
        'Start with small, achievable goals.',
      ];
    } else if (score < 75) {
      return [
        'Continue your current practices.',
        'Try incorporating new wellness activities.',
        'Share your progress with others.',
      ];
    } else {
      return [
        'Maintain your excellent habits.',
        'Consider mentoring others.',
        'Challenge yourself with new goals.',
      ];
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleSave = () => {
    // Save results logic here
    navigate('/mental');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Wellness Quiz</h1>
        <p className="text-secondary-light/90">Evaluate your mental well-being</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <QuizProgress
                currentQuestion={currentQuestion + 1}
                totalQuestions={quizQuestions.length}
                category={quizQuestions[currentQuestion].category}
              />

              <QuizQuestion
                question={quizQuestions[currentQuestion].question}
                options={quizQuestions[currentQuestion].options}
                selectedAnswer={answers[currentQuestion] || null}
                onAnswer={(answer) => handleAnswer(answer)}
                category={quizQuestions[currentQuestion].category}
              />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {console.log('Scores:', calculateScores()) /* Debugging */}
              <QuizResults
                scores={calculateScores()}
                onRetake={handleRetake}
                onSave={handleSave}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
