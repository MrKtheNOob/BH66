type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      {children}
    </div>
  );
}