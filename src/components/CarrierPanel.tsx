import { CARRIERS, CARRIER_PERFORMANCE } from '../data/fakeData';
import { formatCurrency } from '../hooks/useQuotes';

export default function CarrierPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D0DAE8] rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-[#1A2B3C] mb-1">Carrier Appetite & Directory</h2>
        <p className="text-sm text-[#4A5E70] mb-4">
          Appetite overview for each carrier by business line.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D0DAE8]">
                {['Carrier', 'Appetite Lines', 'Avg Response', 'Hit Ratio', 'Avg Premium', 'Won / Sub'].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs text-[#7A95AB] font-semibold uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBF0F8]">
              {CARRIERS.map((carrier) => {
                const perf = CARRIER_PERFORMANCE.find((p) => p.carrierId === carrier.id);
                return (
                  <tr key={carrier.id} className="hover:bg-[#EDF5FF] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#1A2B3C]">{carrier.name}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {carrier.appetite.map((line) => (
                          <span
                            key={line}
                            className="text-xs bg-[#EDF5FF] text-[#0078D4] px-1.5 py-0.5 rounded"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-[#4A5E70]">{carrier.avgResponseDays}d</td>
                    <td className="py-3 pr-4">
                      {perf ? (
                        <span
                          className={`font-semibold ${
                            perf.hitRatio >= 70
                              ? 'text-[#107C10]'
                              : perf.hitRatio >= 65
                              ? 'text-[#0078D4]'
                              : 'text-[#CA5010]'
                          }`}
                        >
                          {perf.hitRatio}%
                        </span>
                      ) : (
                        <span className="text-[#B0C4D4]">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-[#4A5E70]">
                      {perf ? formatCurrency(perf.avgPremium) : '—'}
                    </td>
                    <td className="py-3 text-[#4A5E70]">
                      {perf ? `${perf.quotesWon}/${perf.quotesReceived}` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
