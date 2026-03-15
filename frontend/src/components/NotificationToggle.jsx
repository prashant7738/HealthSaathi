export default function NotificationToggle({ title, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
          enabled ? 'bg-cyan-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-6' : ''
          }`}
        />
      </button>
    </div>
  );
}
