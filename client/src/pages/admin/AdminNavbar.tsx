// admin/AdminNavbar.tsx
import React from "react";

export default function AdminNavbar({
  active,
  onChange,
  onLogout,
}: {
  active: string;
  onChange: (tab: string) => void;
  onLogout: () => void;
}) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "messages", label: "Messages" },
    { key: "portfolio", label: "Portfolio" },
    { key: "testimonials", label: "Testimonials" },
    { key: "newsletter", label: "Newsletter" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Achek Admin</h2>

      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={`w-full text-left px-3 py-2 rounded mb-2 ${
            active === it.key ? "bg-gray-700" : "hover:bg-gray-800"
          }`}
        >
          {it.label}
        </button>
      ))}

      <button
        onClick={onLogout}
        className="w-full bg-red-600 mt-6 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
