import { motion } from "motion/react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const Loader = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FBF4EC]">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#22C55E] to-[#0F3D2E] shadow-xl shadow-[#22C55E]/20">
          <HiOutlineChatBubbleLeftRight className="h-12 w-12 text-white" />
        </div>
        <p className="text-sm font-bold tracking-widest text-[#0F3D2E]">
          WHISPR
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;