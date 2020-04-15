interface Tweet {
  text: string;
  createdAt: string;
  profilePictureUrl: string;
  authorUsername: string;
  id: number;
}

interface ServerSentEvent {
  data: string;
}
