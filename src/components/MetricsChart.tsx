import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
  } from 'recharts';
  
  export function MetricsChart() {
    return (
      <div className="border rounded p-4">
        <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
        <LineChart width={600} height={300} data={[]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
          <Line type="monotone" dataKey="latency" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }