import axios from "axios";
import { Hash, Search, Ticket } from "lucide-react";
import { useState } from "react";

type GuestSearchBarProps = {
  showGuestDetail: boolean;
  setShowGuestDetail: (value: boolean) => void;
};

export default function GuestSearchBar({
  showGuestDetail,
  setShowGuestDetail,
}: GuestSearchBarProps) {
  const [confirmationNo, setConfirmationNo] = useState("");

  const handleSearchGuest = async (formData: FormData) => {
    const confirmationNo = formData.get("confirmation_no") as string;

    if (
      !confirmationNo ||
      confirmationNo.length !== 8 ||
      !confirmationNo.match(/^[0-9]{8}$/)
    ) {
      alert("Confirmation number must be 8 digits.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/api/guest-search/${confirmationNo}`,
      );
      const guestData = response.data;

      if (guestData) {
        setShowGuestDetail(true);
        return;
      }

      alert("No guest found with this confirmation number.");
      setShowGuestDetail(false);
    } catch (error) {
      console.error("Error occurred when fetching guest data: ", error);
      alert("Error fetching guest data. Please try again later.");
      setShowGuestDetail(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl gap-5 border p-6 border-surface-300 bg-surface-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10.5 h-10.5 bg-brand-50 text-brand-600 rounded-xl">
          <Ticket size={20} />
        </div>
        <div className="flex flex-col gap-1.5 justify-between">
          <h2 className="text-lg font-semibold leading-none">Guest Search</h2>
          <p className="text-sm text-surface-600 leading-tight">
            Enter the 8-digit confirmation number to check customer bookings and
            bills.
          </p>
        </div>
      </div>

      <form action={handleSearchGuest} className="flex items-center gap-4">
        <div className="group flex items-center flex-1 focus-within:border-brand-600 focus-within:hover:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600/20 focus-within:shadow-sm transition-all duration-300 focus-within:scale-101 focus-within:bg-surface-50 shadow-xs bg-surface-100 border border-surface-300 hover:border-surface-400 rounded-xl px-4 h-12.5">
          <label
            htmlFor="confirmation-no"
            className="text-surface-500 bg-transparent"
          >
            <Hash
              size={18}
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
            className="flex h-14 px-2.5 outline-none flex-1 text-base placeholder:text-surface-500 text-surface-800 bg-transparent"
            required
            pattern="[0-9]{8}"
            title="Confirmation number must be 8 digits"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2.5 px-6 h-12.5 bg-brand-500 hover:bg-brand-700 transition-all duration-300 cursor-pointer text-surface-50 rounded-xl font-medium uppercase tracking-wide"
        >
          <Search size={18} />
          <p className="leading-none text-sm">Search</p>
        </button>
      </form>
    </div>
  );
}
