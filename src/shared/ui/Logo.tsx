type LogoProps = {
  src: string;
  alt?: string;
  className?: string;
};

export function Logo({ src, alt = "Logo", className = "" }: LogoProps) {
  return (
    <img src={src} alt={alt} className={`mx-auto mb-4 h-15 ${className}`} />
  );
}