import type { Booking, RoomProps } from "../types";

interface RoomCardProps extends RoomProps {
  id: string;
  bookings: Booking[];
  isAdmin: boolean;
  userId: string;
  onBook: () => void;
  onCancel: (bookingId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onEditBooking: (bookingId: string) => void;
  onAddUser: () => void;
}

const RoomCard = ({
  name,
  description,
  imageUrl,
  bookings,
  isAdmin,
  userId,
  onBook,
  onCancel,
  onEdit,
  onDelete,
  onEditBooking,
  onAddUser,
}: RoomCardProps) => {
  const hasBookedRoom = bookings.some((booking) => booking.userId === userId);

  return (
    <div className="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden w-full max-w-sm mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Image */}
      <div className="h-48 w-full">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x200?text=Room+Image";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h1 className="text-xl font-semibold text-white mb-2 truncate">
          {name}
        </h1>
        <p className="text-gray-200 text-sm mb-4 line-clamp-3">{description}</p>
        <button
          onClick={onBook}
          className="w-full py-2 bg-cyan-500 text-white font-semibold rounded-lg transition hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          Book Now
        </button>

        {/* Actions */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                Edit Room
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete Room
              </button>
              <button
                onClick={onAddUser}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Add User
              </button>
            </>
          )}
          {!isAdmin && hasBookedRoom && (
            <button
              onClick={onAddUser}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Add User
            </button>
          )}
        </div>

        {/* Bookings List */}
        {bookings.length > 0 && (
          <div className="mt-4">
            <h2 className="text-white text-sm font-semibold mb-2">
              Current Bookings:
            </h2>
            <ul className="space-y-2">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-white text-xs">
                    {toDateSafe(booking.startTime).toLocaleString()} -{" "}
                    {toDateSafe(booking.endTime).toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    {(isAdmin || booking.userId === userId) && (
                      <>
                        {/* Edit button only for booking owner or admin */}
                        {booking.userId === userId && (
                          <button
                            onClick={() => onEditBooking(booking.id)}
                            className="text-yellow-200 hover:text-yellow-400 text-xs cursor-pointer"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => onCancel(booking.id)}
                          className="text-red-200 hover:text-red-400 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

function toDateSafe(date: any): Date {
  // Firestore Timestamp has a toDate method
  if (date && typeof date.toDate === "function") return date.toDate();
  // ISO string
  if (typeof date === "string") return new Date(date);
  // Already a Date
  if (date instanceof Date) return date;
  // Fallback
  return new Date();
}

export default RoomCard;
