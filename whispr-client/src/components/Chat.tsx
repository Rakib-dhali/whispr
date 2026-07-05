import { useAuthStore } from "../lib/useAuthStore";

const Chat = () => {
  const { logout } = useAuthStore();

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <button
        className="p-4 bg-gray-200 hover:bg-gray-400 text-black text-xl font-bold cursor-pointer rounded-lg"
        onClick={logout}
      >
        logout
      </button>
    </div>
  );
};

export default Chat;
