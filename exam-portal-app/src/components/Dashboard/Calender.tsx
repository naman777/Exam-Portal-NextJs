"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { TestsForUser, TestSlotforTest } from "@/app/(user)/dashboard/page";
import TestSlot from "./TestSlot";
import { isSameDay, format } from "date-fns";
import "react-calendar/dist/Calendar.css"; // Import default styles
import "./calender.css";

interface CalendarComponentProps {
  tests: TestsForUser[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ tests }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [testSlots, setTestSlots] = useState<TestSlotforTest[]>([]);

  const testDates = tests.map((test) => new Date(test.date));

  // Auto-select the first test date on load
  useEffect(() => {
    if (testDates.length > 0) {
      const firstTestDate = testDates.sort((a, b) => a.getTime() - b.getTime())[0];
      setSelectedDate(firstTestDate);
      handleDateChange(firstTestDate);
    }
  }, [tests]);

  const handleDateChange = (value: Date | Date[] | null) => {
    const selectedTest = tests.find((test) => isSameDay(new Date(test.date), value as Date));
    if (selectedTest) {
      setTestSlots(selectedTest.testSlots);
      setSelectedDate(value as Date);
    } else {
      setTestSlots([]); // Reset if no test is available on the selected date
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    return testDates.some((d) => isSameDay(d, date)) ? "bg-green-400 text-" : "bg-green-300";
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    return !testDates.some((d) => isSameDay(d, date));
  };

  return (
    <div className="flex bg-white p-6 gap-x-20 h-[550px] rounded-2xl ">
        
      <div className="w-1/3">
      <div className="font-bold text-xl mb-5">
            Book your test slot
        </div>
        <Calendar
          value={selectedDate}
          onChange={(value) => handleDateChange(value as Date)}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
        />
      </div>

      <div className="ml-8 w-1/2">
        <h2 className="text-xl font-semibold mb-2">
          {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
        </h2>
        <div className="space-y-4">
          {testSlots.length > 0 ? (
            testSlots.map((slot) => <TestSlot key={slot.id} slot={slot} />)
          ) : (
            <p>No slots available for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
