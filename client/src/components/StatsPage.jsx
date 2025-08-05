import React, { useState } from 'react';
import Header from './Header';
import PeriodSelector from './PeriodSelector';
import EmotionChart from './EmotionChart';

const StatsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('day');

  const emotionDataSets = {
    day: {
      happiness: [
        { label: '12 AM', value: -85 },
        { label: '6 AM', value: -70 },
        { label: '12 PM', value: 75 },
        { label: '6 PM', value: -65 },
      ],
      anger: [
        { label: '12 AM', value: 60 },
        { label: '6 AM', value: 45 },
        { label: '12 PM', value: -20 },
        { label: '6 PM', value: 80 },
      ],
      sadness: [
        { label: '12 AM', value: 70 },
        { label: '6 AM', value: 85 },
        { label: '12 PM', value: -40 },
        { label: '6 PM', value: 50 },
      ],
      joy: [
        { label: '12 AM', value: -60 },
        { label: '6 AM', value: -50 },
        { label: '12 PM', value: 90 },
        { label: '6 PM', value: -30 },
      ]
    },
    week: {
      happiness: [
        { label: 'MON', value: -85 },
        { label: 'TUE', value: -70 },
        { label: 'WED', value: 75 },
        { label: 'THU', value: -65 },
        { label: 'FRI', value: 10 },
        { label: 'SAT', value: 45 },
        { label: 'SUN', value: 15 }
      ],
      anger: [
        { label: 'MON', value: 90 },
        { label: 'TUE', value: 60 },
        { label: 'WED', value: -30 },
        { label: 'THU', value: 70 },
        { label: 'FRI', value: 20 },
        { label: 'SAT', value: -10 },
        { label: 'SUN', value: 5 }
      ],
      sadness: [
        { label: 'MON', value: 80 },
        { label: 'TUE', value: 75 },
        { label: 'WED', value: -20 },
        { label: 'THU', value: 65 },
        { label: 'FRI', value: 15 },
        { label: 'SAT', value: -25 },
        { label: 'SUN', value: 10 }
      ],
      joy: [
        { label: 'MON', value: -70 },
        { label: 'TUE', value: -55 },
        { label: 'WED', value: 85 },
        { label: 'THU', value: -45 },
        { label: 'FRI', value: 35 },
        { label: 'SAT', value: 60 },
        { label: 'SUN', value: 25 }
      ]
    },
    month: {
      happiness: [
        { label: '1', value: -60 },
        { label: '8', value: -40 },
        { label: '15', value: 20 },
        { label: '22', value: 45 },
        { label: '29', value: 30 }
      ],
      anger: [
        { label: '1', value: 50 },
        { label: '8', value: 35 },
        { label: '15', value: 10 },
        { label: '22', value: -20 },
        { label: '29', value: -10 }
      ],
      sadness: [
        { label: '1', value: 65 },
        { label: '8', value: 45 },
        { label: '15', value: 5 },
        { label: '22', value: -30 },
        { label: '29', value: -15 }
      ],
      joy: [
        { label: '1', value: -45 },
        { label: '8', value: -25 },
        { label: '15', value: 40 },
        { label: '22', value: 65 },
        { label: '29', value: 50 }
      ]
    },
    year: {
      happiness: [
        { label: 'JAN', value: -20 },
        { label: 'FEB', value: -10 },
        { label: 'MAR', value: 30 },
        { label: 'APR', value: 50 },
        { label: 'MAY', value: 45 },
        { label: 'JUN', value: 60 },
        { label: 'JUL', value: 70 },
        { label: 'AUG', value: 65 },
        { label: 'SEP', value: 40 },
        { label: 'OCT', value: 25 },
        { label: 'NOV', value: 10 },
        { label: 'DEC', value: -5 }
      ],
      anger: [
        { label: 'JAN', value: 40 },
        { label: 'FEB', value: 30 },
        { label: 'MAR', value: 10 },
        { label: 'APR', value: -20 },
        { label: 'MAY', value: -15 },
        { label: 'JUN', value: -30 },
        { label: 'JUL', value: -40 },
        { label: 'AUG', value: -35 },
        { label: 'SEP', value: -10 },
        { label: 'OCT', value: 5 },
        { label: 'NOV', value: 20 },
        { label: 'DEC', value: 35 }
      ],
      sadness: [
        { label: 'JAN', value: 45 },
        { label: 'FEB', value: 35 },
        { label: 'MAR', value: 15 },
        { label: 'APR', value: -15 },
        { label: 'MAY', value: -10 },
        { label: 'JUN', value: -25 },
        { label: 'JUL', value: -35 },
        { label: 'AUG', value: -30 },
        { label: 'SEP', value: -5 },
        { label: 'OCT', value: 10 },
        { label: 'NOV', value: 25 },
        { label: 'DEC', value: 40 }
      ],
      joy: [
        { label: 'JAN', value: -35 },
        { label: 'FEB', value: -25 },
        { label: 'MAR', value: 20 },
        { label: 'APR', value: 45 },
        { label: 'MAY', value: 40 },
        { label: 'JUN', value: 55 },
        { label: 'JUL', value: 65 },
        { label: 'AUG', value: 60 },
        { label: 'SEP', value: 35 },
        { label: 'OCT', value: 20 },
        { label: 'NOV', value: 5 },
        { label: 'DEC', value: -10 }
      ]
    }
  };

  const hamburger = "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 12H21M3 6H21M3 18H21' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

  return (
    <div style={{ padding: '20px 32px', paddingTop: '90px' }}>
      <Header 
        title="Analytics" 
        leftIcon={hamburger}
      />
      <PeriodSelector 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />
      <EmotionChart 
        selectedPeriod={selectedPeriod} 
        emotionDataSets={emotionDataSets} 
      />
    </div>
  );
};

export default StatsPage;