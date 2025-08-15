const mockEchoData = [
  {
    id: 1,
    text: "Just thinking about you.",
    sender_id: 2,
    show_sender_name: true,
    type: "self",
    unlock_datetime: "2025-08-20T14:30:00Z",
    is_unlocked: false,
    location_locked: true,
    lat: 40.73061,
    lng: -73.935242,
    tags: ["nostalgia", "memory"],
    reaction_summary: { happy: 3, sad: 1 },
  },
  {
    id: 2,
    text: "Don't forget to smile tomorrow.",
    sender_id: 1,
    show_sender_name: false,
    type: "public",
    unlock_datetime: "2025-08-06T11:35:00Z",
    is_unlocked: false,
    location_locked: false,
    tags: ["motivation"],
    reaction_summary: { happy: 5, inspired: 2 },
  },
  {
    id: 3,
    text: "You did great on the interview!",
    sender_id: 3,
    show_sender_name: true,
    type: "friend",
    unlock_datetime: "2025-08-07T16:19:00Z",
    is_unlocked: false,
    location_locked: true,
    lat: 40.748817,
    lng: -73.985428, // Empire State Building
    tags: ["career", "support"],
    reaction_summary: { support: 4 },
  },

  // 🌎 NEW LOCATION-LOCKED: already unlocked (History)
  {
    id: 4,
    text: "Look at this view. Hope you see it one day.",
    sender_id: 4,
    show_sender_name: true,
    type: "friend",
    unlock_datetime: "2025-07-15T12:00:00Z",
    is_unlocked: true,
    location_locked: true,
    lat: 40.706192,
    lng: -74.009160, // Battery Park
    tags: ["travel", "nature"],
    reaction_summary: { amazed: 1 },
  },

  // 🌍 NEW LOCATION-LOCKED: still locked (Inbox)
  {
    id: 5,
    text: "Remember where we first met?",
    sender_id: 5,
    show_sender_name: false,
    type: "public",
    unlock_datetime: "2025-08-30T10:00:00Z",
    is_unlocked: false,
    location_locked: true,
    lat: 40.758896,
    lng: -73.985130, // Times Square
    tags: ["memory", "romance"],
    reaction_summary: { love: 3 },
  },

  // 💾 NEW SAVED echo (non-location-locked)
  {
    id: 6,
    text: "Keep this one close to your heart.",
    sender_id: 2,
    show_sender_name: true,
    type: "self",
    unlock_datetime: "2025-08-10T15:00:00Z",
    is_unlocked: true,
    location_locked: false,
    is_saved: true,
    tags: ["reflection"],
    reaction_summary: { calm: 2 },
  },
];

export default mockEchoData;
