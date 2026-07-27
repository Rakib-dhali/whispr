import { motion } from "motion/react";

const Loader = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#FBF4EC]">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center gap-4"
      >
        <img
          src="/logo.png"
          alt="Whispr Logo"
          className="h-20 w-20 rounded-2xl shadow-xl shadow-[#22C55E]/25 object-contain"
        />
        <p className="text-sm font-bold tracking-widest text-[#0F3D2E]">
          WHISPR
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;