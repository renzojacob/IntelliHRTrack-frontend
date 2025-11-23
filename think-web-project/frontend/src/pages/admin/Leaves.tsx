import { useState } from 'react'
import { useQuery, useMutation } from 'react-query'
import { api } from '../../services/api'
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
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Leaves() {
  const [activeTab, setActiveTab] = useState('requests')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  const { data: leaveData } = useQuery('leaves', async () => {
    try {
      const response = await api.get('/api/v1/leaves')
      return response.data
    } catch {
      return {
        pendingApprovals: 18,
        onLeaveToday: 24,
        policyViolations: 3,
        upcomingExpirations: 42,
        requests: [
          { id: 1, employee: 'Michael Chen', department: 'Engineering', leaveType: 'Vacation', dates: 'Dec 15 - Dec 22, 2023', duration: 8, status: 'pending' },
          { id: 2, employee: 'Emma Roberts', department: 'Marketing', leaveType: 'Sick Leave', dates: 'Dec 5 - Dec 7, 2023', duration: 3, status: 'approved' },
          { id: 3, employee: 'David Wilson', department: 'Sales', leaveType: 'Emergency', dates: 'Dec 10 - Dec 10, 2023', duration: 1, status: 'pending' },
        ],
        leaveTypes: [
          { name: 'Vacation Leave', code: 'VL', maxDays: 15, used: 12.5 },
          { name: 'Sick Leave', code: 'SL', maxDays: 10, used: 3 },
          { name: 'Personal Days', code: 'PD', maxDays: 5, used: 5 },
        ]
      }
    }
  })

  const leaveTypeChartData = {
    labels: ['Vacation', 'Sick Leave', 'Emergency', 'Personal'],
    datasets: [{
      data: [45, 28, 12, 15],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
    }],
  }

  const leaveTrendChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Leave Requests',
      data: [12, 15, 18, 14, 16, 20, 22, 19, 17, 21, 18, 24],
      borderColor: 'rgba(20, 184, 166, 1)',
      backgroundColor: 'rgba(20, 184, 166, 0.1)',
      tension: 0.4,
    }],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
    },
  }

  const handleApprove = (id: number) => {
    // Handle approval
    console.log('Approve leave:', id)
  }

  const handleDeny = (id: number) => {
    // Handle denial
    console.log('Deny leave:', id)
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <header id="section-top" className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-glow">
        <div className="absolute inset-0 opacity-40 animate-shine" style={{
          backgroundImage: 'linear-gradient(90deg, var(--accent), rgba(255,255,255,0.2), var(--accent))',
          backgroundSize: '200% 100%',
        }}></div>
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Leave & Absences — Manager Console
            </h2>
            <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
              Approve policies and requests, plan blackout periods, and keep balance in check.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-glow transition flex items-center justify-center gap-2">
              <iconify-icon icon="ph:robot-duotone"></iconify-icon>
              AI Assistant
            </button>
            <button className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 hover:shadow-glow transition flex items-center justify-center gap-2">
              <iconify-icon icon="ph:bell-duotone" className="text-accent"></iconify-icon>
              Alerts
            </button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 shadow hover:shadow-glow transition">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-500">Pending Approvals</div>
              <div className="text-2xl font-extrabold mt-1">{leaveData?.pendingApprovals || 18}</div>
              <div className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <iconify-icon icon="ph:clock-duotone" className="mr-1"></iconify-icon>
                Requires attention
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/90 text-white flex items-center justify-center">⏱</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 shadow hover:shadow-glow transition">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-500">On Leave Today</div>
              <div className="text-2xl font-extrabold mt-1">{leaveData?.onLeaveToday || 24}</div>
              <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <iconify-icon icon="ph:calendar-duotone" className="mr-1"></iconify-icon>
                4.2% of workforce
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600/90 text-white flex items-center justify-center">🏝</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 shadow hover:shadow-glow transition">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-500">Policy Violations</div>
              <div className="text-2xl font-extrabold mt-1">{leaveData?.policyViolations || 3}</div>
              <div className="text-xs text-rose-600 mt-2 flex items-center gap-1">
                <iconify-icon icon="ph:warning-duotone" className="mr-1"></iconify-icon>
                Needs review
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-600/90 text-white flex items-center justify-center">🚫</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 shadow hover:shadow-glow transition">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-500">Upcoming Expirations</div>
              <div className="text-2xl font-extrabold mt-1">{leaveData?.upcomingExpirations || 42}</div>
              <div className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                <iconify-icon icon="ph:clock-countdown-duotone" className="mr-1"></iconify-icon>
                Within 30 days
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-600/90 text-white flex items-center justify-center">⌛</div>
          </div>
        </div>
      </section>

      {/* Tabs + Action Bar */}
      <section className="glass rounded-2xl shadow overflow-hidden">
        <div className="border-b border-white/40 dark:border-white/10">
          <nav className="flex overflow-x-auto -mb-px">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-6 border-b-2 font-medium flex items-center whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <iconify-icon icon="ph:inbox-duotone" className="mr-2"></iconify-icon>
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-6 border-b-2 font-medium flex items-center whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <iconify-icon icon="ph:calendar-duotone" className="mr-2"></iconify-icon>
              Leave Calendar
            </button>
            <button
              onClick={() => setActiveTab('policies')}
              className={`py-4 px-6 border-b-2 font-medium flex items-center whitespace-nowrap ${
                activeTab === 'policies'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <iconify-icon icon="ph:gear-six-duotone" className="mr-2"></iconify-icon>
              Policy Builder
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 border-b-2 font-medium flex items-center whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <iconify-icon icon="ph:chart-pie-duotone" className="mr-2"></iconify-icon>
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`py-4 px-6 border-b-2 font-medium flex items-center whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <iconify-icon icon="ph:file-text-duotone" className="mr-2"></iconify-icon>
              Documentation
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                  <h3 className="text-xl font-bold">Pending Leave Requests</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Review, approve or decline employee leave requests
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-glow transition flex items-center gap-2">
                    <iconify-icon icon="ph:plus-duotone"></iconify-icon>
                    Create Policy
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 hover:shadow-glow transition flex items-center gap-2">
                    <iconify-icon icon="ph:arrow-square-out-duotone"></iconify-icon>
                    Export
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 hover:shadow-glow transition flex items-center gap-2">
                    <iconify-icon icon="ph:upload-duotone"></iconify-icon>
                    Bulk Import
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-white/80 dark:bg-slate-900/50 border border-white/40 dark:border-white/10 hover:shadow-glow transition flex items-center gap-2">
                    <iconify-icon icon="ph:robot-duotone"></iconify-icon>
                    AI Check
                  </button>
                </div>
              </div>

              {/* Leave Requests Table */}
              <div className="glass rounded-xl border border-white/40 dark:border-white/10 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/40 dark:divide-white/10">
                    <thead className="bg-white/60 dark:bg-slate-800/60">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Employee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40 dark:divide-white/10">
                      {leaveData?.requests?.map((req: any) => (
                        <tr key={req.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {req.employee.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium">{req.employee}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{req.department}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              req.leaveType === 'Vacation' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              req.leaveType === 'Sick Leave' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' :
                              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            }`}>
                              {req.leaveType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{req.dates}</div>
                            <div className="text-xs text-gray-500">{req.duration} days</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{req.duration} days</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              req.status === 'approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                              req.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {req.status === 'approved' ? 'Approved' : req.status === 'pending' ? 'Pending' : 'Denied'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2 flex-wrap">
                              {req.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(req.id)}
                                    className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-lg"
                                  >
                                    <iconify-icon icon="ph:check-fat" className="mr-1"></iconify-icon>
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleDeny(req.id)}
                                    className="text-rose-600 hover:text-rose-800 bg-rose-50 dark:bg-rose-900/30 px-3 py-1 rounded-lg"
                                  >
                                    <iconify-icon icon="ph:x" className="mr-1"></iconify-icon>
                                    Deny
                                  </button>
                                </>
                              )}
                              <button className="text-blue-600 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                                <iconify-icon icon="ph:eye" className="mr-1"></iconify-icon>
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Leave Balance + Blackout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
                <div className="glass rounded-xl p-6 border border-white/40 dark:border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Leave Balance Overview</h3>
                  <div className="space-y-4">
                    {leaveData?.leaveTypes?.map((lt: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">{lt.name}</span>
                          <span className="font-medium">{lt.used} / {lt.maxDays} days</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${
                              idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-rose-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${(lt.used / lt.maxDays) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-6 border border-white/40 dark:border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Blackout Periods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
                      <div>
                        <p className="font-medium">Year-End Closing</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Dec 25 - Jan 2</p>
                      </div>
                      <span className="px-2 py-1 bg-rose-100 dark:bg-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-full">No Leave</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                      <div>
                        <p className="font-medium">Audit Period</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Jan 15 - Jan 30</p>
                      </div>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full">Restricted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Team Leave Calendar — <span>Month</span></h3>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg glass">Prev</button>
                  <button className="px-3 py-2 rounded-lg glass">Today</button>
                  <button className="px-3 py-2 rounded-lg glass">Next</button>
                </div>
              </div>
              <div className="glass rounded-xl border border-white/40 dark:border-white/10 overflow-hidden">
                <div className="grid grid-cols-7 text-center text-xs font-medium bg-white/50 dark:bg-slate-800/50">
                  <div className="p-2">Mon</div>
                  <div className="p-2">Tue</div>
                  <div className="p-2">Wed</div>
                  <div className="p-2">Thu</div>
                  <div className="p-2">Fri</div>
                  <div className="p-2">Sat</div>
                  <div className="p-2">Sun</div>
                </div>
                <div className="grid grid-cols-7 gap-0 divide-x divide-y divide-white/40 dark:divide-white/10">
                  {Array.from({ length: 35 }).map((_, idx) => (
                    <div key={idx} className="p-2 min-h-[60px] bg-white/30 dark:bg-gray-800/30">
                      <div className="text-xs text-gray-500">{idx + 1}</div>
                      {idx % 7 === 3 && (
                        <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded px-1">
                          John D.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Policy Builder Tab */}
          {activeTab === 'policies' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-4 border border-white/40 dark:border-white/10">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <iconify-icon icon="ph:sliders-duotone" className="text-accent"></iconify-icon>
                    Create Policy
                  </h3>
                  <form className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500">Name</label>
                      <input type="text" required className="mt-1 w-full px-3 py-2 rounded-lg border border-white/40 dark:border-white/10 glass" placeholder="e.g., Vacation Policy" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Accrual rate (days/year)</label>
                        <input type="number" step="0.5" min="0" className="mt-1 w-full px-3 py-2 rounded-lg border border-white/40 dark:border-white/10 glass" defaultValue="20" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Carryover limit (days)</label>
                        <input type="number" step="0.5" min="0" className="mt-1 w-full px-3 py-2 rounded-lg border border-white/40 dark:border-white/10 glass" defaultValue="5" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Eligible roles (comma separated)</label>
                      <input type="text" className="mt-1 w-full px-3 py-2 rounded-lg border border-white/40 dark:border-white/10 glass" placeholder="Full-time, Part-time" />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="w-4 h-4" />
                      Require medical documents for Sick Leave
                    </label>
                    <div className="flex gap-2 justify-end">
                      <button type="reset" className="px-3 py-2 rounded-lg glass">Clear</button>
                      <button type="submit" className="px-3 py-2 rounded-lg text-white gradient-accent">Save Policy</button>
                    </div>
                  </form>
                </div>
                <div className="lg:col-span-2 glass rounded-xl p-4 border border-white/40 dark:border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Saved Policies</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 rounded-lg glass text-sm">Export JSON</button>
                      <button className="px-3 py-2 rounded-lg glass text-sm">Import JSON</button>
                      <button className="px-3 py-2 rounded-lg glass text-sm">Clear All</button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Vacation Leave Policy</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">20 days/year, 5 days carryover</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded-lg glass text-sm">Edit</button>
                          <button className="px-3 py-1 rounded-lg glass text-sm">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-xl p-4 border border-white/40 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Leave Type Distribution</h3>
                    <button className="px-3 py-2 rounded-lg glass text-sm">Recompute</button>
                  </div>
                  <div className="h-64">
                    <Pie data={leaveTypeChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="glass rounded-xl p-4 border border-white/40 dark:border-white/10">
                  <h3 className="font-semibold mb-2">Monthly Leave Trend</h3>
                  <div className="h-64">
                    <Bar data={leaveTrendChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === 'docs' && (
            <div>
              <div className="glass rounded-xl p-6 border border-white/40 dark:border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <iconify-icon icon="ph:file-text-duotone" className="text-accent text-2xl"></iconify-icon>
                  <h3 className="text-lg font-semibold">Leave Management Documentation</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>This module handles all leave-related operations including request management, policy configuration, and analytics.</p>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Leave request approval workflow</li>
                      <li>Policy builder with accrual rules</li>
                      <li>Leave calendar visualization</li>
                      <li>Balance tracking and expiration alerts</li>
                      <li>Analytics and reporting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
