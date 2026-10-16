function ScheduleSelection({
  selectedRoomId,
  selectedDate,
  slots,
  selectedSlotId,
  slotsLoading,
  slotsError,
  availabilityReady,
  availabilityLoading,
  availabilityError,
  bookedSlotIds,
  minDate,
  onDateChange,
  onSelectSlot,
  onRefreshAvailability,
  onBack,
  onNext
}) {
  const bookedIds = new Set(bookedSlotIds.map(Number));

  const visibleSlots = slots.filter(
    (slot) => Number(slot.roomId) === Number(selectedRoomId)
  );

  const selectedSlot = visibleSlots.find(
    (slot) =>
      selectedSlotId !== null &&
      Number(slot.id) === Number(selectedSlotId)
  );

  const canContinue =
    Boolean(selectedDate) &&
    selectedDate >= minDate &&
    availabilityReady &&
    !slotsLoading &&
    !slotsError &&
    Boolean(selectedSlot?.isAvailable) &&
    !bookedIds.has(Number(selectedSlotId));

  return (
    <section>
      <h2>Select Date & Time</h2>
      <p>Choose your preferred meeting schedule.</p>

      <div className="date-field">
        <label htmlFor="booking-date">
          Booking Date
        </label>

        <input
          id="booking-date"
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className="schedule-heading">
        <h3>Available Time Slots</h3>

        <button
          type="button"
          className="refresh-button"
          disabled={
            !selectedDate ||
            availabilityLoading ||
            slotsLoading
          }
          onClick={onRefreshAvailability}
        >
          ↻ Refresh
        </button>
      </div>

      {!selectedDate && (
        <p className="availability-status">
          Select a date to check availability.
        </p>
      )}

      {slotsLoading && (
        <p role="status">Loading time slots...</p>
      )}

      {slotsError && (
        <p role="alert" className="error">
          {slotsError}
        </p>
      )}

      {selectedDate && availabilityLoading && (
        <p role="status" className="availability-status">
          Checking booking availability...
        </p>
      )}

      {availabilityError && (
        <p role="alert" className="error">
          {availabilityError}
        </p>
      )}

      {!slotsLoading &&
        !slotsError &&
        visibleSlots.length === 0 && (
          <p>No time slots available.</p>
        )}

      <div className="slot-grid">
        {visibleSlots.map((slot) => {
          const isBooked =
            availabilityReady &&
            bookedIds.has(Number(slot.id));

          const isUnavailable =
            !slot.isAvailable || isBooked;

          const slotLabel = !slot.isAvailable
            ? "Unavailable"
            : !selectedDate
              ? "Select date"
              : !availabilityReady
                ? "Checking..."
                : isBooked
                  ? "Booked"
                  : "Available";

          return (
            <button
              key={slot.id}
              type="button"
              className={`slot-button ${
                selectedSlotId === slot.id ? "selected" : ""
              } ${isBooked ? "booked" : ""}`}
              disabled={
                isUnavailable ||
                !selectedDate ||
                selectedDate < minDate ||
                !availabilityReady ||
                slotsLoading
              }
              aria-pressed={selectedSlotId === slot.id}
              onClick={() => onSelectSlot(slot.id)}
            >
              {slot.time}
              <span>{slotLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="actions">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="next-button"
          disabled={!canContinue}
          onClick={onNext}
        >
          Next Step →
        </button>
      </div>
    </section>
  );
}

export default ScheduleSelection;