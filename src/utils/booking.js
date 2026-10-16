
export function getTodayLocal() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function validateBookingDetails(data, maxCapacity) {
  const errors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Invalid email format";
  }

  const phone = data.phone.replace(/[\s-]/g, "");

  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!/^(?:\+62|62|0)8\d{8,11}$/.test(phone)) {
    errors.phone = "Enter a valid Indonesian mobile number";
  }

  const participants = Number(data.participants);

  if (data.participants === "") {
    errors.participants = "Number of participants is required";
  } else if (!Number.isInteger(participants) || participants < 1) {
    errors.participants = "Enter at least 1 participant";
  } else if (
    maxCapacity !== undefined &&
    participants > maxCapacity
  ) {
    errors.participants = `Maximum ${maxCapacity} participants allowed`;
  }

  return errors;
}
