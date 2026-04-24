import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { HIT_RATIO_HISTORY, CARRIER_PERFORMANCE, PRODUCERS, SEGMENT_HIT_RATIOS } from '../data/fakeData';
import { formatCurrency } from '../hooks/useQuotes';

// Blue-grey chart palette
const SEGMENT_COLORS = ['#0078D4', '#106EBE', '#2B6CB0', '#4B6EAF', '#005A9E'];
const SEGMENT_COLOR_MAP = Object.fromEntries(
  SEGMENT_HIT_RATIOS.map((s, idx) => [s.segment, SEGMENT_COLORS[idx % SEGMENT_COLORS.length]])
);

export default function AnalyticsPanel() {
  return (
    <div className="space-y-6">
      {/* Hit Ratio Trend */}
      <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-[#1A2B3C] mb-4">Hit Ratio Trend (YTD)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={HIT_RATIO_HISTORY} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D0DAE8" />
            <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#4A5E70' }} />
            <YAxis
              yAxisId="ratio"
              orientation="right"
              domain={[50, 80]}
              tick={{ fontSize: 12, fill: '#4A5E70' }}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis yAxisId="count" orientation="left" tick={{ fontSize: 12, fill: '#4A5E70' }} />
            <Tooltip
              contentStyle={{ border: '1px solid #D0DAE8', borderRadius: '4px', fontSize: 12 }}
              formatter={(value, name) => {
                const v = value as number;
                const n = name as string;
                if (n === 'hitRatio') return [`${v}%`, 'Hit Ratio'];
                if (n === 'won') return [v, 'Won'];
                if (n === 'submitted') return [v, 'Submitted'];
                return [v, n];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#4A5E70' }} />
            <Bar yAxisId="count" dataKey="submitted" fill="#C7E0F4" name="Submitted" />
            <Bar yAxisId="count" dataKey="won" fill="#0078D4" name="Won" />
            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="hitRatio"
              stroke="#0078D4"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              name="hitRatio"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Segment Hit Ratios */}
      <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-[#1A2B3C] mb-4">Hit Ratio by Segment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={SEGMENT_HIT_RATIOS} margin={{ top: 4, right: 16, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D0DAE8" />
              <XAxis
                dataKey="segment"
                tick={{ fontSize: 11, fill: '#4A5E70' }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#4A5E70' }} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ border: '1px solid #D0DAE8', borderRadius: '4px', fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Hit Ratio']}
              />
              <Bar dataKey="hitRatio" radius={[2, 2, 0, 0]} name="Hit Ratio">
                {SEGMENT_HIT_RATIOS.map((s, idx) => (
                  <Cell key={idx} fill={SEGMENT_COLOR_MAP[s.segment]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {SEGMENT_HIT_RATIOS.slice().sort((a, b) => b.hitRatio - a.hitRatio).map((s) => (
              <div key={s.segment} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: SEGMENT_COLOR_MAP[s.segment] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1A2B3C] truncate">{s.segment}</span>
                    <span className="text-sm font-bold text-[#1A2B3C] ml-2">{s.hitRatio}%</span>
                  </div>
                  <div className="w-full bg-[#EBF0F8] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${s.hitRatio}%`,
                        backgroundColor: SEGMENT_COLOR_MAP[s.segment],
                      }}
                    />
                  </div>
                  <div className="text-xs text-[#7A95AB] mt-0.5">
                    {s.won}W / {s.lost}L · Avg {formatCurrency(s.avgPremium)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrier Performance */}
        <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-[#1A2B3C] mb-4">Carrier Win Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#D0DAE8]">
                  {['Carrier', 'Win Rate', 'Avg. Premium', 'Avg Days', 'Won / Sub'].map((h) => (
                    <th
                      key={h}
                      className="pb-2 text-left text-xs text-[#7A95AB] font-semibold uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBF0F8]">
                {CARRIER_PERFORMANCE.sort((a, b) => b.hitRatio - a.hitRatio).map((c) => (
                  <tr key={c.carrierId} className="hover:bg-[#EDF5FF] transition-colors">
                    <td className="py-2.5 pr-3 font-medium text-[#1A2B3C]">{c.carrierName}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#EBF0F8] rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-[#0078D4]"
                            style={{ width: `${c.hitRatio}%` }}
                          />
                        </div>
                        <span className="text-[#1A2B3C] font-semibold">{c.hitRatio}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-[#4A5E70]">{formatCurrency(c.avgPremium)}</td>
                    <td className="py-2.5 pr-3 text-[#4A5E70]">{c.avgResponseDays}d</td>
                    <td className="py-2.5 text-[#4A5E70]">
                      {c.quotesWon}/{c.quotesReceived}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Producer Leaderboard */}
        <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
          <h2 className="font-semibold text-[#1A2B3C] mb-4">Producer Leaderboard</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={[...PRODUCERS].sort((a, b) => b.ytdPremium - a.ytdPremium)}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 80, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#D0DAE8" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#4A5E70' }} tickFormatter={(v) => `$${v / 1000}K`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#4A5E70' }} width={80} />
              <Tooltip
                contentStyle={{ border: '1px solid #D0DAE8', borderRadius: '4px', fontSize: 12 }}
                formatter={(v) => [formatCurrency(v as number), 'YTD Premium']}
              />
              <Bar dataKey="ytdPremium" fill="#0078D4" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hit Ratio by Producer */}
      <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-[#1A2B3C] mb-4">Hit Ratio by Producer</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...PRODUCERS].sort((a, b) => b.hitRatio - a.hitRatio).map((p) => (
            <div key={p.id} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{
                  color:
                    p.hitRatio >= 0.72
                      ? '#0078D4'
                      : p.hitRatio >= 0.65
                      ? '#106EBE'
                      : '#CA5010',
                }}
              >
                {Math.round(p.hitRatio * 100)}%
              </div>
              <div className="text-sm font-medium text-[#1A2B3C] mt-0.5">{p.name}</div>
              <div className="text-xs text-[#7A95AB]">{p.team}</div>
              <div className="text-xs text-[#4A5E70] mt-1">
                {p.quotesWon}W / {p.quotesLost}L / {p.quotesOpen} open
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
