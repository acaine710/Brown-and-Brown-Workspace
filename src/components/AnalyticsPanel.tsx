import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { HIT_RATIO_HISTORY, CARRIER_PERFORMANCE, PRODUCERS } from '../data/fakeData';
import { formatCurrency } from '../hooks/useQuotes';

export default function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      {/* Hit Ratio Trend */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">Hit Ratio Trend (YTD)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={HIT_RATIO_HISTORY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="ratio"
              orientation="right"
              domain={[50, 80]}
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis yAxisId="count" orientation="left" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name) => {
                const v = value as number;
                const n = name as string;
                if (n === 'hitRatio') return [`${v}%`, 'Hit Ratio'];
                if (n === 'won') return [v, 'Won'];
                if (n === 'submitted') return [v, 'Submitted'];
                return [v, n];
              }}
            />
            <Legend />
            <Bar yAxisId="count" dataKey="submitted" fill="#dbeafe" name="Submitted" />
            <Bar yAxisId="count" dataKey="won" fill="#6366f1" name="Won" />
            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="hitRatio"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="hitRatio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrier Performance */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Carrier Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Carrier', 'Hit %', 'Avg. Premium', 'Avg Days', 'Won / Sub'].map((h) => (
                    <th
                      key={h}
                      className="pb-2 text-left text-xs text-gray-400 font-semibold uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CARRIER_PERFORMANCE.sort((a, b) => b.hitRatio - a.hitRatio).map((c) => (
                  <tr key={c.carrierId} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-3 font-medium text-gray-800">{c.carrierName}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${c.hitRatio}%` }}
                          />
                        </div>
                        <span className="text-gray-700 font-semibold">{c.hitRatio}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-gray-600">{formatCurrency(c.avgPremium)}</td>
                    <td className="py-2.5 pr-3 text-gray-600">{c.avgResponseDays}d</td>
                    <td className="py-2.5 text-gray-600">
                      {c.quotesWon}/{c.quotesReceived}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Producer Leaderboard */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-800 mb-4">Producer Leaderboard</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={[...PRODUCERS].sort((a, b) => b.ytdPremium - a.ytdPremium)}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}K`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => [formatCurrency(v as number), 'YTD Premium']} />
              <Bar dataKey="ytdPremium" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segment Hit Ratio Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-4">Hit Ratio by Producer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...PRODUCERS].sort((a, b) => b.hitRatio - a.hitRatio).map((p) => (
            <div key={p.id} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  color:
                    p.hitRatio >= 0.72
                      ? '#10b981'
                      : p.hitRatio >= 0.65
                      ? '#6366f1'
                      : '#f59e0b',
                }}
              >
                {Math.round(p.hitRatio * 100)}%
              </div>
              <div className="text-sm font-medium text-gray-700 mt-0.5">{p.name}</div>
              <div className="text-xs text-gray-400">{p.team}</div>
              <div className="text-xs text-gray-500 mt-1">
                {p.quotesWon}W / {p.quotesLost}L / {p.quotesOpen} open
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
