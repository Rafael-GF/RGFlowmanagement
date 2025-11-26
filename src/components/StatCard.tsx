interface StatCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mb-1">{label}</p>
          <p className="text-[#1F3A93]">{value}</p>
        </div>
        {icon && <div className="text-[#1F3A93]">{icon}</div>}
      </div>
    </div>
  );
}
