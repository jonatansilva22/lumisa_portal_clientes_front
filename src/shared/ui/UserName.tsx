type UserNameProps = {
  name: string;
  className?: string;
};

export function UserName({ name, className = "" }: UserNameProps) {
  return (
    <span className={`font-bold text-black text-base mx-2 truncate max-w-[100px] sm:max-w-[150px] ${className}`}>
      {name}
    </span>
  );
}