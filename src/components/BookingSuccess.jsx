
function BookingSuccess({
  bookingResult,
  selectedRoom,
  slots,
  onNewBooking
}) {
  const bookedSlot = slots.find(
    (slot) => slot.id === bookingResult?.slotId
  );

  return (
    <section className="success-page">
      <div className="success-icon">
        ✓
      </div>

      <h2>Booking Successful!</h2>

      <p>
        Your meeting room has been successfully booked.
      </p>

      <div className="success-card">
        <p>Your Booking Code</p>

        <h2>{bookingResult?.bookingCode}</h2>

        <p>
          Keep this code for your booking reference.
        </p>

        <hr />

        <p>
          <strong>Room:</strong> {selectedRoom?.name}
        </p>

        <p>
          <strong>Date:</strong> {bookingResult?.date}
        </p>

        <p>
          <strong>Time:</strong> {bookedSlot?.time}
        </p>

        <p>
          <strong>Name:</strong> {bookingResult?.name}
        </p>
      </div>

      <button
        type="button"
        className="next-button"
        onClick={onNewBooking}
      >
        Book Another Room
      </button>
    </section>
  );
}

export default BookingSuccess;
