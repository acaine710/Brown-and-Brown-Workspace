import { CARRIERS, CARRIER_PERFORMANCE } from '../data/fakeData';
import { formatCurrency } from '../hooks/useQuotes';

export default function CarrierPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#EDEBE9] rounded-lg p-6 shadow-sm">
        <h2 className="font-semibold text-[#323130] mb-1">Carrier Appetite & Directory</h2>
        <p className="text-sm text-[#605E5C] mb-4">
          Appetite overview for each carrier by business line.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#EDEBE9]">
                {['Carrier', 'Appetite Lines', 'Avg Response', 'Hit Ratio', 'Avg Premium', 'Won / Sub'].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs text-[#A19F9D] font-semibold uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F2F1]">
              {CARRIERS.map((carrier) => {
                const perf = CARRIER_PERFORMANCE.find((p) => p.carrierId === carrier.id);
                return (
                  <tr key={carrier.id} className="hover:bg-[#EFF6FC] transition-colors">
                    <td className="py-3 pr-4 font-semibold text-[#323130]">{carrier.name}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {carrier.appetite.map((line) => (
                          <span
                            key={line}
                            className="text-xs bg-[#EFF6FC] text-[#0078D4] px-1.5 py-0.5 rounded"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-[#605E5C]">{carrier.avgResponseDays}d</td>
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
                        <span className="text-[#C8C6C4]">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-[#605E5C]">
                      {perf ? formatCurrency(perf.avgPremium) : '—'}
                    </td>
                    <td className="py-3 text-[#605E5C]">
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
