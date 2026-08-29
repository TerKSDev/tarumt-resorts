import { useState, useEffect } from "react";
import axios from "axios";
import { Hash, Search, Ticket, X, History } from "lucide-react";
import { Card, CardHeader } from "../../../../components/Card";

type GuestSearchBarProps = {
  setShowGuestDetail: (value: boolean) => void;
  setGuestData: (data: any) => void;
};

export default function GuestSearchBar({
  setShowGuestDetail,
  setGuestData,
}: GuestSearchBarProps) {
  const [confirmationNo, setConfirmationNo] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("confirmation_no");
    if (saved) setHistory(saved.split(",").filter(Boolean));
  }, []);

  const updateHistory = (searchNo: string) => {
    const saved = localStorage.getItem("confirmation_no");
    let searchesArray = saved ? saved.split(",").filter(Boolean) : [];
    searchesArray = searchesArray.filter((no) => no !== searchNo);
    searchesArray.unshift(searchNo);
    if (searchesArray.length > 5) searchesArray.pop();

    localStorage.setItem("confirmation_no", searchesArray.join(","));
    setHistory(searchesArray);
  };

  const performSearch = async (searchNo: string) => {
    const cleanNo = searchNo.trim().toUpperCase();
    setErrorMessage(null);

    if (!cleanNo || cleanNo.length !== 8 || !cleanNo.match(/^[0-9A-Z]{8}$/)) {
      setErrorMessage("Confirmation number must be exactly 8 alphanumeric characters.");
      return;
    }

    // Return cached data for instant retrieval if available
    if (cache[cleanNo]) {
      setGuestData(cache[cleanNo]);
      setShowGuestDetail(true);
      updateHistory(cleanNo);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8081/api/guest-search/${cleanNo}`,
      );
      const data = response.data;

      if (data) {
        setCache((prev) => ({ ...prev, [cleanNo]: data }));
        setGuestData(data);
        setShowGuestDetail(true);
        updateHistory(cleanNo);
        return;
      }

      setErrorMessage("No guest booking found matching this confirmation number.");
      setShowGuestDetail(false);
    } catch (error) {
      console.error("Error occurred when fetching guest data: ", error);
      setErrorMessage("No reservation record found or server unavailable.");
      setShowGuestDetail(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(confirmationNo);
  };

  return (
    <Card>
      <CardHeader
        title="Confirmation Identifier Lookup"
        subtitle="Enter the unique 8-character confirmation code to inspect live reservation status and folio ledger."
        icon={Ticket}
      />

      <div className="p-6 md:p-8 flex flex-col gap-5">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 sm:gap-4 sm:flex-row flex-col"
        >
          <div className="min-w-0 group flex items-center flex-1 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100 transition-all duration-200 bg-surface-50 border border-surface-200 rounded-2xl px-5 h-14 w-full gap-3 shadow-inner">
            <Hash
              size={18}
              strokeWidth={1.75}
              className="text-surface-400 group-focus-within:text-brand-700 transition-colors shrink-0"
            />
            <input
              value={confirmationNo}
              onChange={(e) => {
                setConfirmationNo(e.target.value.toUpperCase());
                setErrorMessage(null);
              }}
              id="confirmation-no"
              name="confirmation_no"
              type="text"
              placeholder="e.g. 8K9L2M4N"
              className="flex h-full tracking-[.25rem] font-mono outline-none flex-1 text-base placeholder:text-surface-400 placeholder:tracking-normal text-surface-950 bg-transparent font-semibold uppercase"
              required
              maxLength={8}
              minLength={8}
            />
            {confirmationNo && (
              <button
                type="button"
                onClick={() => {
                  setConfirmationNo("");
                  setErrorMessage(null);
                }}
                className="text-surface-400 hover:text-surface-700 p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 h-14 bg-surface-950 hover:bg-brand-950 text-white rounded-2xl font-semibold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0 ${
              isLoading ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Search size={16} strokeWidth={2} />
            )}
            <span>{isLoading ? "Searching Folio..." : "Verify Record"}</span>
          </button>
        </form>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-surface-100 border border-surface-300 text-xs text-surface-800 flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {history.length > 0 && (
          <div className="flex items-center gap-3 pt-1 border-t border-surface-100">
            <div className="flex items-center gap-1.5 text-[11px] text-surface-400 uppercase tracking-wider font-semibold shrink-0">
              <History size={13} />
              <span>Recent Queries:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {history.map((no) => (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmationNo(no);
                    performSearch(no);
                  }}
                  key={no}
                  className="text-xs font-mono font-semibold text-surface-700 hover:text-brand-900 bg-surface-100 hover:bg-brand-50 border border-surface-200 hover:border-brand-300 rounded-lg px-3 py-1 transition-all cursor-pointer"
                >
                  {no}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
