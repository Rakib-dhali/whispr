import {
  useEffect,
  useRef,
  useState,
  type SubmitEvent,
  type ChangeEvent,
} from "react";
import { motion } from "motion/react";
import { useAuthStore } from "../lib/useAuthStore";
import { useChatStore, type ChatUser, type Message } from "../lib/useChatStore";
import {
  HiOutlineChatBubbleLeftRight,
  HiMagnifyingGlass,
  HiEllipsisVertical,
  HiPaperAirplane,
  HiFaceSmile,
  HiPhoto,
  HiArrowLeftOnRectangle,
  HiXMark,
  HiUser,
  HiSpeakerWave,
  HiSpeakerXMark,
} from "react-icons/hi2";
import { playKeystrokeSound } from "../lib/keyStrokeSound";

/* ───────────────────── Helpers ───────────────────── */
const formatLastActive = (dateStr?: string): string => {
  if (!dateStr) return "offline";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "offline";

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  ).getTime();
  const dateTime = date.getTime();

  if (dateTime >= startOfToday) {
    return `last active ${timeStr}`;
  } else if (dateTime >= startOfYesterday) {
    return `last active yesterday at ${timeStr}`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const datePart = date.toLocaleDateString([], options);
    return `last active ${datePart} at ${timeStr}`;
  }
};

