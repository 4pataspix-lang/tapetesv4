import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center rounded-full w-8 h-8 font-bold text-white transition-all duration-300
            ${idx < currentStep ? 'bg-green-500' : idx === currentStep ? 'bg-blue-600 scale-110 shadow-lg' : 'bg-gray-300'}`}
          >
            {idx + 1}
          </div>
          <div className="ml-2 mr-4 text-sm font-medium" style={{ minWidth: 80, color: idx <= currentStep ? '#111' : '#aaa' }}>{step}</div>
          {idx < steps.length - 1 && (
            <div className={`h-1 w-8 rounded transition-all duration-300 ${idx < currentStep ? 'bg-green-400' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
