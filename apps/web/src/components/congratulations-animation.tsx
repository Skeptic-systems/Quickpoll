'use client'

import { useEffect, useState } from 'react'

interface CongratulationsAnimationProps {
  isVisible: boolean
  onComplete: () => void
  congratulationsText: string
  completedText: string
}

export function CongratulationsAnimation({ 
  isVisible, 
  onComplete, 
  congratulationsText, 
  completedText 
}: CongratulationsAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowAnimation(true)
      // Animation nach 1 Sekunde beenden
      const timer = setTimeout(() => {
        setShowAnimation(false)
        onComplete()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!showAnimation) return null

  return (
    <>
      {/* CSS für Luftschlange-Animation */}
      <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .confetti-fall {
          animation: confetti-fall 1s ease-in-out forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {/* Luftschlangen */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Luftschlange 1 */}
          <div className="absolute top-10 left-10 w-32 h-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full confetti-fall"
               style={{ transform: 'rotate(-15deg)' }}>
          </div>
          
          {/* Luftschlange 2 */}
          <div className="absolute top-20 right-20 w-24 h-6 bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '0.2s',
                 transform: 'rotate(25deg)' 
               }}>
          </div>
          
          {/* Luftschlange 3 */}
          <div className="absolute top-16 left-1/3 w-28 h-7 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '0.4s',
                 transform: 'rotate(-30deg)' 
               }}>
          </div>
          
          {/* Luftschlange 4 */}
          <div className="absolute top-12 right-1/3 w-20 h-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '0.6s',
                 transform: 'rotate(45deg)' 
               }}>
          </div>
          
          {/* Luftschlange 5 */}
          <div className="absolute top-24 left-1/4 w-26 h-6 bg-gradient-to-r from-cyan-400 via-teal-500 to-green-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '0.8s',
                 transform: 'rotate(-20deg)' 
               }}>
          </div>
          
          {/* Luftschlange 6 */}
          <div className="absolute top-18 right-1/4 w-22 h-7 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '1s',
                 transform: 'rotate(35deg)' 
               }}>
          </div>
          
          {/* Luftschlange 7 */}
          <div className="absolute top-14 left-2/3 w-30 h-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '1.2s',
                 transform: 'rotate(-25deg)' 
               }}>
          </div>
          
          {/* Luftschlange 8 */}
          <div className="absolute top-22 right-2/3 w-18 h-5 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 rounded-full confetti-fall"
               style={{ 
                 animationDelay: '1.4s',
                 transform: 'rotate(40deg)' 
               }}>
          </div>
        </div>

        {/* Hauptinhalt */}
        <div className="relative z-10 text-center">
          {/* Glückwunsch-Text */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse">
              {congratulationsText}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-white mt-4 animate-bounce">
              {completedText}
            </p>
          </div>

          {/* Konfetti-Effekt */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  backgroundColor: ['#fbbf24', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][i % 7],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
