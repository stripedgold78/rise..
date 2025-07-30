
import { useState, useEffect } from "react";

const initialData = {
  habits: ["", "", ""],
  entries: Array(66).fill(null),
  challenges: { coldShower: false, earlyWake: false },
};

const loadData = () => {
  try {
    const data = JSON.parse(localStorage.getItem("rise-reset"));
    return data || initialData;
  } catch {
    return initialData;
  }
};

const saveData = (data) => {
  localStorage.setItem("rise-reset", JSON.stringify(data));
};

export default function RiseResetApp() {
  const [data, setData] = useState(initialData);
  const [day, setDay] = useState(0);
  const [journal, setJournal] = useState("");

  const [theme, setTheme] = useState(() => localStorage.getItem("rise-theme") || "dark");
  const [gradient, setGradient] = useState(() => localStorage.getItem("rise-gradient") || "sunrise");

  useEffect(() => {
    const saved = loadData();
    setData(saved);
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rise-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("rise-gradient", gradient);
  }, [gradient]);

  const handleHabitCheck = () => {
    const updated = { ...data };
    updated.entries[day] = {
      date: new Date().toISOString(),
      habits: [...data.habits],
      challenges: data.challenges,
      journal,
    };
    setData(updated);
    setDay(day + 1);
    setJournal("");
  };

  const percent = Math.round((day / 66) * 100);

  const gradientMap = {
    sunrise: "from-orange-400 to-blue-400",
    focus: "from-indigo-500 to-purple-500",
    energize: "from-red-400 to-yellow-400",
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientMap[gradient]} text-white p-4 font-poppins`}>
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Rise Reset</h1>
          <div className="flex gap-2">
            <button
              className="text-sm bg-white/20 px-3 py-1 rounded hover:bg-white/30"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
            <select
              value={gradient}
              onChange={(e) => setGradient(e.target.value)}
              className="bg-white/20 text-white rounded px-2 py-1"
            >
              <option value="sunrise">Sunrise</option>
              <option value="focus">Focus</option>
              <option value="energize">Energize</option>
            </select>
          </div>
        </div>

        {day === 0 && (
          <div className="space-y-2">
            <p className="text-lg">Set your 3 reset habits:</p>
            {[0, 1, 2].map((i) => (
              <input
                key={i}
                className="w-full p-2 rounded bg-white/10 backdrop-blur"
                placeholder={`Habit ${i + 1}`}
                value={data.habits[i]}
                onChange={(e) => {
                  const updated = { ...data };
                  updated.habits[i] = e.target.value;
                  setData(updated);
                }}
              />
            ))}
            <button className="bg-white/20 px-4 py-2 rounded mt-2" onClick={() => setDay(1)}>Start Reset</button>
          </div>
        )}

        {day > 0 && day <= 66 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 space-y-4">
            <h2 className="text-xl font-bold">Day {day} of 66</h2>
            <div className="w-full bg-white/20 h-2 rounded">
              <div style={{ width: percent + "%" }} className="h-2 bg-white rounded" />
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Did you complete your habits?</p>
              {data.habits.map((h, i) => (
                <div key={i} className="bg-white/10 p-2 rounded">✅ {h}</div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="font-semibold">Challenges:</p>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={data.challenges.coldShower}
                  onChange={(e) => {
                    const updated = { ...data };
                    updated.challenges.coldShower = e.target.checked;
                    setData(updated);
                  }}
                />
                Cold Shower
              </label>
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={data.challenges.earlyWake}
                  onChange={(e) => {
                    const updated = { ...data };
                    updated.challenges.earlyWake = e.target.checked;
                    setData(updated);
                  }}
                />
                Early Wake
              </label>
            </div>

            <div>
              <p className="font-semibold">Reflection:</p>
              <textarea
                className="w-full p-2 rounded bg-white/10"
                rows={3}
                placeholder="What did you learn today?"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </div>

            <button className="bg-white/20 w-full py-2 rounded" onClick={handleHabitCheck}>
              Mark Day Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
