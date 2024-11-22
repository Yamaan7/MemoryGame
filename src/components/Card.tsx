import { motion } from 'framer-motion';

interface CardProps {
  id: number;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function Card({ image, isFlipped, isMatched, onClick }: CardProps) {
  return (
    <motion.div
      className="relative w-24 h-24 sm:w-32 sm:h-32 cursor-pointer"
      whileHover={{ scale: isFlipped ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className={`w-full h-full rounded-xl transition-all duration-500 transform preserve-3d ${isFlipped ? 'rotate-y-180' : ''
          }`}
      >
        <div className="absolute w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <img
            src={image}
            alt="Card"
            className={`w-full h-full object-cover rounded-xl shadow-lg ${isMatched ? 'opacity-50' : ''
              }`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}