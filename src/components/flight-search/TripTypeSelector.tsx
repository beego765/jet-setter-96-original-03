import { Toggle } from "@/components/ui/toggle";

interface TripTypeSelectorProps {
  tripType: "oneWay" | "roundTrip";
  setTripType: (type: "oneWay" | "roundTrip") => void;
}

export const TripTypeSelector = ({ tripType, setTripType }: TripTypeSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <Toggle
        pressed={tripType === "oneWay"}
        onPressedChange={() => setTripType("oneWay")}
        className="data-[state=on]:bg-purple-500"
      >
        One Way
      </Toggle>
      <Toggle
        pressed={tripType === "roundTrip"}
        onPressedChange={() => setTripType("roundTrip")}
        className="data-[state=on]:bg-purple-500"
      >
        Round Trip
      </Toggle>
    </div>
  );
};