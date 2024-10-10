import { useEffect, useState } from 'react';

interface NumberAnimationProps {
  target: number;
  duration?: number; // Duration in milliseconds
  start: boolean; // New prop to control when the animation starts
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({
  target,
  duration = 2000,
  start,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return; // Do nothing if the animation hasn't started

    const increment = target / (duration / 100); // Calculate increment based on duration
    let currentValue = 0;
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        clearInterval(interval);
        setValue(target); // Ensure it ends at the target value
      } else {
        setValue(Math.floor(currentValue)); // Update state with the floored value
      }
    }, 100);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [target, duration, start]); // Run when target, duration, or start changes

  return (
    <div className='font-aleo font-bold text-[4.45rem] leading-none text-mbYellow'>
      {value}
    </div> // Display the animated number
  );
};

export default NumberAnimation;
