import { useState, useRef } from 'react'
import { useQuery } from 'react-query'
import { api } from '../../services/api'
import Clock from '../../components/common/Clock'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('weekly')
  const attendanceChartRef = useRef<ChartJS<'line'>>(null)
  const trendChartRef = useRef<ChartJS<'bar'>>(null)
  const turnoverChartRef = useRef<ChartJS<'doughnut'>>(null)
  const overtimeChartRef = useRef<ChartJS<'bar'>>(null)
  const productivityChartRef = useRef<ChartJS<'radar'>>(null)
  const payrollChartRef = useRef<ChartJS<'line'>>(null)
  const salaryAttendanceChartRef = useRef<ChartJS<'scatter'>>(null)
  const leavePatternChartRef = useRef<ChartJS<'pie'>>(null)
  const peakAttendanceChartRef = useRef<ChartJS<'line'>>(null)
  const comparativeChartRef = useRef<ChartJS<'bar'>>(null)
  const salaryProjectionChartRef = useRef<ChartJS<'line'>>(null)
  const historicalChartRef = useRef<ChartJS<'line'>>(null)

  useQuery('analytics', async () => {
    try {
      const response = await api.get('/api/v1/analytics/dashboard')
      return response.data
    } catch {
      return {
        overallProductivity: 87.4,
        avgAttendanceRate: 94.2,
        overtimeCosts: 18400,
        aiConfidence: 92.7,
        attendanceTrend: [92, 93, 94, 93, 94, 95, 94],
        departmentComparison: {
          Engineering: 96.2,
          Sales: 92.1,
          Marketing: 89.4,
          HR: 91.8,
        }
      }
    }
  })

  // Chart data configurations
  const attendanceChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [92, 94, 93, 95, 96, 94],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Productivity',
        data: [85, 87, 86, 89, 90, 88],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  }

  const attendanceTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Present',
        data: [92, 94, 96, 93],
        backgroundColor: '#10b981',
      },
      {
        label: 'Absent',
        data: [5, 4, 2, 5],
        backgroundColor: '#ef4444',
      },
      {
        label: 'Late',
        data: [3, 2, 2, 2],
        backgroundColor: '#f59e0b',
      }
    ]
  }

  const turnoverChartData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  }

  const overtimeChartData = {
    labels: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'],
    datasets: [{
      label: 'Overtime Hours',
      data: [120, 85, 65, 45, 30],
      backgroundColor: '#8b5cf6',
    }]
  }

  const productivityChartData = {
    labels: ['Attendance', 'Punctuality', 'Output', 'Quality', 'Collaboration'],
    datasets: [
      {
        label: 'Sales',
        data: [85, 78, 92, 80, 75],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
      },
      {
        label: 'Engineering',
        data: [95, 92, 88, 94, 85],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
      }
    ]
  }

  const payrollChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 Forecast', 'Q2 Forecast'],
    datasets: [{
      label: 'Payroll Costs ($)',
      data: [450000, 465000, 480000, 495000, 510000, 525000],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderDash: [5, 5],
      tension: 0.3,
      fill: true
    }]
  }

  const salaryAttendanceChartData = {
    datasets: [{
      label: 'Employees',
      data: [
        {x: 85, y: 45000},
        {x: 92, y: 52000},
        {x: 78, y: 38000},
        {x: 95, y: 65000},
        {x: 88, y: 48000},
        {x: 90, y: 55000},
        {x: 82, y: 42000},
        {x: 96, y: 72000},
        {x: 87, y: 46000},
        {x: 94, y: 58000}
      ],
      backgroundColor: '#8b5cf6',
    }]
  }

  const leavePatternChartData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [{
      data: [12, 8, 6, 9, 18],
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
    }]
  }

  const peakAttendanceChartData = {
    labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
    datasets: [{
      label: 'Employee Count',
      data: [15, 85, 92, 88, 84, 76, 25],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.3,
      fill: true
    }]
  }

  const comparativeChartData = {
    labels: ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'],
    datasets: [
      {
        label: 'Attendance',
        data: [88, 92, 96, 94, 90],
        backgroundColor: '#10b981',
      },
      {
        label: 'Productivity',
        data: [82, 85, 92, 88, 86],
        backgroundColor: '#8b5cf6',
      }
    ]
  }

  const salaryProjectionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Actual',
        data: [450000, 465000, 480000, 495000, null, null, null, null],
        borderColor: '#10b981',
        tension: 0.3,
      },
      {
        label: 'Projected',
        data: [null, null, null, 495000, 510000, 525000, 540000, 555000],
        borderColor: '#8b5cf6',
        borderDash: [5, 5],
        tension: 0.3,
      }
    ]
  }

  const historicalChartData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Workforce Size',
        data: [120, 135, 142, 155, 168],
        borderColor: '#10b981',
        yAxisID: 'y',
        tension: 0.3,
      },
      {
        label: 'Absenteeism Rate',
        data: [8.2, 9.5, 7.8, 6.9, 5.4],
        borderColor: '#ef4444',
        yAxisID: 'y1',
        tension: 0.3,
      }
    ]
  }

  const stabilityGaugeData = {
    datasets: [{
      data: [87.4, 12.6],
      backgroundColor: ['#10b981', '#e5e7eb'],
      borderWidth: 0
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const stabilityGaugeOptions = {
    ...chartOptions,
    cutout: '75%',
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  }

  const scatterChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Attendance Rate (%)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Salary ($)'
        }
      }
    }
  }

  const historicalChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  }

  const radarChartOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        max: 100
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-glow">
        <div className="absolute inset-0 opacity-40 animate-shine" style={{
          backgroundImage: 'linear-gradient(90deg, var(--accent), rgba(255,255,255,0.2), var(--accent))',
          backgroundSize: '200% 100%',
        }}></div>
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              AI Workforce Analytics
            </h1>
            <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
              Advanced AI-powered insights into your workforce patterns and productivity
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl glass text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" title="Online"></span>
              <Clock />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Welcome, Admin</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-semibold">A</div>
          </div>
        </div>
      </header>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4 shadow transition hover:shadow-lg hover-lift">
          <div className="text-xs text-gray-500 dark:text-gray-400">Workforce Stability Index</div>
          <div className="mt-1 text-3xl font-extrabold">87.4%</div>
          <div className="text-sm text-green-500 flex items-center gap-1">
            <iconify-icon icon="ph:trend-up-duotone"></iconify-icon>
            <span>+2.3% from last month</span>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-4 shadow transition hover:shadow-lg hover-lift">
          <div className="text-xs text-gray-500 dark:text-gray-400">Absenteeism Risk</div>
          <div className="mt-1 text-3xl font-extrabold text-amber-600">12.7%</div>
          <div className="text-sm text-amber-500 flex items-center gap-1">
            <iconify-icon icon="ph:warning-duotone"></iconify-icon>
            <span>3 departments at risk</span>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-4 shadow transition hover:shadow-lg hover-lift">
          <div className="text-xs text-gray-500 dark:text-gray-400">Predictive Turnover</div>
          <div className="mt-1 text-3xl font-extrabold">8.2%</div>
          <div className="text-sm text-red-500 flex items-center gap-1">
            <iconify-icon icon="ph:trend-down-duotone"></iconify-icon>
            <span>+1.5% from last quarter</span>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-4 shadow transition hover:shadow-lg hover-lift">
          <div className="text-xs text-gray-500 dark:text-gray-400">AI Confidence</div>
          <div className="mt-1 text-3xl font-extrabold text-purple-600">96.4%</div>
          <div className="text-sm text-purple-500 flex items-center gap-1">
            <iconify-icon icon="ph:brain-duotone"></iconify-icon>
            <span>High accuracy</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Workforce Analytics Dashboard */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Workforce Analytics Dashboard</h2>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg glass text-sm ${timeRange === 'daily' ? 'bg-accent text-white' : ''}`} onClick={() => setTimeRange('daily')}>Daily</button>
                <button className={`p-2 rounded-lg glass text-sm ${timeRange === 'weekly' ? 'bg-accent text-white' : ''}`} onClick={() => setTimeRange('weekly')}>Weekly</button>
                <button className={`p-2 rounded-lg glass text-sm ${timeRange === 'monthly' ? 'bg-accent text-white' : ''}`} onClick={() => setTimeRange('monthly')}>Monthly</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Attendance</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">Productivity</p>
                <p className="text-2xl font-bold">88.7%</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">Overtime Hours</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400">Late Arrivals</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
            <div className="h-64">
              <Line ref={attendanceChartRef} data={attendanceChartData} options={chartOptions} />
            </div>
          </div>

          {/* Attendance Trend Analyzer */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Attendance Trend Analyzer</h2>
            <div className="h-64">
              <Bar ref={trendChartRef} data={attendanceTrendData} options={{...chartOptions, scales: { x: { stacked: true }, y: { stacked: true, max: 100 } }}} />
            </div>
          </div>

          {/* Absenteeism Risk Forecast */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Absenteeism Risk Forecast</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <iconify-icon icon="ph:users-three-duotone" className="text-red-500"></iconify-icon>
                  </div>
                  <div>
                    <p className="font-medium">Sales Department</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">High risk: 24%</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <iconify-icon icon="ph:users-three-duotone" className="text-amber-500"></iconify-icon>
                  </div>
                  <div>
                    <p className="font-medium">Marketing Department</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Medium risk: 16%</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <iconify-icon icon="ph:users-three-duotone" className="text-green-500"></iconify-icon>
                  </div>
                  <div>
                    <p className="font-medium">Engineering Department</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Low risk: 8%</p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Workforce Stability Index */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Workforce Stability Index</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <Doughnut data={stabilityGaugeData} options={stabilityGaugeOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">87.4%</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Stability</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Attendance</p>
                <p className="font-bold">92.1%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Schedule Adherence</p>
                <p className="font-bold">88.7%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Leave Consistency</p>
                <p className="font-bold">81.4%</p>
              </div>
            </div>
          </div>

          {/* Predictive Turnover Visualization */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Predictive Turnover Visualization</h2>
            <div className="h-64">
              <Doughnut ref={turnoverChartRef} data={turnoverChartData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'bottom' } }}} />
            </div>
          </div>

          {/* Overtime Utilization Insights */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Overtime Utilization Insights</h2>
            <div className="h-64">
              <Bar ref={overtimeChartRef} data={overtimeChartData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } }}} />
            </div>
          </div>

          {/* Departmental Productivity Comparison */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Departmental Productivity Comparison</h2>
            <div className="h-64">
              <Radar ref={productivityChartRef} data={productivityChartData} options={radarChartOptions} />
            </div>
          </div>

          {/* Payroll Cost Forecasting */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Payroll Cost Forecasting</h2>
            <div className="h-64">
              <Line ref={payrollChartRef} data={payrollChartData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } }}} />
            </div>
          </div>

          {/* Salary-to-Attendance Correlation */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Salary-to-Attendance Correlation</h2>
            <div className="h-64">
              <Scatter ref={salaryAttendanceChartRef} data={salaryAttendanceChartData} options={scatterChartOptions} />
            </div>
          </div>

          {/* Peak Attendance Window */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Peak Attendance Window</h2>
            <div className="h-64">
              <Line ref={peakAttendanceChartRef} data={peakAttendanceChartData} options={{...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } }}} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Leave Pattern Analytics */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Leave Pattern Analytics</h2>
            <div className="h-64">
              <Pie ref={leavePatternChartRef} data={leavePatternChartData} options={chartOptions} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                <p className="text-sm font-medium">Frequent Friday Absences</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">12 employees identified</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-sm font-medium">Extended Weekend Patterns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">7 employees identified</p>
              </div>
            </div>
          </div>

          {/* Late Arrival Heatmap */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Late Arrival Heatmap</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2">Mon</th>
                    <th className="p-2">Tue</th>
                    <th className="p-2">Wed</th>
                    <th className="p-2">Thu</th>
                    <th className="p-2">Fri</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-left">8:00-9:00</td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-red-500/80 rounded" title="12 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-red-500/60 rounded" title="9 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-amber-500/70 rounded" title="7 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-red-500/80 rounded" title="11 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-red-500/90 rounded" title="15 late arrivals"></div></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left">9:00-10:00</td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-amber-500/50 rounded" title="5 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/40 rounded" title="3 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/30 rounded" title="2 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-amber-500/60 rounded" title="6 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-amber-500/70 rounded" title="7 late arrivals"></div></td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left">10:00-11:00</td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/20 rounded" title="1 late arrival"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/10 rounded" title="0 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/10 rounded" title="0 late arrivals"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/20 rounded" title="1 late arrival"></div></td>
                    <td className="p-2"><div className="heat-cell w-8 h-8 mx-auto bg-green-500/30 rounded" title="2 late arrivals"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center mt-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/10 rounded"></div>
                <span className="text-xs">0-2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500/50 rounded"></div>
                <span className="text-xs">3-7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/80 rounded"></div>
                <span className="text-xs">8+</span>
              </div>
            </div>
          </div>

          {/* AI-Powered HR Insight Summaries */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">AI-Powered HR Insight Summaries</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <iconify-icon icon="ph:trend-up-duotone" className="text-blue-500 mt-1"></iconify-icon>
                  <div>
                    <p className="font-medium">Department A's attendance consistency improved by 12% this quarter.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">The implementation of flexible scheduling has shown positive results.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <iconify-icon icon="ph:warning-duotone" className="text-amber-500 mt-1"></iconify-icon>
                  <div>
                    <p className="font-medium">Sales team shows 24% higher absenteeism risk than company average.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Consider reviewing workload distribution and support resources.</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <iconify-icon icon="ph:check-circle-duotone" className="text-green-500 mt-1"></iconify-icon>
                  <div>
                    <p className="font-medium">Engineering department maintains 96% schedule adherence.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">This is 8% above the organizational benchmark.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Consistency Scorecard */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Employee Consistency Scorecard</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-3">Employee</th>
                    <th className="text-center p-3">Attendance</th>
                    <th className="text-center p-3">Punctuality</th>
                    <th className="text-center p-3">Consistency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Michael Chen</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">98%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">94%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">Excellent</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3">Sarah Johnson</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">92%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">88%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded-full">Good</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3">David Wilson</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">84%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="mr-2">76%</span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">Needs Improvement</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparative Analytics by Role/Department */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Comparative Analytics by Role/Department</h2>
            <div className="flex items-center gap-4 mb-4">
              <button className="px-4 py-2 rounded-lg glass text-sm bg-accent text-white">By Department</button>
              <button className="px-4 py-2 rounded-lg glass text-sm">By Role</button>
              <button className="px-4 py-2 rounded-lg glass text-sm">By Seniority</button>
            </div>
            <div className="h-64">
              <Bar ref={comparativeChartRef} data={comparativeChartData} options={chartOptions} />
            </div>
          </div>

          {/* Predictive Scheduling Assistance */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Predictive Scheduling Assistance</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <p className="font-medium">AI Recommendation for Next Week</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Based on historical patterns, we recommend adding 2 additional staff to the morning shift on Tuesday and Thursday.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <p className="text-sm font-medium">Optimal Shift Coverage</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                  <p className="text-sm font-medium">Understaffing Risk</p>
                  <p className="text-2xl font-bold">6%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Projection Dashboard */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Salary Projection Dashboard</h2>
            <div className="h-64">
              <Line ref={salaryProjectionChartRef} data={salaryProjectionChartData} options={chartOptions} />
            </div>
          </div>

          {/* Historical Workforce Timeline */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Historical Workforce Timeline</h2>
            <div className="h-64">
              <Line ref={historicalChartRef} data={historicalChartData} options={historicalChartOptions} />
            </div>
          </div>

          {/* Anomaly Detection Panel */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Anomaly Detection Panel</h2>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
                <iconify-icon icon="ph:warning-circle-duotone" className="text-red-500 mt-1 mr-3"></iconify-icon>
                <div>
                  <p className="font-medium">Duplicate attendance logs detected</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Employee ID 8472 has multiple check-ins within 5 minutes on 3 occasions this week.</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                <iconify-icon icon="ph:warning-duotone" className="text-amber-500 mt-1 mr-3"></iconify-icon>
                <div>
                  <p className="font-medium">Excessive absences flagged</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Department C shows 42% higher absence rate compared to last month.</p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <iconify-icon icon="ph:info-duotone" className="text-blue-500 mt-1 mr-3"></iconify-icon>
                <div>
                  <p className="font-medium">Payroll anomaly detected</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Unexpected 18% increase in overtime payments this pay period.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exportable Analytics Report Generator */}
          <div className="glass rounded-3xl p-6 shadow-lg reveal">
            <h2 className="text-xl font-bold mb-4">Exportable Analytics Report Generator</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
                  <iconify-icon icon="ph:file-pdf-duotone" className="text-3xl text-blue-500"></iconify-icon>
                  <p className="font-medium mt-2">PDF Report</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Formal presentation format</p>
                  <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm ripple">Generate PDF</button>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl text-center">
                  <iconify-icon icon="ph:file-csv-duotone" className="text-3xl text-green-500"></iconify-icon>
                  <p className="font-medium mt-2">CSV Data Export</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Raw data for analysis</p>
                  <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm ripple">Export CSV</button>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <p className="font-medium">Custom Report Options</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="include-charts" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3" defaultChecked />
                    <label htmlFor="include-charts" className="text-sm text-gray-700 dark:text-gray-300">Include charts and visualizations</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="include-ai-insights" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3" defaultChecked />
                    <label htmlFor="include-ai-insights" className="text-sm text-gray-700 dark:text-gray-300">Include AI-generated insights</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="include-raw-data" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3" />
                    <label htmlFor="include-raw-data" className="text-sm text-gray-700 dark:text-gray-300">Include raw data tables</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
