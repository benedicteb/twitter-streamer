interface Tweet {
  text: string;
  createdAt: string;
  profilePictureUrl: string;
  authorUsername: string;
}

interface ServerSentEvent {
  data: string;
}
