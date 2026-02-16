import React from 'react';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: 'Information' },
    { id: 2, name: 'Payment' },
    { id: 3, name: 'Review' },
    { id: 4, name: 'Complete' },
  ];

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center sm:flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                    isComplete
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isCurrent
                      ? 'border-primary-600 text-primary-600 bg-white'
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="leading-tight">
                  <div
                    className={`text-xs font-medium ${
                      step.id <= currentStep ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  >
                    Step {step.id}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </div>
                </div>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`hidden sm:block flex-1 h-0.5 mx-4 ${
                    isComplete ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutSteps;