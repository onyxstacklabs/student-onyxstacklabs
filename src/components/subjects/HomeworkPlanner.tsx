'use client';

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: 'h1',
    title: 'Read Next.js App Router Documentation (Ch. 4-6)',
    subject: 'CS-101',
    estimatedMinutes: 45,
    priority: 'high',
    completed: false,
  },
  {
    id: 'h2',
    title: 'Solve Firebase Auth Rules Practice Set',
    subject: 'CS-202',
    estimatedMinutes: 30,
    priority: 'medium',
    completed: true,
  },
  {
    id: 'h3',
    title: 'Sketch UI Wireframes for Student Dashboard',
    subject: 'UI-301',
    estimatedMinutes: 60,
    priority: 'high',
    completed: false,
  },
];

export default function HomeworkPlanner() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Homework & Tasks Planner</h2>
          <p className="text-[10px] text-slate-400 mt-0.5">Daily actionable study tasks and priorities</p>
        </div>
        <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold rounded transition">
          + Add Task
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const priorityColor =
            task.priority === 'high'
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              : task.priority === 'medium'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-slate-400 bg-slate-800 border-slate-700';

          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between gap-3 ${
                task.completed
                  ? 'bg-slate-950/20 border-slate-800/40 opacity-60'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20"
                />
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span className="font-mono text-indigo-400">{task.subject}</span>
                    <span>•</span>
                    <span>⏱ {task.estimatedMinutes} mins</span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${priorityColor}`}
              >
                {task.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
