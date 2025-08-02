import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Address', 'Order Summary', 'Payment'];

export default function HorizontalLinearAlternativeLabelStepper({ activeStep }) {
  return (
    <Box sx={{ width: '100%', mb: 2, pt: 1 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          '& .MuiStepLabel-label': {
            fontSize: '0.75rem', // smaller label text
          },
          '& .MuiStepIcon-root': {
            width: 20,
            height: 20,
          },
          '& .MuiStepConnector-line': {
            minHeight: 1, // thinner line
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
