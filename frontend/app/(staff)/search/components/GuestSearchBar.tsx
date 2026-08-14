import axios from "axios";
import { Hash, Search, Ticket } from "lucide-react";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const saved = localStorage.getItem("confirmation_no");
    if (saved) setHistory(saved.split(","));
  }, []);

  const updateHistory = (searchNo: string) => {
    const saved = localStorage.getItem("confirmation_no");
    let searchesArray = saved ? saved.split(",") : [];
    searchesArray = searchesArray.filter((no) => no !== searchNo);
    searchesArray.unshift(searchNo);
    if (searchesArray.length > 4) searchesArray.pop();

    localStorage.setItem("confirmation_no", searchesArray.join(","));
    setHistory(searchesArray);
  };

  const performSearch = async (searchNo: string) => {
    if (!searchNo || searchNo.length !== 8 || !searchNo.match(/^[0-9]{8}$/)) {
      alert("Confirmation number must be 8 digits.");
      return;
    }

    // Return cached data for instant retrieval if available
    if (cache[searchNo]) {
      setGuestData(cache[searchNo]);
      setShowGuestDetail(true);
      updateHistory(searchNo);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8081/api/guest-search/${searchNo}`,
      );
      const guestData = response.data;

      if (guestData) {
        setCache((prev) => ({ ...prev, [searchNo]: guestData }));
        setGuestData(guestData);
        setShowGuestDetail(true);
        updateHistory(searchNo);
        return;
      }

      alert("No guest found with this confirmation number.");
      setShowGuestDetail(false);
    } catch (error) {
      console.error("Error occurred when fetching guest data: ", error);
      alert("Error fetching guest data. Please try again later.");
      setShowGuestDetail(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchGuest = async (formData: FormData) => {
    const searchNo = formData.get("confirmation_no") as string;
    await performSearch(searchNo);
  };

  return (
    <div className="flex flex-col rounded-xl gap-5 border p-4 md:p-6 border-surface-300 bg-surface-50">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center justify-center min-w-10.5 min-h-10.5 bg-brand-50 text-brand-600 rounded-xl">
          <Ticket size={20} />
        </div>
        <div className="flex flex-col gap-1.5 justify-between">
          <h2 className="text-base md:text-lg font-semibold leading-none">
            Confirmation Number Search
          </h2>
          <p className="text-xs md:text-sm text-surface-600 leading-tight">
            Enter the 8-digit confirmation number to check customer bookings and
            bills.
          </p>
        </div>
      </div>

      <form
        action={handleSearchGuest}
        className="flex items-center gap-2 sm:gap-4 sm:flex-row flex-col"
      >
        <div className="min-w-0 group flex items-center flex-1 focus-within:border-brand-600 focus-within:hover:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:shadow-sm transition-all duration-300 focus-within:scale-101 focus-within:bg-surface-50 shadow-xs bg-surface-100 border border-surface-300 hover:border-surface-400 rounded-xl px-4 h-12.5 w-full gap-2.5">
          <label
            htmlFor="confirmation-no"
            className="text-surface-500 bg-transparent"
          >
            <Hash
              size={16}
              className="mx-1 text-surface-600 group-focus-within:text-brand-600 transition-all duration-300 group-focus-within:-rotate-8 group-focus-within:scale-115"
            />
          </label>
          <input
            value={confirmationNo}
            onChange={(e) => setConfirmationNo(e.target.value)}
            id="confirmation-no"
            name="confirmation_no"
            type="text"
            placeholder="E.g. XXXXXXXX"
            className="flex h-14 mb-px placeholder:tracking-[.25rem] tracking-[.4rem] [transition-delay:9999s] [transition-property:background-color,color] tabular-nums slashed-zero outline-none flex-1 text-lg placeholder:text-surface-500 text-surface-800 bg-transparent"
            required
            pattern="[0-9]{8}"
            title="Confirmation number must be 8 digits"
            maxLength={8}
            minLength={8}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`max-sm:w-full flex items-center justify-center gap-2.5 px-6 h-12.5 bg-brand-500 hover:bg-brand-700 transition-all duration-300 cursor-pointer text-surface-50 rounded-xl font-medium uppercase tracking-wide mx-0 ${isLoading ? "opacity-75 cursor-wait" : ""}`}
        >
          <Search size={18} className={isLoading ? "animate-spin" : ""} />
          <p className="leading-none text-sm">
            {isLoading ? "Searching" : "Search"}
          </p>
        </button>
      </form>

      {history.length > 0 && (
        <div className="flex items-center gap-3 px-px -mt-1.5">
          <span className="text-xs text-surface-600 leading-none">
            Historical Searches:
          </span>
          <div className="flex items-center gap-2">
            {history.map((no, index) => (
              <button
                type="button"
                onClick={() => {
                  setConfirmationNo(no);
                  performSearch(no);
                }}
                key={index}
                className="text-xs leading-none font-medium shadow-xs text-surface-800 hover:border-brand-300 cursor-pointer hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 bg-surface-100 rounded-md border border-surface-300 px-2.5 py-1.5"
              >
                {no}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
