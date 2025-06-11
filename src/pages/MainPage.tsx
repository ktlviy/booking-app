import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import CreateRoomModal from "../components/CreateRoomModal";
import BookRoomModal from "../components/BookRoomModal";
import CancelAcceptModal from "../components/CancelAcceptModal";
import EditRoomModal from "../components/EditRoomModal";
import DeleteRoomModal from "../components/DeleteRoomModal";
import EditBookingModal from "../components/EditBookingModal";
import AddUserModal from "../components/AddUserModal";
import type { Booking } from "../types";

interface Room {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const MainPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    | "createRoom"
    | "bookRoom"
    | "cancelBooking"
    | "editRoom"
    | "deleteRoom"
    | "editBooking"
    | "addUser"
    | null
  >(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedRoomData, setSelectedRoomData] = useState<Room | null>(null);
  const [selectedBookingData, setSelectedBookingData] =
    useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsSnapshot = await getDocs(collection(db, "rooms"));
        const roomsData: Room[] = roomsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
        }));
        setRooms(roomsData);

        // Fetch bookings
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookingsData: Booking[] = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          roomId: doc.data().roomId,
          userId: doc.data().userId,
          startTime: doc.data().startTime?.toDate
            ? doc.data().startTime.toDate().toISOString()
            : doc.data().startTime,
          endTime: doc.data().endTime?.toDate
            ? doc.data().endTime.toDate().toISOString()
            : doc.data().endTime,
          description: doc.data().description,
        }));
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load rooms and bookings.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    const response = await logoutUser();
    if (response.success) {
      navigate("/login");
    } else {
      alert(response.error);
    }
  };

  const openModal = (
    type:
      | "createRoom"
      | "bookRoom"
      | "cancelBooking"
      | "editRoom"
      | "deleteRoom"
      | "editBooking"
      | "addUser",
    roomId?: string,
    bookingId?: string,
    roomData?: Room,
    bookingData?: Booking
  ) => {
    setModalType(type);
    setSelectedRoomId(roomId || null);
    setSelectedBookingId(bookingId || null);
    setSelectedRoomData(roomData || null);
    setSelectedBookingData(bookingData || null);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedRoomId(null);
    setSelectedBookingId(null);
    setSelectedRoomData(null);
    setSelectedBookingData(null);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-cyan-600 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-cyan-600 flex items-center justify-center">
        <p className="text-red-200 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-cyan-600 py-10">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-white">
          Meeting Room Booking
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm sm:text-base">
            Welcome, {user?.email}
          </span>
          {role === "admin" && (
            <button
              onClick={() => openModal("createRoom")}
              className="py-2 px-4 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              Create Room
            </button>
          )}
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Rooms Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Available Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                description={room.description}
                imageUrl={room.imageUrl}
                bookings={bookings
                  .filter((b) => b.roomId === room.id)
                  .map((b) => ({
                    ...b,
                    startTime:
                      b.startTime &&
                      typeof b.startTime === "object" &&
                      "toDate" in b.startTime
                        ? b.startTime.toDate().toISOString()
                        : (b.startTime as string),
                    endTime:
                      b.endTime &&
                      typeof b.endTime === "object" &&
                      "toDate" in b.endTime
                        ? b.endTime.toDate().toISOString()
                        : (b.endTime as string),
                  }))}
                isAdmin={role === "admin"}
                userId={user?.uid || ""}
                onBook={() => openModal("bookRoom", room.id)}
                onCancel={(bookingId) =>
                  openModal("cancelBooking", room.id, bookingId)
                }
                onEdit={() => openModal("editRoom", room.id, undefined, room)}
                onDelete={() =>
                  openModal("deleteRoom", room.id, undefined, room)
                }
                onEditBooking={(bookingId) =>
                  openModal(
                    "editBooking",
                    room.id,
                    bookingId,
                    undefined,
                    bookings.find((b) => b.id === bookingId)
                  )
                }
                onAddUser={() => openModal("addUser", room.id)}
              />
            ))
          ) : (
            <p className="text-white text-center col-span-full">
              No rooms available.
            </p>
          )}
        </div>
      </main>

      {/* Modals */}
      {modalType === "createRoom" && <CreateRoomModal onClose={closeModal} />}
      {modalType === "bookRoom" && selectedRoomId && (
        <BookRoomModal
          roomId={selectedRoomId}
          onClose={closeModal}
          userEmail={user?.email || ""}
        />
      )}
      {modalType === "cancelBooking" && selectedBookingId && (
        <CancelAcceptModal bookingId={selectedBookingId} onClose={closeModal} />
      )}
      {modalType === "editRoom" && selectedRoomId && selectedRoomData && (
        <EditRoomModal
          roomId={selectedRoomId}
          initialValues={{
            name: selectedRoomData.name,
            description: selectedRoomData.description,
            imageUrl: selectedRoomData.imageUrl,
          }}
          onClose={closeModal}
        />
      )}
      {modalType === "deleteRoom" && selectedRoomId && selectedRoomData && (
        <DeleteRoomModal
          roomId={selectedRoomId}
          roomName={selectedRoomData.name}
          onClose={closeModal}
        />
      )}
      {modalType === "editBooking" &&
        selectedBookingId &&
        selectedBookingData && (
          <EditBookingModal
            bookingId={selectedBookingId}
            initialValues={{
              startDate:
                selectedBookingData.startTime &&
                typeof selectedBookingData.startTime === "object" &&
                "toDate" in selectedBookingData.startTime
                  ? selectedBookingData.startTime.toDate().toISOString()
                  : (selectedBookingData.startTime as string),
              endDate:
                selectedBookingData.endTime &&
                typeof selectedBookingData.endTime === "object" &&
                "toDate" in selectedBookingData.endTime
                  ? selectedBookingData.endTime.toDate().toISOString()
                  : (selectedBookingData.endTime as string),
              description: selectedBookingData.description,
            }}
            onClose={closeModal}
          />
        )}
      {modalType === "addUser" && selectedRoomId && (
        <AddUserModal roomId={selectedRoomId} onClose={closeModal} />
      )}
    </div>
  );
};

export default MainPage;
