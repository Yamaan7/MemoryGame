import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { Timer } from './components/Timer';
import { Trophy, RotateCcw } from 'lucide-react';

const ALL_CARD_IMAGES = [
  // Nature
  'https://images.unsplash.com/photo-1534570122623-99e8378a9aa7',
  'https://images.unsplash.com/photo-1510771463146-e89e6e86560e',
  'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f',
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca',
  // Architecture
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
  // Food
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
  // Technology
  'https://images.unsplash.com/photo-1498049794561-7780e7231661',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
  // Travel
  'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
  // Abstract
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
  'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3',
  // Space
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
].map(url => `${url}?auto=format&fit=crop&w=300&q=80`);

interface Card {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);

  const getRandomImages = () => {
    const shuffledImages = [...ALL_CARD_IMAGES].sort(() => Math.random() - 0.5);
    return shuffledImages.slice(0, 8);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const initializeGame = () => {
    const selectedImages = getRandomImages();
    const shuffledCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setMoves(0);
    setSeconds(0);
    setIsPlaying(true);
    setFirstCard(null);
    setSecondCard(null);
  };

  const handleCardClick = (id: number) => {
    if (!isPlaying) return;
    
    const card = cards[id];
    if (card.isMatched || card.isFlipped || secondCard !== null) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    if (firstCard === null) {
      setFirstCard(id);
    } else {
      setSecondCard(id);
      setMoves(m => m + 1);
      
      if (cards[firstCard].image === cards[id].image) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCard].isMatched = true;
          matchedCards[id].isMatched = true;
          setCards(matchedCards);
          setFirstCard(null);
          setSecondCard(null);
          
          if (matchedCards.every(card => card.isMatched)) {
            setIsPlaying(false);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const unflippedCards = [...cards];
          unflippedCards[firstCard].isFlipped = false;
          unflippedCards[id].isFlipped = false;
          setCards(unflippedCards);
          setFirstCard(null);
          setSecondCard(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-gray-600 mb-2">Made by Yamaan</p>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Memory Game</h1>
          <div className="flex items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Moves:</span>
              <span className="text-2xl font-bold text-indigo-600">{moves}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Time:</span>
              <Timer seconds={seconds} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 p-2 bg-white/30 rounded-xl backdrop-blur-sm">
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={initializeGame}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            New Game
          </button>
        </div>

        {!isPlaying && moves > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-6">
                You completed the game in {moves} moves and {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')} minutes!
              </p>
              <button
                onClick={initializeGame}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;