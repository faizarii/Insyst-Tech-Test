function BookingDetails({
  formData,
  touched,
  formErrors,
  maxCapacity,
  isFormValid,
  onFieldChange,
  onFieldBlur,
  onSubmit,
  onBack
}) {
  return (
    <section>
      <h2>Booking Details</h2>
      <p>Please enter your personal information.</p>

      <form
        className="booking-form"
        noValidate
        onSubmit={onSubmit}
      >
        <div className="form-grid">

          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
              aria-invalid={Boolean(touched.name && formErrors.name)}
            />

            {touched.name && formErrors.name && (
              <small className="field-error">
                {formErrors.name}
              </small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
              aria-invalid={Boolean(touched.email && formErrors.email)}
            />

            {touched.email && formErrors.email && (
              <small className="field-error">
                {formErrors.email}
              </small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="081234567890"
              value={formData.phone}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
              aria-invalid={Boolean(touched.phone && formErrors.phone)}
            />

            {touched.phone && formErrors.phone && (
              <small className="field-error">
                {formErrors.phone}
              </small>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="participants">
              Number of Participants
            </label>

            <input
              id="participants"
              name="participants"
              type="number"
              min="1"
              max={maxCapacity}
              step="1"
              placeholder="Number of people"
              value={formData.participants}
              onChange={onFieldChange}
              onBlur={onFieldBlur}
              aria-invalid={Boolean(
                touched.participants && formErrors.participants
              )}
            />

            <small className="field-hint">
              Maximum {maxCapacity} people
            </small>

            {touched.participants && formErrors.participants && (
              <small className="field-error">
                {formErrors.participants}
              </small>
            )}
          </div>

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
            type="submit"
            className="next-button"
            disabled={!isFormValid}
          >
            Next Step →
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookingDetails;