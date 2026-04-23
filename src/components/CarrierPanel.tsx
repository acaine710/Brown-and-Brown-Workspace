import { CARRIERS, CARRIER_PERFORMANCE } from '../data/fakeData';
import { formatCurrency } from '../hooks/useQuotes';

export default function CarrierPanel() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-800 mb-1">Carrier Appetite & Directory</h2>
        <p className="text-sm text-gray-500 mb-4">
          Appetite overview for each carrier by business line.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Carrier', 'Appetite Lines', 'Avg Response', 'Hit Ratio', 'Avg Premium', 'Won / Sub'].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs text-gray-400 font-semibold uppercase tracking-wide pr-4"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {CARRIERS.map((carrier) => {
                const perf = CARRIER_PERFORMANCE.find((p) => p.carrierId === carrier.id);
                return (
                  <tr key={carrier.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-semibold text-gray-800">{carrier.name}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {carrier.appetite.map((line) => (
                          <span
                            key={line}
                            className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full"
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{carrier.avgResponseDays}d</td>
                    <td className="py-3 pr-4">
                      {perf ? (
                        <span
                          className={`font-semibold ${
                            perf.hitRatio >= 70
                              ? 'text-emerald-600'
                              : perf.hitRatio >= 65
                              ? 'text-blue-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {perf.hitRatio}%
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {perf ? formatCurrency(perf.avgPremium) : '—'}
                    </td>
                    <td className="py-3 text-gray-600">
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
