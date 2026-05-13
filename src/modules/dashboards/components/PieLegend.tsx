import React from 'react';

interface PieLegendProps {
  labels: string[];
  colors: string[];
  values: number[];
  capitalizeLabels?: boolean;
}

const PieLegend: React.FC<PieLegendProps> = ({ labels, colors, values, capitalizeLabels }) => (
  <ul className="dashboard-pie-legend text-sm mt-2 grid grid-cols-2 gap-x-4 gap-y-2 w-full">
    {labels.map((label, i) => (
      <li key={label} className="flex items-center gap-2 text-base">
        <span className="inline-block w-4 h-4 rounded mr-2" style={{ background: colors[i] }}></span>
        <span>{capitalizeLabels ? label.charAt(0).toUpperCase() + label.slice(1) : label}:</span>
        <span className="font-bold text-lg">{values[i]}</span>
      </li>
    ))}
  </ul>
);

export default PieLegend;
