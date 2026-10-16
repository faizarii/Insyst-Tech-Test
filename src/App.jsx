import Stepper from "./components/Stepper";
import RoomSelection from "./components/RoomSelection";
import ScheduleSelection from "./components/ScheduleSelection";
import BookingDetails from "./components/BookingDetails";
import BookingReview from "./components/BookingReview";
import BookingSuccess from "./components/BookingSuccess";

import { useEffect, useState } from "react";
import {
  getRooms,
  getSlots,
  getBookingsBySlot,
  getBookingsForRoomDate,
  createBooking
} from "./services/api";
import {
  getTodayLocal,
  validateBookingDetails
} from "./utils/booking";
import "./App.css";

function App() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: ""
  });
  
  const [touched, setTouched] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const [availability, setAvailability] = useState({
    key: "",
    status: "idle",
    bookedSlotIds: [],
    error: ""
  });

  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);

  const selectedRoom = rooms.find(
    (room) => room.id === selectedRoomId
  );

  const formErrors = validateBookingDetails(
    formData,
    selectedRoom?.capacity
  );

  const isFormValid =
    Boolean(selectedRoom) &&
    Object.keys(formErrors).length === 0;

  const availabilityKey = `${selectedRoomId}:${selectedDate}`;

  const availabilityReady =
    availability.key === availabilityKey &&
    availability.status === "success";

  const availabilityLoading =
    Boolean(selectedDate) &&
    (
      availability.key !== availabilityKey ||
      availability.status === "loading"
    );

  const availabilityError =
    availability.key === availabilityKey &&
    availability.status === "error"
      ? availability.error
      : "";

  const bookedSlotIds = availabilityReady
    ? availability.bookedSlotIds
    : [];

  // Fetch Rooms
  useEffect(() => {
    const controller = new AbortController();

    async function loadRooms() {
      try {
        setLoading(true);
        setError("");

        const data = await getRooms(controller.signal);
        setRooms(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRooms();

    return () => controller.abort();
  }, []);

  // Fetch Slots
  useEffect(() => {
    if (step !== 2 || selectedRoomId === null) return;

    const controller = new AbortController();

    async function loadSlots() {
      setSlotsLoading(true);
      setSlotsError("");
      setSlots([]);

      try {
        const data = await getSlots(
          selectedRoomId,
          controller.signal
        );

        setSlots(data);
        setSelectedSlotId((previousId) =>
          data.some(
            (slot) => slot.id === previousId && slot.isAvailable
          )
            ? previousId
            : null
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setSlotsError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSlotsLoading(false);
        }
      }
    }

    loadSlots();

    return () => controller.abort();
  }, [step, selectedRoomId]);

  useEffect(() => {
    if (step !== 2 || selectedRoomId === null || !selectedDate) {
      return;
    }

    const controller = new AbortController();
    const key = `${selectedRoomId}:${selectedDate}`;

    async function loadAvailability() {
      setAvailability({
        key,
        status: "loading",
        bookedSlotIds: [],
        error: ""
      });

      try {
        const bookings = await getBookingsForRoomDate(
          selectedRoomId,
          selectedDate,
          controller.signal
        );

        if (controller.signal.aborted) return;

        const bookedIds = bookings.map(
          (booking) => Number(booking.slotId)
        );

        setAvailability({
          key,
          status: "success",
          bookedSlotIds: bookedIds,
          error: ""
        });

        setSelectedSlotId((previousId) =>
          previousId !== null &&
          bookedIds.includes(Number(previousId))
            ? null
            : previousId
        );

      } catch {
        if (controller.signal.aborted) return;

        setAvailability({
          key,
          status: "error",
          bookedSlotIds: [],
          error: "Failed to check availability. Please try again."
        });
      }
    }

    loadAvailability();

    return () => controller.abort();
  }, [step, selectedRoomId, selectedDate, availabilityRefresh]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleFieldBlur(event) {
    const { name } = event.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
  }

  function handleDetailsSubmit(event) {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        participants: true
      });
      return;
    }

    setStep(4);
  }
  
  async function handleConfirmBooking() {
    if (isSubmitting) return;

    setSubmitError("");

    const selectedSlot = slots.find(
      (slot) => slot.id === selectedSlotId
    );

    if (!selectedRoom) {
      setSubmitError("Selected room not found.");
      return;
    }

    if (!selectedSlot) {
      setSubmitError("Selected time slot not found.");
      return;
    }

    if (!selectedSlot.isAvailable) {
      setSubmitError("Selected time slot is unavailable.");
      return;
    }

    if (!selectedDate || selectedDate < getTodayLocal()) {
      setSubmitError("Please select a valid booking date.");
      return;
    }

    if (!isFormValid) {
      console.log("Form errors:", formErrors);
      setSubmitError("Please check your booking details.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for existing bookings
      const existingBookings = await getBookingsBySlot(
        selectedRoomId,
        selectedSlotId,
        selectedDate
      );

      if (existingBookings.length > 0) {
        setSubmitError(
          "This time slot is already booked for the selected date."
        );
        return;
      }

      // Prepare booking data
      const bookingData = {
        roomId: selectedRoomId,
        slotId: selectedSlotId,
        date: selectedDate,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/[\s-]/g, ""),
        participants: Number(formData.participants),
        bookingCode: `BK-${crypto.randomUUID()
          .replaceAll("-", "")
          .slice(0, 12)
          .toUpperCase()}`
      };

      // Send POST request
      const result = await createBooking(bookingData);

      // Save the API response
      if (!result.bookingCode) {
        throw new Error("Booking response is missing a code.");
      }

      setBookingResult(result);
      setStep(5);

    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNewBooking() {
    setStep(1);
    setSelectedRoomId(null);
    setSelectedDate("");
    setSelectedSlotId(null);
    setSlots([]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      participants: ""
    });
    setTouched({});
    setSubmitError("");
    setBookingResult(null);

    setAvailability({
      key: "",
      status: "idle",
      bookedSlotIds: [],
      error: ""
    });
  }

  function handleSelectRoom(roomId) {
    if (roomId === selectedRoomId) return;
    
    setSelectedRoomId(roomId);
    setSelectedSlotId(null);

    setAvailability({
      key: "",
      status: "idle",
      bookedSlotIds: [],
      error: ""
    });
  }

  function handleDateChange(date) {
    setSelectedDate(date);
    setSelectedSlotId(null);

    setAvailability({
      key: "",
      status: "idle",
      bookedSlotIds: [],
      error: ""
    });
  }

  function handleRefreshAvailability() {
    setAvailability({
      key: "",
      status: "idle",
      bookedSlotIds: [],
      error: ""
    });

    setAvailabilityRefresh((previous) => previous + 1);
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Find Your Perfect Meeting Space.</h1>
        <p>
          Discover and book the right room for your next meeting,
          all in one place.
        </p>
      </header>

      <Stepper currentStep={step} />

      {step === 1 ? (
        <RoomSelection
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          loading={loading}
          error={error}
          onSelectRoom={handleSelectRoom}
          onNext={() => setStep(2)}
        />

      ) : step === 2 ? (
        <ScheduleSelection
          selectedRoomId={selectedRoomId}
          selectedDate={selectedDate}
          slots={slots}
          selectedSlotId={selectedSlotId}
          slotsLoading={slotsLoading}
          slotsError={slotsError}
          availabilityReady={availabilityReady}
          availabilityLoading={availabilityLoading}
          availabilityError={availabilityError}
          bookedSlotIds={bookedSlotIds}
          minDate={getTodayLocal()}
          onDateChange={handleDateChange}
          onSelectSlot={setSelectedSlotId}
          onRefreshAvailability={handleRefreshAvailability}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />

      ) : step === 3 ? (
        <BookingDetails
          formData={formData}
          touched={touched}
          formErrors={formErrors}
          maxCapacity={selectedRoom?.capacity}
          isFormValid={isFormValid}
          onFieldChange={handleFieldChange}
          onFieldBlur={handleFieldBlur}
          onSubmit={handleDetailsSubmit}
          onBack={() => setStep(2)}
        />

      ) : step === 4 ? (
        <BookingReview
          selectedRoom={selectedRoom}
          selectedDate={selectedDate}
          selectedSlot={slots.find(
            (slot) => slot.id === selectedSlotId
          )}
          formData={formData}
          submitError={submitError}
          isSubmitting={isSubmitting}
          onBack={() => {
            setSubmitError("");
            setStep(3);
          }}
          onConfirm={handleConfirmBooking}
        />

      ) : (
        <BookingSuccess
          bookingResult={bookingResult}
          selectedRoom={selectedRoom}
          slots={slots}
          onNewBooking={handleNewBooking}
        />
      )}
          </main>
  );
}

export default App;
