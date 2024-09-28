import { useEffect, useState } from "react";

interface NumberAnimationProps {
  target: number;
  duration?: number; // Duration in milliseconds
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({
  target,
  duration = 2000,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
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
  }, [target, duration]);

  return <div>{value}</div>; // Display the animated number
};

export default NumberAnimation;
