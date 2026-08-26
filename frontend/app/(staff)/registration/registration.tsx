import { CircleCheckBig, IdCard, ListTodo, Search, UserRound, Users } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import ReportGeneration from "./components/ReportGeneration";

type QueueItem = {
  id?: string;
  name: string;
  identityNo: string;
  guests: number;
  checkIn?: string;
};

const CANCELLATION_REASONS = [
  { value: "GUEST_REQUEST", label: "Guest Request" },
  { value: "DUPLICATE_ENTRY", label: "Duplicate Entry" },
  { value: "NO_SHOW", label: "No Show" },
  { value: "PAYMENT_ISSUE", label: "Payment Issue" },
  { value: "OTHER", label: "Other" },
];


const formatIdentityNo = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);

  if (digits.length <= 6) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;

  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
};

const formatCheckInTime = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-MY", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function RegistrationPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [name, setName] = useState("");
  const [identityNo, setIdentityNo] = useState("");
  const [guests, setGuests] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0].value);

  const fetchQueue = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/registration/queue");
      if (res.ok) {
        const data = (await res.json()) as QueueItem[];
        setQueue(data);
      }
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  };

  const filteredQueue = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return queue.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || statusFilter === "pending";
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.identityNo.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [queue, searchTerm, statusFilter]);

  const validateRegistrationForm = () => {
    const trimmedName = name.trim();
    const trimmedIdentityNo = identityNo.trim();

    if (trimmedName.length < 2) {
      alert("Guest name must be at least 2 characters long.");
      return false;
    }

    if (!/^[A-Za-z\s\-'.]+$/u.test(trimmedName)) {
      alert("Guest name can only contain letters, spaces, hyphen, apostrophe, and dot.");
      return false;
    }

    if (!/^\d{6}-\d{2}-\d{4}$/u.test(trimmedIdentityNo)) {
      alert("Identity number format must be like 990101-14-5566.");
      return false;
    }

    const duplicateGuest = queue.some(
      (item) => item.identityNo === trimmedIdentityNo,
    );

    if (duplicateGuest) {
      alert("This identity number is already in the queue.");
      return false;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      alert("Guests must be a whole number between 1 and 10.");
      return false;
    }

    return true;
  };

  const processGuestById = async (queueId?: string) => {
    if (!queueId) {
      alert("Unable to process the selected guest because the queue id is missing.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/registration/queue/assign-room/${queueId}`,
        {
          method: "POST",
        },
      );

      if (res.ok) {
        await fetchQueue();
        alert("Guest checked in successfully.");
      } else {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error("Error processing queue item:", err);
      alert("Unable to process queue item right now.");
    }
  };

  const cancelGuestById = async (queueId?: string) => {
    if (!queueId) {
      alert("Unable to cancel the selected guest because the queue id is missing.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/registration/queue/cancel/${queueId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: cancelReason }),
        },
      );

      if (res.ok) {
        setCancellingId(null);
        await fetchQueue();
        alert("Guest registration cancelled.");
      } else {
        const errorText = await res.text();
        alert(`Error: ${errorText}`);
      }
    } catch (err) {
      console.error("Error cancelling queue item:", err);
      alert("Unable to cancel queue item right now.");
    }
  };

  const registerGuest = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!validateRegistrationForm()) {
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8081/api/registration/queue/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            identityNo: identityNo.trim(),
            guests,
          }),
        },
      );

      if (res.ok) {
        setName("");
        setIdentityNo("");
        setGuests(1);
        await fetchQueue();
        alert("Guest registered successfully.");
      } else {
        const errorMsg = await res.text();
        alert(`Server error (${res.status}): ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error enqueueing guest via RegistrationBoundary:", err);
      alert("Unable to register guest right now. Please try again.");
    }
  };

  useEffect(() => {
    void fetchQueue();
  }, []);

  return (
    <section className="flex flex-col gap-6 p-6">
      <div className="flex flex-col rounded-xl border border-surface-300 bg-surface-50">
        <div className="flex items-center justify-between gap-2 p-4 md:p-6 border-b border-surface-300">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center justify-center w-10.5 h-10.5 bg-green-50 text-green-600 rounded-xl">
              <CircleCheckBig size={20} />
            </div>
            <div className="flex flex-col gap-1.5 justify-between">
              <p className="text-xs md:text-sm text-surface-600 leading-tight">
                Walk-In Registration
              </p>
              <h2 className="text-base md:text-lg tracking-wider font-semibold leading-none">
                Customer Register
              </h2>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => void registerGuest(e)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 md:p-6"
        >
          <label className="flex flex-col gap-3 border-r border-surface-300 border-b p-2 md:p-4">
            <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
              <UserRound size={14} className="text-surface-600" />
              <span className="leading-none">Guest Name</span>
            </div>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter guest name"
              className="rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600/20"
            />
          </label>

          <label className="flex flex-col gap-3 border-r border-surface-300 border-b p-2 md:p-4">
            <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
              <IdCard size={14} className="text-surface-600" />
              <span className="leading-none">Identity Number</span>
            </div>
            <input
              required
              value={identityNo}
              onChange={(e) => setIdentityNo(formatIdentityNo(e.target.value))}
              placeholder="YYMMDD-XX-XXXX"
              maxLength={14}
              className="rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600/20"
            />
          </label>

          <label className="flex flex-col gap-3 border-r border-surface-300 border-b p-2 md:p-4">
            <div className="flex items-center gap-1.5 text-sm text-surface-600 leading-none">
              <Users size={14} className="text-surface-600" />
              <span className="leading-none">Number of Guests</span>
            </div>
            <input
              required
              type="number"
              min={1}
              max={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600/20"
            />
          </label>

          <div className="md:col-span-3 flex justify-end p-2 md:p-4">
            <button
              type="submit"
              className="rounded-xl bg-brand-500 hover:bg-brand-700 transition-all duration-300 cursor-pointer px-6 py-2.5 text-sm font-medium text-surface-50"
            >
              Register Guest
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col rounded-xl border border-surface-300 bg-surface-50">
        <div className="flex items-center justify-between gap-2 p-4 md:p-6 border-b border-surface-300">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center justify-center w-10.5 h-10.5 bg-brand-50 text-brand-600 rounded-xl">
              <ListTodo size={20} />
            </div>
            <div className="flex flex-col gap-1.5 justify-between">
              <p className="text-xs md:text-sm text-surface-600 leading-tight">
                Registration Queue
              </p>
              <h2 className="text-base md:text-lg tracking-wider font-semibold leading-none">
                Queue List
              </h2>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
            {queue.length} waiting
          </span>
        </div>

        <div className="flex flex-col gap-3 p-5 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 w-full md:w-80">
              <Search size={16} className="text-surface-500" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or identity number"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-surface-300 bg-surface-100 px-3 py-2 text-sm outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {filteredQueue.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-300 px-4 py-6 text-sm text-surface-500">
              No guest in queue yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-100 text-surface-600">
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Guest Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Identity Number
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Guests
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Check-in Time
                    </th>
                    <th className="px-4 py-3 text-left font-medium border-b border-surface-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((item, index) => (
                    <tr
                      key={item.id ?? `${item.name}-${index}`}
                      className="hover:bg-surface-100"
                    >
                      <td className="px-4 py-3 border-b border-surface-300 text-surface-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300 font-semibold text-surface-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300 text-surface-700">
                        {item.identityNo}
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300 text-surface-700">
                        {item.guests}
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300 text-surface-700">
                        {formatCheckInTime(item.checkIn)}
                      </td>
                      <td className="px-4 py-3 border-b border-surface-300 text-surface-700">
                        {cancellingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              className="rounded-lg border border-surface-300 bg-surface-100 px-2 py-1.5 text-xs outline-none"
                            >
                              {CANCELLATION_REASONS.map((reason) => (
                                <option key={reason.value} value={reason.value}>
                                  {reason.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => void cancelGuestById(item.id)}
                              className="rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300 px-3 py-1.5 text-xs font-medium text-surface-50"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setCancellingId(null)}
                              className="rounded-lg border border-surface-300 hover:bg-surface-100 transition-all duration-300 px-3 py-1.5 text-xs font-medium text-surface-700"
                            >
                              Back
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void processGuestById(item.id)}
                              className="rounded-lg bg-brand-500 hover:bg-brand-700 transition-all duration-300 px-3 py-1.5 text-xs font-medium text-surface-50"
                            >
                              Check-in
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCancelReason(CANCELLATION_REASONS[0].value);
                                setCancellingId(item.id ?? null);
                              }}
                              className="rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 px-3 py-1.5 text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ReportGeneration />
    </section>
  );
}