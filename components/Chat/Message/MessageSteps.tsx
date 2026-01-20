
import React from 'react';

interface Step {
  name: string;
  isDone: boolean;
}

interface MessageStepsProps {
  steps: Step[];
}

const MessageSteps: React.FC<MessageStepsProps> = ({ steps }) => {
  return (
    <div className="mb-10 space-y-4">
      {steps.map((step, idx) => (
        <div key={idx} className={`flex items-center gap-4 bg-[#111] border rounded-2xl px-5 py-4 transition-all duration-700 ${step.isDone ? 'border-[#222] opacity-60' : 'border-red-500/40 shadow-[0_0_25px_rgba(255,77,77,0.15)] animate-pulse'}`}>
          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-all ${step.isDone ? 'bg-black border-[#333]' : 'bg-red-500/10 border-red-500/30'}`}>
            {step.isDone ? <i className="fa-solid fa-check text-[11px] text-green-400"></i> : <i className="fa-solid fa-circle-notch fa-spin text-[11px] text-[#ff4d4d]"></i>}
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black tracking-widest uppercase mb-0.5 ${step.isDone ? 'text-gray-600' : 'text-red-500/80'}`}>{step.isDone ? 'COMPLETED' : 'IN PROGRESS'}</span>
            <span className={`text-xs font-bold tracking-tight ${step.isDone ? 'text-gray-400' : 'text-white'}`}>{step.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSteps;
