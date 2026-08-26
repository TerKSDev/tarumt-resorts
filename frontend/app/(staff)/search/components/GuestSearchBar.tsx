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
    if (
      !searchNo ||
      searchNo.length !== 8 ||
      !searchNo.match(/^[0-9A-Z]{8}$/)
    ) {
      alert("Confirmation number must be 8 alphanumeric characters.");
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
    <div className="flex flex-col rounded-3xl gap-6 border p-6 md:p-8 border-surface-200 bg-white shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 border border-surface-100 bg-surface-50 text-surface-600 rounded-full shadow-sm">
          <Ticket size={20} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-serif text-surface-900 tracking-wide leading-none">
            Confirmation Number Search
          </h2>
          <p className="text-xs text-surface-500 font-light leading-tight">
            Enter the 8-digit confirmation number to check customer bookings and bills.
          </p>
        </div>
      </div>

      <form
        action={handleSearchGuest}
        className="flex items-center gap-3 sm:gap-4 sm:flex-row flex-col"
      >
        <div className="min-w-0 group flex items-center flex-1 focus-within:border-surface-400 focus-within:ring-1 focus-within:ring-surface-400/20 focus-within:shadow-md transition-all duration-300 focus-within:bg-white shadow-xs bg-surface-50 border border-surface-200 hover:border-surface-300 rounded-full px-5 h-14 w-full gap-3">
          <label
            htmlFor="confirmation-no"
            className="text-surface-400 bg-transparent flex items-center"
          >
            <Hash
              size={18}
              strokeWidth={1.5}
              className="text-surface-400 group-focus-within:text-surface-700 transition-colors"
            />
          </label>
          <input
            value={confirmationNo}
            onChange={(e) => setConfirmationNo(e.target.value)}
            id="confirmation-no"
            name="confirmation_no"
            type="text"
            placeholder="E.g. XXXXXXXX"
            className="flex h-full mb-px placeholder:tracking-[.25rem] tracking-[.4rem] delay-[9999s] [transition-property:background-color,color] tabular-nums slashed-zero outline-none flex-1 text-lg placeholder:text-surface-400 text-surface-800 bg-transparent font-medium"
            required
            pattern="^[a-zA-Z0-9]{8}$"
            title="Confirmation Number must be 8 alphanumeric characters."
            maxLength={8}
            minLength={8}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`max-sm:w-full flex items-center justify-center gap-2.5 px-8 h-14 bg-surface-900 hover:bg-surface-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-white rounded-full font-medium uppercase tracking-widest mx-0 ${isLoading ? "opacity-75 cursor-wait" : ""}`}
        >
          <Search size={16} strokeWidth={1.5} className={isLoading ? "animate-spin" : ""} />
          <p className="leading-none text-xs">
            {isLoading ? "Searching" : "Search"}
          </p>
        </button>
      </form>

      {history.length > 0 && (
        <div className="flex items-center gap-3 px-2 -mt-2">
          <span className="text-[10px] text-surface-400 uppercase tracking-widest font-semibold leading-none">
            Recent:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {history.map((no, index) => (
              <button
                type="button"
                onClick={() => {
                  setConfirmationNo(no);
                  performSearch(no);
                }}
                key={index}
                className="text-[10px] leading-none font-medium shadow-xs text-surface-600 hover:border-surface-400 cursor-pointer hover:text-surface-900 hover:bg-white transition-all duration-300 bg-surface-50 rounded-full border border-surface-200 px-3 py-1.5 uppercase tracking-widest"
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
