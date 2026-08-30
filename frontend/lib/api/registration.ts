export type QueueItem = {
  id?: string;
  name: string;
  identityNo: string;
  guests: number;
  checkIn?: string;
};

export type Room = {
  roomId: string;
  type: string;
  status: string;
  capacity: number;
  pricePerNight: number;
};

const API_BASE_URL = "http://localhost:8081";
const REGISTRATION_QUEUE_ENDPOINT = `${API_BASE_URL}/api/registration/queue`;

export async function fetchRegistrationQueueApi(): Promise<QueueItem[]> {
  const res = await fetch(REGISTRATION_QUEUE_ENDPOINT);
  if (!res.ok) {
    throw new Error(`Failed to fetch registration queue (${res.status})`);
  }
  return res.json();
}

export async function registerWalkInGuestApi(data: {
  name: string;
  identityNo: string;
  guests: number;
}): Promise<void> {
  const res = await fetch(`${REGISTRATION_QUEUE_ENDPOINT}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to register guest (${res.status})`);
  }
}

export async function assignRoomToQueueGuestApi(queueId: string, roomId: string): Promise<void> {
  const res = await fetch(`${REGISTRATION_QUEUE_ENDPOINT}/assign-room/${queueId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomId }),
  });
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to assign room (${res.status})`);
  }
}

export async function fetchAvailableRoomsApi(): Promise<Room[]> {
  try {
    const res = await fetch(`${REGISTRATION_QUEUE_ENDPOINT}/available-rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg || `Failed to fetch available rooms (${res.status})`);
    }
    return res.json();
  } catch (error: any) {
    console.error("Fetch error details:", error);
    throw new Error(error.message || "Network error: Unable to fetch available rooms");
  }
}

export async function cancelWalkInGuestApi(queueId: string, reason: string): Promise<void> {
  const res = await fetch(`${REGISTRATION_QUEUE_ENDPOINT}/cancel/${queueId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to cancel guest (${res.status})`);
  }
}
