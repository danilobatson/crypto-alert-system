import { keyframes } from '@mantine/core'

// Sophisticated animation keyframes
export const animations = {
  float: keyframes`
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(2deg); }
  `,
  
  shimmer: keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  `,
  
  pulse: keyframes`
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  `,
  
  slideUp: keyframes`
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  `,
  
  fadeIn: keyframes`
    0% { opacity: 0; }
    100% { opacity: 1; }
  `
}

// Reusable animation styles
export const animationStyles = {
  cardHover: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }
  },
  
  buttonHover: {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
    }
  },
  
  iconSpin: {
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'rotate(180deg)'
    }
  }
}
