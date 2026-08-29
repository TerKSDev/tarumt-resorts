export type QueueItem = {
  id?: string;
  name: string;
  identityNo: string;
  guests: number;
  checkIn?: string;
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

export async function assignRoomToQueueGuestApi(queueId: string): Promise<void> {
  const res = await fetch(`${REGISTRATION_QUEUE_ENDPOINT}/assign-room/${queueId}`, {
    method: "POST",
  });
  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to assign room (${res.status})`);
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
