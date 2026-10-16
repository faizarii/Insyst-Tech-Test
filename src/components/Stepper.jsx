const steps = [
  "Room",
  "Schedule",
  "Details",
  "Review",
  "Success"
];

function Stepper({ currentStep }) {
  return (
    <nav className="stepper" aria-label="Booking progress">
      <ol className="stepper-list">
        {steps.map((label, index) => {
          const number = index + 1;

          const status =
            number < currentStep
              ? "completed"
              : number === currentStep
                ? "active"
                : "upcoming";

          return (
            <li
              key={label}
              className={`stepper-item ${status}`}
              aria-current={
                status === "active" ? "step" : undefined
              }
            >
              <span className="stepper-circle" aria-hidden="true">
                {status === "completed" ? "✓" : number}
              </span>

              <span className="stepper-label">
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Stepper;