"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { TestsForUser, TestSlotforTest } from "@/app/(user)/dashboard/page";
import TestSlot from "./TestSlot";
import ConfirmModal from "./ConfirmModalForTestSlot"; // Import the modal
import { isSameDay, format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import "./calender.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { applyForTestSlot } from "@/actions/user";

interface CalendarComponentProps {
  tests: TestsForUser[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ tests }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [testSlots, setTestSlots] = useState<TestSlotforTest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const { data: session } = useSession();

  const router = useRouter();

  const testDates = tests.map((test) => new Date(test.date));

  useEffect(() => {
    if (testDates.length > 0) {
      const firstTestDate = testDates.sort(
        (a, b) => a.getTime() - b.getTime()
      )[0];
      setSelectedDate(firstTestDate);
      handleDateChange(firstTestDate);
    }
  }, [tests]);

  const handleDateChange = (value: Date | Date[] | null) => {
    const selectedTest = tests.find((test) =>
      isSameDay(new Date(test.date), value as Date)
    );
    if (selectedTest) {
      // Sort testSlots by time in increasing order
      const sortedSlots = [...selectedTest.testSlots].sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.timeSlot}`);
        const timeB = new Date(`1970-01-01T${b.timeSlot}`);
        return timeA.getTime() - timeB.getTime();
      });
      setTestSlots(sortedSlots);
      setSelectedDate(value as Date);
    } else {
      setTestSlots([]);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    return testDates.some((d) => isSameDay(d, date))
      ? "bg-green-400 text-"
      : "bg-green-300";
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    return !testDates.some((d) => isSameDay(d, date));
  };

  const handleSlotClick = (slotId: number, slotTime: string) => {
    setSelectedSlotTime(slotTime);
    setSelectedSlotId(slotId);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!session || !session.user || !session.user.email) {
      toast.error("You need to be logged in to book a slot");
      router.push("/");
    }

    if (selectedSlotId) {
      // Handle booking confirmation logic here using selectedSlotId

      const res = await applyForTestSlot(
        selectedSlotId.toString(),
        session!.user!.email as string
      );
      if (res.success) {
        toast.success("Slot booked successfully");
        // router.push("/dashboard");
        window.location.reload();
      } else {
        toast.error(res.message);
      }

      console.log(
        `Confirmed booking for slot ID ${selectedSlotId} at ${selectedSlotTime} on ${format(
          selectedDate!,
          "EEEE, MMMM d"
        )}`
      );
    }
    setIsModalOpen(false);
  };

  const handleDiscard = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex bg-white p-6 gap-x-20 h-[550px] rounded-2xl shadow-xl">
      <div className="w-1/3">
        <div className="font-bold text-xl mb-5">Book your test slot</div>
        <Calendar
          value={selectedDate}
          onChange={(value) => handleDateChange(value as Date)}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
      </div>

      <div className="ml-8 w-1/2">
        <h2 className="text-xl font-semibold mb-2">
          {selectedDate
            ? format(selectedDate, "EEEE, MMMM d")
            : "Select a date"}
        </h2>
        <div className="space-y-4">
          {testSlots && testSlots.length > 0 ? (
            testSlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => {
                  handleSlotClick(slot.id as any, slot.timeSlot.toLocaleTimeString());
                }}
                className="cursor-pointer"
              >
                <TestSlot key={slot.id} slot={slot} />
              </div>
            ))
          ) : (
            <p>No slots available for this date.</p>
          )}
        </div>
      </div>

      {/* Modal for confirmation */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleDiscard}
        onConfirm={handleConfirm}
        selectedSlotTime={selectedSlotTime || ""}
        selectedDate={selectedDate ? format(selectedDate, "EEEE, MMMM d") : ""}
      />
    </div>
  );
};

export default CalendarComponent;
