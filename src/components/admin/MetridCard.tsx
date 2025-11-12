interface MetridCardprops {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string | number;
  changeType?: "increase" | "decrease";
}

export default function MetridCard({
  title,
  value,
  icon,
  change,
  changeType,
}: MetridCardprops) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">{icon}</div>
      </div>
      {change !== undefined && (
        <span
          className={`text-sm font-medium ${
            changeType === "increase" ? "text-green-600" : "text-red-600"
          }`}
        >
          {changeType === "increase" ? "↑" : "↓"} {change}%
        </span>
      )}
      <h3 className=" text-gray-700 text-sm ">
        {title}: <span className="text-xl font-semibold">{value}</span>
      </h3>
    </div>
  );
}
