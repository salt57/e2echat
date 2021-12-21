/** The core Vue instance controlling the UI */
const vm = new Vue({
  el: "#vue-instance",
  data() {
    return {
      cryptWorker: null,
      socket: null,
      originPublicKey: null,
      destinationPublicKey: null,
      messages: [],
      notifications: [],
      currentRoom: null,
      pendingRoom: Math.floor(Math.random() * 1000),
      draft: "",
    };
  },
  created() {
    // Initialize socket.io
    this.socket = io();
    this.setupSocketListeners();
  },
  methods: {
    /** Append a notification message in the UI */
    addNotification(message) {
      const timestamp = new Date().toLocaleTimeString();
      this.notifications.push({ message, timestamp });
    },
    /** Setup Socket.io event listeners */
    setupSocketListeners() {
      // Automatically join default room on connect
      this.socket.on("connect", () => {
        this.addNotification("Connected To Server.");
        this.joinRoom();
      });

      // Notify user that they have lost the socket connection
      this.socket.on("disconnect", () =>
        this.addNotification("Lost Connection")
      );

      // Display message when recieved
      this.socket.on("MESSAGE", (message) => {
        this.addMessage(message);
      });
    },

    /** Send the current draft message */
    sendMessage() {
      // Don't send message if there is nothing to send
      if (!this.draft || this.draft === "") {
        return;
      }

      const message = this.draft;

      // Reset the UI input draft text
      this.draft = "";

      // Instantly add message to local UI
      this.addMessage(message);

      // Emit the message
      this.socket.emit("MESSAGE", message);
    },

    /** Join the chatroom */
    joinRoom() {
      this.socket.emit("JOIN");
    },

    /** Add message to UI */
    addMessage(message) {
      this.messages.push(message);
    },
  },
});
