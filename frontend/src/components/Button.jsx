export default function Button({ children, className, onClick }) {
  return (
    <div
      className={`cursor-pointer flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white p-2 rounded [&>svg]:w-4 [&>svg]:h-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
