function ScheduleSelection({
  selectedDate,
  slots,
  selectedSlotId,
  slotsLoading,
  slotsError,
  minDate,
  onDateChange,
  onSelectSlot,
  onBack,
  onNext
}) {
  const canContinue =
    Boolean(selectedDate) &&
    selectedSlotId !== null &&
    !slotsLoading &&
    !slotsError;

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

      <h3>Available Time Slots</h3>

      {slotsLoading && (
        <p>Loading slots...</p>
      )}

      {slotsError && (
        <p role="alert" className="error">
          {slotsError}
        </p>
      )}

      {!slotsLoading &&
        !slotsError &&
        slots.length === 0 && (
          <p>No time slots available.</p>
        )}

      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            className={`slot-button ${
              selectedSlotId === slot.id ? "selected" : ""
            }`}
            disabled={
              !slot.isAvailable ||
              !selectedDate ||
              slotsLoading
            }
            aria-pressed={selectedSlotId === slot.id}
            onClick={() => onSelectSlot(slot.id)}
          >
            {slot.time}

            {!slot.isAvailable && (
              <span>Unavailable</span>
            )}
          </button>
        ))}
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