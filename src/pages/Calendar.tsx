import { BookingCalendar } from '@/components/BookingCalendar';
import { usePGContext } from '@/context/PGContext';

export default function Calendar() {
  const { selectedPG } = usePGContext();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View booking availability and schedule new reservations
          {selectedPG && <span className="ml-1">for {selectedPG.name}</span>}
        </p>
      </div>

      <BookingCalendar />
    </div>
  );
}
