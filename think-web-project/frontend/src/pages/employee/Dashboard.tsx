import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { attendanceService } from '../../services/attendance.service'
import { useAuthStore } from '../../store/authStore'
import Clock from '../../components/common/Clock'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const employeeId = user?.employee?.id
  const [workDuration, setWorkDuration] = useState('7h 15m')

  const { data: todayAttendance } = useQuery(
    'today-attendance',
    () => attendanceService.getTodayAttendance(),
    { enabled: !!employeeId, refetchInterval: 5000 }
  )

  // Update work duration
  useEffect(() => {
    if (todayAttendance?.checked_in && !todayAttendance.checked_out) {
      const interval = setInterval(() => {
        const checkIn = new Date(todayAttendance.attendance.check_in_time)
        const now = new Date()
        const diff = now.getTime() - checkIn.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setWorkDuration(`${hours}h ${minutes}m`)
      }, 60000)
      return () => clearInterval(interval)
    }
  }, [todayAttendance])

  const attendanceChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Hours Worked',
        data: [8, 8.5, 7.5, 8, 8.25, 0, 0],
        borderColor: 'rgba(20, 184, 166, 1)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Hero / Welcome */}
      <header className="relative overflow-hidden rounded-3xl glass p-6 md:p-8 shadow-glow reveal">
        <div
          className="absolute inset-0 opacity-40 animate-shine"
          style={{
            backgroundImage: 'linear-gradient(90deg, var(--accent), rgba(255,255,255,0.2), var(--accent))',
            backgroundSize: '200% 100%',
          }}
        ></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/50 shadow-lg">
                {user?.employee?.first_name?.charAt(0) || user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                {user?.employee?.first_name || user?.username}!
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Today is <span>{currentDate}</span>
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  ID: {user?.employee?.employee_id || 'EMP-0000'}
                </span>
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                  {user?.employee?.department_id ? 'Department' : 'Employee'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl glass text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" title="Online"></span>
              <Clock />
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="glass rounded-3xl p-4 shadow reveal">
        <div className="flex flex-wrap justify-center gap-3">
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:airplane-takeoff-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">Apply Leave</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:file-text-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">View Payslip</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:calendar-blank-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">View Schedule</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:clock-counter-clockwise-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">Time Logs</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:certificate-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">Certificate</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-3 rounded-xl glass hover:shadow-glow transition hover-lift ripple w-24">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center text-white">
              <iconify-icon icon="ph:user-circle-duotone"></iconify-icon>
            </div>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Attendance Status */}
          <div className="glass rounded-3xl p-6 shadow reveal">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Attendance Status</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Checked In</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Checked Out</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-700 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <iconify-icon icon="ph:check-circle-duotone" className="text-white text-2xl"></iconify-icon>
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                  {todayAttendance?.checked_in ? 'Currently Checked In' : 'Not Checked In'}
                </h3>
                {todayAttendance?.checked_in ? (
                  <>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                      You checked in at{' '}
                      <span className="font-semibold">
                        {new Date(todayAttendance.attendance.check_in_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </p>
                    <p className="text-xs text-green-500 dark:text-green-500 mt-1">
                      Duration: <span>{workDuration}</span>
                    </p>
                    {!todayAttendance.checked_out && (
                      <button className="mt-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all ripple w-full">
                        Check Out Now
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">Ready to check in</p>
                )}
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Last Check-In</span>
                    <span className="text-xs text-gray-500">Today</span>
                  </div>
                  <p className="text-lg font-bold mt-1">
                    {todayAttendance?.checked_in
                      ? new Date(todayAttendance.attendance.check_in_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '--:--'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Hours This Week</span>
                    <span className="text-xs text-gray-500">Mon-Fri</span>
                  </div>
                  <p className="text-lg font-bold mt-1">38.5 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Snapshot */}
          <div className="glass rounded-3xl p-6 shadow reveal">
            <h2 className="text-xl font-bold mb-6">Attendance Snapshot</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3">
                  <iconify-icon icon="ph:check-circle-duotone" className="text-white text-xl"></iconify-icon>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Days Present</p>
                <p className="text-2xl font-bold mt-1">18</p>
                <p className="text-xs text-green-500 mt-1">This month</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-3">
                  <iconify-icon icon="ph:clock-duotone" className="text-white text-xl"></iconify-icon>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Late Arrivals</p>
                <p className="text-2xl font-bold mt-1">3</p>
                <p className="text-xs text-amber-500 mt-1">-2 from last month</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-3">
                  <iconify-icon icon="ph:prohibit-inset-duotone" className="text-white text-xl"></iconify-icon>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days</p>
                <p className="text-2xl font-bold mt-1">0</p>
                <p className="text-xs text-red-500 mt-1">Perfect record!</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3">
                  <iconify-icon icon="ph:trend-up-duotone" className="text-white text-xl"></iconify-icon>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">On-Time Rate</p>
                <p className="text-2xl font-bold mt-1">94%</p>
                <p className="text-xs text-blue-500 mt-1">Excellent!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Attendance Trend */}
          <div className="glass rounded-3xl p-6 shadow reveal">
            <h2 className="text-xl font-bold mb-4">Attendance Trend</h2>
            <div className="h-64">
              <Line data={attendanceChartData} options={chartOptions} />
            </div>
          </div>

          {/* Overtime & Work Hours */}
          <div className="glass rounded-3xl p-6 shadow reveal">
            <h2 className="text-xl font-bold mb-4">Overtime & Work Hours</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="text-lg font-bold">38.5h</span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overtime Hours</span>
                  <span className="text-lg font-bold">2.5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}