type LoadingSpinnerProps = {
  size?: number; // px
  className?: string;
};

export function LoadingSpinner({ size = 32, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin"
      >
        <g>
          {[...Array(12)].map((_, i) => (
            <rect
              key={i}
              x="23"
              y="4"
              width="4"
              height="12"
              rx="2"
              fill="gray"
              opacity={0.2 + i * 0.07}
              transform={`rotate(${i * 30} 25 25)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}