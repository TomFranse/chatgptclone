interface Message {
  text: string;
  createdAt: any;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
}