/* ───────────────────── Main Chat Page ───────────────────── */
const Chat = () => {
  const { selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const prevOnlineUsersRef = useRef<string[]>([]);

  useEffect(() => {
    const prevOnline = prevOnlineUsersRef.current;

    // Find users who were online but are now offline
    const wentOffline = prevOnline.filter((id) => !onlineUsers.includes(id));

    if (wentOffline.length > 0) {
      const nowStr = new Date().toISOString();
      const { contacts, selectedUser } = useChatStore.getState();

      const updatedContacts = contacts.map((contact) => {
        if (wentOffline.includes(contact._id)) {
          return { ...contact, lastActive: nowStr };
        }
        return contact;
      });

      const hasChanged = contacts.some((contact) =>
        wentOffline.includes(contact._id),
      );
      if (hasChanged) {
        useChatStore.setState({ contacts: updatedContacts });
      }

      if (selectedUser && wentOffline.includes(selectedUser._id)) {
        useChatStore.setState({
          selectedUser: { ...selectedUser, lastActive: nowStr },
        });
      }
    }

    prevOnlineUsersRef.current = onlineUsers;
  }, [onlineUsers]);

  return (
    <div className="flex h-screen w-full bg-[#EDE7DD] overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 flex h-full min-w-0 ${!selectedUser ? "hidden md:flex" : "flex"}`}
      >
        {selectedUser ? <ChatArea /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default Chat;

/* ───────────────────── Sidebar ───────────────────── */
const Sidebar = () => {
  const { authUser, logout, onlineUsers } = useAuthStore();
  const {
    contacts,
    isContactsLoading,
    getContacts,
    selectedUser,
    setSelectedUser,
    soundEnabled,
    setSoundEnabled,
  } = useChatStore();
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const filtered = contacts.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <aside
      className={`flex h-full flex-col border-r border-[#d8d1c3] bg-white w-full md:w-95 md:min-w-[320px] ${selectedUser ? "hidden md:flex" : "flex"}`}
    >
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F6F0E8]">
        <div className="flex items-center gap-3">
          {authUser?.profilepic ? (
            <img
              src={authUser.profilepic}
              alt={authUser.fullName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3D2E] text-sm font-bold text-white">
              {authUser ? getInitials(authUser.fullName) : "?"}
            </div>
          )}
          <span className="text-sm font-semibold text-[#1a1a1a]">
            {authUser?.fullName}
          </span>
        </div>

        <div className="relative flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer"
            title={soundEnabled ? "Mute typing sound" : "Unmute typing sound"}
            aria-label={
              soundEnabled ? "Mute typing sound" : "Unmute typing sound"
            }
          >
            {soundEnabled ? (
              <HiSpeakerWave className="h-5 w-5" />
            ) : (
              <HiSpeakerXMark className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <HiEllipsisVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-[#E4DCCF] bg-white py-1.5 shadow-lg animate-in fade-in slide-in-from-top-1">
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <HiArrowLeftOnRectangle className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-[#F4F1EA] px-3 py-2">
          <HiMagnifyingGlass className="h-4 w-4 text-[#a3a39c]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#a3a39c] outline-none"
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isContactsLoading ? (
          <div className="flex flex-col gap-3 px-3 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-[#E4DCCF]" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-[#E4DCCF]" />
                  <div className="h-2.5 w-36 rounded bg-[#E4DCCF]" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#a3a39c]">
            <HiUser className="h-10 w-10 mb-2" />
            <p className="text-sm">No contacts found</p>
          </div>
        ) : (
          filtered.map((contact) => (
            <ContactItem
              key={contact._id}
              contact={contact}
              isSelected={selectedUser?._id === contact._id}
              onSelect={() => setSelectedUser(contact)}
              getInitials={getInitials}
              isOnline={onlineUsers.includes(contact._id)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

/* ───────────────────── Contact Item ───────────────────── */
interface ContactItemProps {
  contact: ChatUser;
  isSelected: boolean;
  onSelect: () => void;
  getInitials: (name: string) => string;
  isOnline: boolean;
}

const ContactItem = ({
  contact,
  isSelected,
  onSelect,
  getInitials,
  isOnline,
}: ContactItemProps) => (
  <motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onSelect}
    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors ${
      isSelected
        ? "bg-[#F4F1EA] border-l-4 border-[#22C55E]"
        : "hover:bg-[#FAFAF5] border-l-4 border-transparent"
    }`}
  >
    <div className="relative shrink-0">
      {contact.profilePic ? (
        <img
          src={contact.profilePic}
          alt={contact.fullName}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#22C55E] to-[#0F3D2E] text-sm font-bold text-white">
          {getInitials(contact.fullName)}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22C55E]" />
      )}
    </div>
    <div className="flex-1 text-left min-w-0">
      <p className="text-sm font-semibold text-[#1a1a1a] truncate">
        {contact.fullName}
      </p>
      <p
        className={`text-xs truncate ${isOnline ? "text-[#22C55E]" : "text-[#8a8a85]"}`}
      >
        {isOnline ? "online" : "offline"}
      </p>
    </div>
  </motion.button>
);

/* ───────────────────── Chat Area ───────────────────── */
const ChatArea = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const {
    selectedUser,
    messages,
    isMessagesLoading,
    getMessages,
    sendMessage,
    isSending,
    setSelectedUser,
    soundEnabled,
    subscribeToMessage,
  } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = subscribeToMessage();
      return () => {
        unsubscribe?.();
      };
    }
  }, [selectedUser, subscribeToMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!selectedUser || (!text.trim() && !imagePreview)) return;
    await sendMessage(selectedUser._id, {
      text: text.trim() || undefined,
      image: imagePreview || undefined,
    });
    setText("");
    removeImage();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const startOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86400000);

    if (dayDiff === 0) return "TODAY";
    if (dayDiff === 1) return "YESTERDAY";
    return date.toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  messages.forEach((msg) => {
    const dateKey = new Date(msg.createdAt).toDateString();
    const existing = groupedMessages.find((g) => g.date === dateKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groupedMessages.push({ date: dateKey, messages: [msg] });
    }
  });

  return (
    <div className="flex flex-1 flex-col bg-[#EDE7DD]">
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-[#d8d1c3] bg-[#F6F0E8] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {selectedUser?.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-[#22C55E] to-[#0F3D2E] text-sm font-bold text-white">
                {selectedUser ? getInitials(selectedUser.fullName) : "?"}
              </div>
            )}
            {selectedUser && onlineUsers.includes(selectedUser._id) && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#F6F0E8] bg-[#22C55E]" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">
              {selectedUser?.fullName}
            </p>
            {selectedUser && onlineUsers.includes(selectedUser._id) ? (
              <p className="text-xs text-[#22C55E]">online</p>
            ) : (
              <p className="text-xs text-[#8a8a85]">
                {formatLastActive(selectedUser?.lastActive)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer">
            <HiMagnifyingGlass className="h-5 w-5" />
          </button>
          <button
            onClick={() => setSelectedUser(null)}
            className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer md:hidden"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 md:px-12"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cec4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {isMessagesLoading ? (
          <div className="flex flex-col gap-4 py-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}
              >
                <div
                  className={`h-10 rounded-2xl ${
                    i % 2 === 0 ? "bg-white/60" : "bg-[#22C55E]/20"
                  }`}
                  style={{ width: `${[200, 260, 180, 300, 220][i]}px` }}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-[#a3a39c]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/60 mb-3">
              <HiOutlineChatBubbleLeftRight className="h-8 w-8 text-[#22C55E]" />
            </div>
            <p className="text-sm font-medium">No messages yet</p>
            <p className="text-xs mt-1">
              Say hi to {selectedUser?.fullName}! 👋
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              {/* Date separator */}
              <div className="flex items-center justify-center py-3">
                <span className="rounded-lg bg-white/80 px-3 py-1 text-xs font-medium text-[#6b6b64] shadow-sm">
                  {formatDateSeparator(group.messages[0].createdAt)}
                </span>
              </div>

              {/* Messages in group */}
              {group.messages.map((msg) => {
                const isMine = msg.senderId === authUser?._id;
                return (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                    className={`mb-1.5 flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`group relative max-w-[65%] rounded-2xl px-3 py-2 shadow-sm transition-all ${
                        isMine
                          ? "bg-[#D9FDD3] rounded-tr-sm"
                          : "bg-white rounded-tl-sm"
                      }`}
                    >
                      {/* Tail */}
                      <div
                        className={`absolute top-0 h-3 w-3 ${
                          isMine
                            ? "-right-1.5 text-[#D9FDD3]"
                            : "-left-1.5 text-white"
                        }`}
                      >
                        <svg
                          viewBox="0 0 8 13"
                          className="h-full w-full fill-current"
                        >
                          {isMine ? (
                            <path d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z" />
                          ) : (
                            <path d="M2.812 0H8v11.193L1.533 2.568C.474 1.156 1.042 0 2.812 0z" />
                          )}
                        </svg>
                      </div>

                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared image"
                          className="mb-1.5 max-h-60 rounded-lg object-cover"
                        />
                      )}
                      {msg.text && (
                        <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>
                      )}
                      <div
                        className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <span className="text-[10px] text-[#8a8a85]">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMine && (
                          <svg
                            className="h-3.5 w-3.5 text-[#53bdeb]"
                            viewBox="0 0 16 15"
                            fill="currentColor"
                          >
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-.36.325a.32.32 0 0 1-.484-.033L3.37 6.789a.365.365 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l4.16 5.088a.365.365 0 0 0 .51.063l7.948-9.006a.365.365 0 0 0-.063-.51z" />
                            <path d="M12.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L5.666 9.88a.32.32 0 0 1-.484.033l-.358-.325a.32.32 0 0 0-.484.033l-1.86 2.117a.365.365 0 0 0 .063.51l.478.372a.365.365 0 0 0 .51-.063l1.86-2.117a.32.32 0 0 1 .484-.033l.358.325a.32.32 0 0 0 .484-.033l5.356-6.874a.365.365 0 0 0-.063-.51z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="bg-[#F6F0E8] border-t border-[#d8d1c3] px-4 py-3">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 rounded-lg object-cover border border-[#E4DCCF]"
            />
            <button
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#0F3D2E] text-white shadow-md hover:bg-red-500 transition-colors cursor-pointer"
            >
              <HiXMark className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-[#d8d1c3] bg-[#F6F0E8] px-4 py-2.5"
      >
        <button
          type="button"
          className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer"
        >
          <HiFaceSmile className="h-6 w-6" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full p-2 text-[#6b6b64] hover:bg-[#EDE7DD] transition-colors cursor-pointer"
        >
          <HiPhoto className="h-6 w-6" />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (soundEnabled) playKeystrokeSound();
          }}
          placeholder="Type a message"
          className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm text-[#1a1a1a] placeholder-[#a3a39c] outline-none border border-transparent focus:border-[#22C55E]/30 transition-colors"
        />

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !imagePreview)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white transition-all hover:bg-[#1ea852] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSending ? (
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <HiPaperAirplane className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

/* ───────────────────── No Chat Selected Placeholder ───────────────────── */
const NoChatSelected = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="flex flex-1 flex-col items-center justify-center bg-[#EDE7DD] px-8 text-center"
  >
    <div className="relative mb-6">
      {/* Animated rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-28 w-28 animate-ping rounded-full bg-[#22C55E]/10"
          style={{ animationDuration: "3s" }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-20 w-20 animate-ping rounded-full bg-[#22C55E]/15"
          style={{ animationDuration: "2s" }}
        />
      </div>
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#22C55E] to-[#0F3D2E] shadow-lg shadow-[#22C55E]/20">
        <HiOutlineChatBubbleLeftRight className="h-12 w-12 text-white" />
      </div>
    </div>

    <h2 className="text-2xl font-bold text-[#0F3D2E]">Welcome to Whispr</h2>
    <p className="mt-3 max-w-sm text-sm text-[#6b6b64] leading-relaxed">
      Select a conversation from the sidebar to start chatting. Your messages
      are private, fast, and secure.
    </p>

    <div className="mt-8 flex items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6F5DE]">
          <svg
            className="h-5 w-5 text-[#0F3D2E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <span className="text-xs text-[#6b6b64]">Encrypted</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5EBC7]">
          <svg
            className="h-5 w-5 text-[#8a6d1d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span className="text-xs text-[#6b6b64]">Instant</span>
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCEBFB]">
          <svg
            className="h-5 w-5 text-[#1d6fd6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <span className="text-xs text-[#6b6b64]">Secure</span>
      </div>
    </div>
  </motion.div>
);
