import { type MetaFunction } from "react-router";
import GuestSearchBar from "./components/GuestSearchBar";
import GuestDetails from "./components/GuestDetails";
import ReportGeneration from "./components/ReportGeneration";
import { motion } from "motion/react";
import { useState } from "react";

export const meta: MetaFunction = () => [
  { title: "Guest Search | TARUMT Resorts" },
];

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function GuestSearch() {
  const [showGuestDetail, setShowGuestDetail] = useState(false);
  const [guestData, setGuestData] = useState<any>(null);

  return (
    <div className="flex flex-col gap-4 md:gap-8 w-full">
      <motion.div
        variants={staggerItem}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <GuestSearchBar
          setShowGuestDetail={setShowGuestDetail}
          setGuestData={setGuestData}
        />
      </motion.div>

      {showGuestDetail && (
        <motion.div
          variants={staggerItem}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <GuestDetails guestData={guestData} />
        </motion.div>
      )}

      <motion.div
        variants={staggerItem}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <ReportGeneration />
      </motion.div>
    </div>
  );
}
