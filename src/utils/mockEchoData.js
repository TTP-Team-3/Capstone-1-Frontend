const mockEchoData = [
  {
    id: 1,
    text: "Feeling nostalgic today.",
    sender_id: 2,
    show_sender_name: true,
    type: "self",
    unlock_datetime: "2025-08-20T14:30:00Z",
    is_unlocked: false,
    tags: ["nostalgia", "memory"],
    reaction_summary: { happy: 3, sad: 1 }
  },
  {
    id: 2,
    text: "Don't forget to smile tomorrow.",
    sender_id: 1,
    show_sender_name: false,
    type: "public",
    unlock_datetime: "2025-08-10T10:00:00Z",
    is_unlocked: true,
    tags: ["motivation"],
    reaction_summary: { happy: 5, inspired: 2 }
  },
  {
    id: 3,
    text: "You did great on the interview!",
    sender_id: 3,
    show_sender_name: true,
    type: "friend",
    unlock_datetime: "2025-08-15T09:00:00Z",
    is_unlocked: false,
    tags: ["career", "support"],
    reaction_summary: { support: 4 }
  }
];

export default mockEchoData;
