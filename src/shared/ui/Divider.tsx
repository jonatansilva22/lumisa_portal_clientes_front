type DividerProps = {
  className?: string;
};

export function Divider({ className = "" }: DividerProps) {
  return (
    <hr className={`border-t border-gray-400 my-2 w-4/5 mx-auto ${className}`} />
  );
}