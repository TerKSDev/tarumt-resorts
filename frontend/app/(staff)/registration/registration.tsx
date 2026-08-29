import { useEffect, useMemo, useState, type FormEvent } from "react";
import { type MetaFunction } from "react-router";
import {
  UserPlus,
  ListOrdered,
  Search,
  UserCheck,
  IdCard,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  X,
  BedDouble,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type QueueItem,
  fetchRegistrationQueueApi,
  registerWalkInGuestApi,
  assignRoomToQueueGuestApi,
} from "../../../lib/api/registration";
import { Card, CardHeader } from "../../../components/Card";

export const meta: MetaFunction = () => [
  { title: "Walk-In Registration & Queue | TARUMT Resorts" },
];

const formatIdentityNo = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 6) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
};

const formatCheckInTime = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

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
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const data = await fetchRegistrationQueueApi();
      setQueue(data);
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return queue.filter((item) => {
      const matchesStatus = statusFilter === "all" || statusFilter === "pending";
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
      flash("Guest name must be at least 2 characters long.");
      return false;
    }

    if (!/^[A-Za-z\s\-'.]+$/u.test(trimmedName)) {
      flash("Guest name can only contain letters, spaces, hyphen, apostrophe, and dot.");
      return false;
    }

    if (!/^\d{6}-\d{2}-\d{4}$/u.test(trimmedIdentityNo)) {
      flash("Identity number format must match YYMMDD-XX-XXXX.");
      return false;
    }

    const duplicateGuest = queue.some((item) => item.identityNo === trimmedIdentityNo);
    if (duplicateGuest) {
      flash("This identity number is already registered in the active queue.");
      return false;
    }

    if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
      flash("Guests count must be a whole number between 1 and 10.");
      return false;
    }

    return true;
  };

  const processGuestById = async (queueId?: string) => {
    if (!queueId) {
      flash("Unable to process: missing queue record ID.");
      return;
    }

    try {
      await assignRoomToQueueGuestApi(queueId);
      await fetchQueue();
      flash("Guest successfully assigned suite and checked in.");
    } catch (err: any) {
      console.error("Error processing queue item:", err);
      flash(err.message || "Unable to process queue item right now.");
    }
  };

  const registerGuest = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!validateRegistrationForm()) {
      return;
    }

    try {
      await registerWalkInGuestApi({
        name: name.trim(),
        identityNo: identityNo.trim(),
        guests,
      });

      setName("");
      setIdentityNo("");
      setGuests(1);
      await fetchQueue();
      flash("Walk-in guest registered into queue successfully.");
    } catch (err: any) {
      console.error("Error enqueueing guest:", err);
      flash(err.message || "Unable to register guest right now. Please try again.");
    }
  };

  useEffect(() => {
    void fetchQueue();
  }, []);

  return (
    <div className="flex-1 flex flex-col gap-8 pb-10">
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 px-5 py-3 rounded-full bg-surface-950 text-white border border-surface-700 shadow-2xl text-xs font-semibold tracking-wide"
          >
            <Sparkles size={14} className="text-brand-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface-950 text-surface-50 relative overflow-hidden shadow-xl border border-surface-800">
        <div className="absolute rounded-full w-96 h-96 bg-brand-900/30 blur-[100px] -top-20 -right-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-900 border border-surface-700/80 text-brand-300 text-xs font-medium tracking-wide w-fit">
              <ShieldCheck size={13} />
              <span>Front Desk Reception & Concierge</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-tight font-semibold text-white">
              Walk-In Registration & Queue Control
            </h1>
            <p className="text-xs md:text-sm text-surface-300 font-light leading-relaxed">
              Expedited walk-in guest enrollment, identity verification, and instant suite allocation queue.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-surface-900/80 border border-surface-800 backdrop-blur-md">
              <span className="text-xl font-bold font-mono text-brand-300">
                {queue.length}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-surface-400 font-medium">
                Waiting In Queue
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Card */}
      <Card>
        <CardHeader
          title="Register New Walk-In Guest"
          subtitle="Input identification credentials to enter the guest check-in sequence."
          icon={UserPlus}
        />

        <form
          onSubmit={(e) => void registerGuest(e)}
          className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
              <UserCheck size={13} className="text-surface-400" />
              <span>Full Name (As In IC / Passport)</span>
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nicholas Raymond"
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
              <IdCard size={13} className="text-surface-400" />
              <span>Identity Number (IC)</span>
            </label>
            <input
              required
              value={identityNo}
              onChange={(e) => setIdentityNo(formatIdentityNo(e.target.value))}
              placeholder="YYMMDD-XX-XXXX"
              maxLength={14}
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-surface-700 flex items-center gap-1.5">
              <Users size={13} className="text-surface-400" />
              <span>Party Size (Pax)</span>
            </label>
            <input
              required
              type="number"
              min={1}
              max={10}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-surface-300 text-sm focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none font-mono"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-95"
            >
              <UserPlus size={15} strokeWidth={2} />
              <span>Enqueue Guest</span>
            </button>
          </div>
        </form>
      </Card>

      {/* Queue List Table Card */}
      <Card>
        <CardHeader
          title="Live Reception Queue"
          subtitle="Guests awaiting room assignment and keycard provision."
          icon={ListOrdered}
          action={
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-100 border border-surface-200 text-xs w-full sm:w-64 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
                <Search size={14} className="text-surface-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search guest name or IC..."
                  className="w-full bg-transparent outline-none text-surface-900 placeholder:text-surface-400 font-normal"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="text-surface-400 hover:text-surface-700"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-full border border-surface-200 bg-surface-100 text-xs text-surface-700 outline-none font-medium cursor-pointer"
              >
                <option value="all">All Queue Items</option>
                <option value="pending">Pending Only</option>
              </select>
            </div>
          }
        />

        {/* Queue Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-brand-600" />
            <span className="text-xs text-surface-500">Fetching live queue entries...</span>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 border border-surface-200">
              <CheckCircle2 size={22} />
            </div>
            <h3 className="text-sm font-serif font-semibold text-surface-800">
              No Guests in Queue
            </h3>
            <p className="text-xs text-surface-400 max-w-sm font-light">
              All walk-in arrivals have been serviced or check-in queue is currently clear.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-100/70 border-b border-surface-200 text-surface-600 uppercase tracking-wider font-semibold">
                  <th className="py-4 px-6 w-16">Seq</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Guest Identification</th>
                  <th className="py-4 px-6">Party Size</th>
                  <th className="py-4 px-6">Queue Entry Time</th>
                  <th className="py-4 px-6 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {filteredQueue.map((item, index) => (
                  <tr key={item.id ?? `${item.name}-${index}`} className="hover:bg-surface-50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-surface-400">
                      #{index + 1}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                        <Clock size={11} className="text-brand-600" />
                        Pending
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-surface-950">
                          {item.name}
                        </span>
                        <span className="text-xs text-surface-500 font-mono flex items-center gap-1 mt-0.5">
                          <IdCard size={12} className="text-surface-400" />
                          {item.identityNo}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 font-medium text-surface-700">
                        <Users size={13} className="text-surface-400" />
                        {item.guests} Pax
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-mono text-surface-600">
                        {formatCheckInTime(item.checkIn)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => void processGuestById(item.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-950 hover:bg-brand-950 text-white text-xs font-semibold uppercase tracking-wider shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <BedDouble size={14} />
                        <span>Assign Room</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}