const BASE_URL = "http://localhost:3001";

export async function getRooms(signal) {
  const response = await fetch(`${BASE_URL}/rooms`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch rooms");
  }

  return response.json();
}

export async function getSlots(roomId, signal) {
  const response = await fetch(
    `${BASE_URL}/slots?roomId=${roomId}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch slots");
  }

  return response.json();
}

export async function getBookingsBySlot(roomId, slotId, date) {
  const params = new URLSearchParams({
    roomId: String(roomId),
    slotId: String(slotId),
    date
  });

  const response = await fetch(
    `${BASE_URL}/bookings?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to check existing bookings");
  }

  return response.json();
}

export async function createBooking(bookingData) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(bookingData)
  });

  if (!response.ok) {
    throw new Error("Failed to create booking");
  }

  return response.json();
}
