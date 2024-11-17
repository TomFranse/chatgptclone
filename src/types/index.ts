// Chat related types
export interface Message {
    text: string;
    createdAt: any;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar: string;
    };
  }
  
  export interface Data {
    modelOption: Array<{
      value: string;
      label: string;
    }>;
  }