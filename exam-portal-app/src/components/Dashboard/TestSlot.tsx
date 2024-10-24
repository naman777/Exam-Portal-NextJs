import { TestSlotforTest } from "@/app/(user)/dashboard/page";

interface TestSlotProps {
  slot: TestSlotforTest;
}

const TestSlot: React.FC<TestSlotProps> = ({ slot }) => {
  return (
    <div className="border-2 border-lightblue rounded-lg p-4 w-full">
      <h3 className="text-xl font-semibold">Slot: {slot.timeSlot.toLocaleTimeString()}</h3>
      <p>Capacity: {slot.usersFilled}/{slot.usersAllowed}</p>
    </div>
  );
};

export default TestSlot;
