import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Wizard.css';

const Wizard = ({ steps, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else if (onComplete) {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save data here if needed
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="wizard">
      <div className="wizard-steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`wizard-step ${index === currentStep ? 'active' : ''}`}
          >
            {step.title}
          </div>
        ))}
      </div>
      <div className="wizard-content">
        <StepComponent formData={formData} onChange={handleChange} />
      </div>
      <div className="wizard-controls">
        <button onClick={handleBack} disabled={currentStep === 0}>
          Back
        </button>
        <button onClick={handleSave}>Save Progress</button>
        <button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

Wizard.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      component: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  onComplete: PropTypes.func,
};

Wizard.defaultProps = {
  onComplete: null,
};

export default Wizard;

//EXAMPLE////////////////////////////////////////////////////////////
import React from 'react';
import PropTypes from 'prop-types';

const Step1 = ({ formData, onChange }) => (
  <div>
    <h2>Step 1: Basic Information</h2>
    <label>
      Name:
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={onChange}
      />
    </label>
    <br />
    <label>
      Email:
      <input
        type="email"
        name="email"
        value={formData.email || ''}
        onChange={onChange}
      />
    </label>
  </div>
);

Step1.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Step1;
import React from 'react';
import PropTypes from 'prop-types';

const Step2 = ({ formData, onChange }) => (
  <div>
    <h2>Step 2: Address Information</h2>
    <label>
      Address:
      <input
        type="text"
        name="address"
        value={formData.address || ''}
        onChange={onChange}
      />
    </label>
    <br />
    <label>
      City:
      <input
        type="text"
        name="city"
        value={formData.city || ''}
        onChange={onChange}
      />
    </label>
    <br />
    <label>
      Zip Code:
      <input
        type="text"
        name="zipCode"
        value={formData.zipCode || ''}
        onChange={onChange}
      />
    </label>
  </div>
);

Step2.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Step2;
import React from 'react';
import ReactDOM from 'react-dom';
import Wizard from './Wizard';
import Step1 from './Step1';
import Step2 from './Step2';

const steps = [
  { title: 'Basic Info', component: Step1 },
  { title: 'Address', component: Step2 },
  // Add more steps here if needed
];

const App = () => {
  const handleComplete = (data) => {
    console.log('Wizard completed with data:', data);
  };

  return <Wizard steps={steps} onComplete={handleComplete} />;
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
