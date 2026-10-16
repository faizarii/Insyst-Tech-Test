function RoomSelection({
  rooms,
  selectedRoomId,
  loading,
  error,
  onSelectRoom,
  onNext
}) {
  return (
    <section>
      <h2>Select a Room</h2>
      <p>Choose a meeting room that fits your needs.</p>

      {loading && <p>Loading rooms...</p>}

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      {!loading && !error && rooms.length === 0 && (
        <p>No rooms available.</p>
      )}

      <div className="room-grid">
        {rooms.map((room) => (
          <article
            key={room.id}
            className={`room-card ${
              selectedRoomId === room.id ? "selected" : ""
            }`}
          >
            <img src={room.image} alt={room.name} />

            <div className="room-content">
              <h3>{room.name}</h3>

              <p>Capacity: {room.capacity} people</p>

              <p>{room.facilities.join(", ")}</p>

              <h3>
                Rp {room.pricePerHour.toLocaleString("id-ID")}
                <small> / hour</small>
              </h3>

              <button
                type="button"
                className="select-button"
                aria-pressed={selectedRoomId === room.id}
                onClick={() => onSelectRoom(room.id)}
              >
                {selectedRoomId === room.id
                  ? "Selected"
                  : "Select Room"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="actions">
        <button
          type="button"
          className="next-button"
          disabled={selectedRoomId === null || loading || !!error}
          onClick={onNext}
        >
          Next Step →
        </button>
      </div>
    </section>
  );
}

export default RoomSelection;