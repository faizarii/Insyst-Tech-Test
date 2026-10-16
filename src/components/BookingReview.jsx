
function BookingReview({
  selectedRoom,
  selectedDate,
  selectedSlot,
  formData,
  submitError,
  isSubmitting,
  onBack,
  onConfirm
}) {
  return (
    <section>
      <h2>Review Booking</h2>
      <p>Please review your booking before confirming.</p>

      <div className="booking-review">
        <h3>Room Information</h3>

        <p>
          <strong>Room:</strong> {selectedRoom?.name}
        </p>

        <p>
          <strong>Date:</strong> {selectedDate}
        </p>

        <p>
          <strong>Time:</strong> {selectedSlot?.time}
        </p>

        <p>
          <strong>Price:</strong> Rp{" "}
          {selectedRoom?.pricePerHour.toLocaleString("id-ID")}
          {" "}/ hour
        </p>

        <hr />

        <h3>Customer Information</h3>

        <p>
          <strong>Name:</strong> {formData.name}
        </p>

        <p>
          <strong>Email:</strong> {formData.email}
        </p>

        <p>
          <strong>Phone:</strong> {formData.phone}
        </p>

        <p>
          <strong>Participants:</strong> {formData.participants}
        </p>
      </div>

      {submitError && (
        <p role="alert" className="error">
          {submitError}
        </p>
      )}

      <div className="actions">
        <button
          type="button"
          className="back-button"
          disabled={isSubmitting}
          onClick={onBack}
        >
          ← Back
        </button>

        <button
          type="button"
          className="next-button"
          disabled={isSubmitting}
          onClick={onConfirm}
        >
          {isSubmitting ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </section>
  );
}

export default BookingReview;
