import type { RoomProps } from "../types";

interface Booking {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  description: string;
}

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

        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-4 flex gap-2 flex-wrap">
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
          </div>
        )}

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
                  className="text-gray-200 text-sm flex justify-between items-center"
                >
                  <span>
                    {new Date(booking.startTime).toLocaleString()} -{" "}
                    {new Date(booking.endTime).toLocaleString()}
                  </span>
                  {(isAdmin || booking.userId === userId) && (
                    <div className="flex gap-2">
                      {isAdmin && (
                        <button
                          onClick={() => onEditBooking(booking.id)}
                          className="text-yellow-200 hover:text-yellow-400 text-xs"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => onCancel(booking.id)}
                        className="text-red-200 hover:text-red-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none" />
    </div>
  );
};

export default RoomCard;
