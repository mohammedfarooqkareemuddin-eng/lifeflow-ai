"use client";

import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  done: boolean;
  due: string;
};

type Plan = {
  goal: string;
  answers: Record<string, string>;
  tasks: Task[];
};

const questions = [
  { key: "why", label: "Why is this important to you?", placeholder: "Example: I want a better career..." },
  { key: "deadline", label: "When would you like to achieve it?", placeholder: "Example: Within 3 months" },
  { key: "experience", label: "What have you already done?", placeholder: "Example: I have researched a few options" },
  { key: "resources", label: "What resources do you already have?", placeholder: "Example: 2 hours a day and a laptop" },
  { key: "challenge", label: "What is your biggest challenge?", placeholder: "Example: I don't know where to start" }
];

function createTasks(goal: string, answers: Record<string, string>): Task[] {
  const today = new Date();
  const labels = [
    ["Clarify the outcome", `Write down exactly what success looks like for: ${goal}.`],
    ["Research the requirements", `Find the official requirements, tools, people or information needed for ${goal}.`],
    ["Prepare what you need", `Use your available resources (${answers.resources || "your available time and tools"}) to prepare the essentials.`],
    ["Take the first action", `Complete one small action today that moves ${goal} forward.`],
    ["Review and improve", "Check your progress, identify the next obstacle, and adjust your plan."]
  ];

  return labels.map(([title, description], index) => {
    const due = new Date(today);
    due.setDate(today.getDate() + index * 3 + 1);
    return {
      id: index + 1,
      title,
      description,
      done: false,
      due: due.toISOString().slice(0, 10)
    };
  });
}

export default function Home() {
  const [goal, setGoal] = useState("");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [plan, setPlan] = useState<Plan | null>(null);
  const [reminder, setReminder] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("lifeflow-plan");
    if (raw) {
      try { setPlan(JSON.parse(raw)); } catch {}
    }
  }, []);

  useEffect(() => {
    if (plan) localStorage.setItem("lifeflow-plan", JSON.stringify(plan));
  }, [plan]);

  const progress = useMemo(() => {
    if (!plan || plan.tasks.length === 0) return 0;
    return Math.round(plan.tasks.filter(t => t.done).length / plan.tasks.length * 100);
  }, [plan]);

  function start() {
    if (!goal.trim()) return;
    setStep(1);
    setAnswers({});
  }

  function nextQuestion() {
    if (step < questions.length) setStep(step + 1);
    else generate();
  }

  function generate() {
    const tasks = createTasks(goal.trim(), answers);
    setPlan({ goal: goal.trim(), answers, tasks });
    setStep(6);
    setSaved(false);
  }

  function toggleTask(id: number) {
    setPlan(current => current ? {
      ...current,
      tasks: current.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    } : current);
  }

  function saveReminder() {
    if (!reminder || !plan) return;
    localStorage.setItem("lifeflow-reminder", reminder);
    setSaved(true);
  }

  function reset() {
    localStorage.removeItem("lifeflow-plan");
    localStorage.removeItem("lifeflow-reminder");
    setGoal("");
    setStep(0);
    setAnswers({});
    setPlan(null);
    setReminder("");
    setSaved(false);
  }

  return (
    <main>
      <nav className="nav">
        <div className="brand"><span>✦</span> LifeFlow</div>
        <div className="nav-pill">MVP • v1.0</div>
      </nav>

      <section className="hero">
        <div className="eyebrow">YOUR GOAL → YOUR NEXT STEPS</div>
        <h1>Stop wondering<br /><span>what to do next.</span></h1>
        <p>Tell LifeFlow what you want to accomplish. Answer a few questions and get a clear, personalized action plan.</p>
      </section>

      {!plan && (
        <section className="card">
          {step === 0 ? (
            <>
              <div className="step-label">STEP 1 OF 6</div>
              <h2>What are you trying to accomplish?</h2>
              <textarea value={goal} onChange={e => setGoal(e.target.value)}
                placeholder="Example: I want to get my first data analytics job..." />
              <button onClick={start} disabled={!goal.trim()}>Create my plan →</button>
              <div className="examples">
                <button onClick={() => setGoal("I want to learn a new professional skill")}>Learn a skill</button>
                <button onClick={() => setGoal("I want to find a new job")}>Find a job</button>
                <button onClick={() => setGoal("I want to start a small business")}>Start a business</button>
              </div>
            </>
          ) : (
            <>
              <div className="step-label">QUESTION {step} OF 5</div>
              <h2>{questions[step - 1].label}</h2>
              <input autoFocus value={answers[questions[step - 1].key] || ""}
                onChange={e => setAnswers({...answers, [questions[step - 1].key]: e.target.value})}
                placeholder={questions[step - 1].placeholder}
                onKeyDown={e => e.key === "Enter" && nextQuestion()} />
              <button onClick={nextQuestion}>Continue →</button>
              <button className="ghost" onClick={() => setStep(step - 1)}>← Back</button>
            </>
          )}
        </section>
      )}

      {plan && (
        <section className="dashboard">
          <div className="plan-head">
            <div>
              <div className="step-label">YOUR PERSONALIZED PLAN</div>
              <h2>{plan.goal}</h2>
              <p>Five practical steps generated from your answers.</p>
            </div>
            <button className="secondary" onClick={reset}>Start another goal</button>
          </div>

          <div className="progress-card">
            <div className="progress-top"><strong>{progress}% complete</strong><span>{plan.tasks.filter(t => t.done).length}/{plan.tasks.length} tasks</span></div>
            <div className="progress"><div style={{width: `${progress}%`}} /></div>
          </div>

          <div className="task-list">
            {plan.tasks.map(task => (
              <article className={`task ${task.done ? "done" : ""}`} key={task.id}>
                <button className="check" onClick={() => toggleTask(task.id)}>{task.done ? "✓" : ""}</button>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <small>Target: {task.due}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="reminder">
            <div>
              <div className="step-label">REMINDER</div>
              <h3>Keep yourself moving</h3>
              <p>Choose a date to remember your plan. V1 stores it in your browser.</p>
            </div>
            <div className="reminder-controls">
              <input type="date" value={reminder} onChange={e => {setReminder(e.target.value); setSaved(false)}} />
              <button onClick={saveReminder}>{saved ? "Saved ✓" : "Save reminder"}</button>
            </div>
          </div>
        </section>
      )}

      <footer>LifeFlow © 2026 • Built to turn confusion into action.</footer>
    </main>
  );
}
