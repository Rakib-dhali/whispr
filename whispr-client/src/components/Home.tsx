import {
  HiOutlineLockClosed,
  HiOutlineBolt,
  HiOutlinePhoto,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiPaperAirplane,
} from "react-icons/hi2";
import { FaGithub, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import type React from "react";
import { motion } from "framer-motion";

const WhisprLandingPage: React.FC =  () => {
  return (
    <div className="min-h-screen w-full font-sans antialiased">
      <NavBar />
      <Hero />
      <FeaturesSection />
      <SeamlessConnectionSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default WhisprLandingPage;

const NavBar: React.FC = () => {
  const links = ["Features", "Pricing", "Safety"];
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-[#FBF4EC]"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Whispr Logo" className="h-8 w-8 rounded-lg object-contain shadow-xs" />
          <span className="text-xl font-bold text-[#0F3D2E]">Whispr</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-[#4B4B46] md:flex">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-[#0F3D2E] transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm text-[#4B4B46] hover:text-[#0F3D2E] transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-[#0F3D2E] px-5 py-2 text-sm font-medium text-white hover:bg-[#0c3025] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

const ChatPreview: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#E4DCCF] bg-[#EFE7DA] p-4 shadow-xl">
      <div className="rounded-xl bg-white shadow-sm">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F3D2E] text-xs font-semibold text-white">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">Jane Doe</p>
            <p className="text-xs text-[#8a8a85]">online</p>
          </div>
        </div>

        {/* Chat body */}
        <div className="space-y-3 px-4 py-4">
          <div className="flex flex-col items-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#F4F1EA] px-3 py-2 text-sm text-[#333]">
              Hey! Did you check out the new encryption features on Whispr?
            </div>
            <span className="mt-1 text-[10px] text-[#a3a39c]">10:42 AM</span>
          </div>

          <div className="flex flex-col items-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#22C55E] px-3 py-2 text-sm text-white">
              Just did. It's incredibly fast. I'm moving my team over today. 🚀
            </div>
            <span className="mt-1 text-[10px] text-[#a3a39c]">10:42 AM ✓✓</span>
          </div>

          <div className="flex flex-col items-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#F4F1EA] px-3 py-2 text-sm text-[#333]">
              Awesome! The UI feels so much cleaner than the old tools.
            </div>
          </div>
        </div>

        {/* Chat input */}
        <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-3">
          <span className="text-lg text-[#c9c9c2]">☺</span>
          <input
            type="text"
            placeholder="Type a message..."
            disabled
            className="flex-1 rounded-full bg-[#F4F1EA] px-3 py-2 text-sm text-[#a3a39c] outline-none"
          />
          <button
            type="button"
            aria-label="Send message"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22C55E] text-white"
          >
            <HiPaperAirplane className="h-4 w-4 rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="bg-[#FBF4EC]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24"
      >
        <div>
          <h1 className="text-5xl font-extrabold leading-tight text-[#0F3D2E] sm:text-6xl">
            Private. Fast.
            <br />
            Secure. <span className="text-[#22C55E]">This is</span>
            <br />
            <span className="text-[#22C55E]">Whispr.</span>
          </h1>
          <p className="mt-6 max-w-md text-[#5c5c56]">
            Experience a new level of real-time communication with end-to-end
            encryption and lightning-fast message delivery.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="rounded-full bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1ea852] transition-colors"
            >
              Get Started for Free
            </a>
            <a
              href="#"
              className="rounded-full border border-[#0F3D2E] px-6 py-3 text-sm font-semibold text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white transition-colors"
            >
              How it Works
            </a>
          </div>
        </div>

        <ChatPreview />
      </motion.div>
    </section>
  );
};

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <HiOutlineLockClosed className="h-5 w-5 text-[#1d6fd6]" />,
      iconBg: "bg-[#DCEBFB]",
      title: "End-to-End Encryption",
      description:
        "Your privacy is our priority. No one can read your messages but you and your recipient. Not even us.",
    },
    {
      icon: <HiOutlineBolt className="h-5 w-5 text-[#0F3D2E]" />,
      iconBg: "bg-[#D6F5DE]",
      title: "Instant Delivery",
      description:
        "Real-time messaging with zero lag. Our global infrastructure ensures your message arrives the moment you hit send.",
    },
    {
      icon: <HiOutlinePhoto className="h-5 w-5 text-[#8a6d1d]" />,
      iconBg: "bg-[#F5EBC7]",
      title: "Rich Media Sharing",
      description:
        "Easily send high-quality photos, videos, and documents without compression limits. Share your world in HD.",
    },
  ];

  return (
    <section className="bg-[#EDE7DD]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-3xl font-extrabold text-[#0F3D2E] sm:text-4xl">
            Communication Redefined
          </h2>
          <p className="mt-4 text-sm text-[#5c5c56]">
            Whispr provides a robust set of features designed to make your daily
            interactions safe and efficient.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.iconBg}`}
              >
                {feature.icon}
              </div>
              <h3 className="mt-4 text-base font-semibold text-[#0F3D2E]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6b6b64]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ConnectionItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SeamlessConnectionSection: React.FC = () => {
  const items: ConnectionItem[] = [
    {
      icon: <HiOutlineUserGroup className="h-4 w-4 text-white" />,
      title: "Group Chats",
      description:
        "Organize projects or family gatherings with powerful admin controls and thread replies.",
    },
    {
      icon: <HiOutlineClock className="h-4 w-4 text-white" />,
      title: "Status Updates",
      description:
        "Share your daily moments with end-to-end encrypted status updates that disappear after 24 hours.",
    },
    {
      icon: <HiOutlineVideoCamera className="h-4 w-4 text-white" />,
      title: "Voice & Video Calls",
      description:
        "Crystal-clear HD calling that works even on low-bandwidth connections, keeping you close to what matters.",
    },
  ];

  return (
    <section className="bg-[#FBF4EC]">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2"
      >
        <div className="overflow-hidden rounded-2xl border-2 border-[#22C55E] p-2">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80"
            alt="Friends chatting together on a couch"
            className="h-full w-full rounded-xl object-cover"
          />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-[#0F3D2E] sm:text-4xl">
            Experience Seamless Connection
          </h2>
          <p className="mt-4 text-sm text-[#5c5c56]">
            Beyond simple messaging, Whispr brings people together through
            powerful collaborative tools that feel natural.
          </p>

          <ul className="mt-8 space-y-6">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F3D2E]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6b6b64]">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <section className="bg-[#0F3D2E]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-6 py-20 text-center"
      >
        <span className="text-4xl font-serif text-[#22C55E]">&rdquo;</span>
        <p className="mt-2 text-xl font-medium leading-relaxed text-white sm:text-2xl">
          &ldquo;Whispr has completely transformed how our remote team
          communicates. The speed is unmatched, and knowing our data is truly
          private gives us immense peace of mind.&rdquo;
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
            alt="Sarah Chen"
            className="h-10 w-10 rounded-full border-2 border-[#22C55E] object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-white">Sarah Chen</p>
            <p className="text-xs text-[#a9c9bb]">CTO at InnovateGlobal</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const CTASection: React.FC = () => {
  return (
    <section className="bg-[#FBF4EC]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          className="mx-auto max-w-2xl rounded-2xl bg-[#E6DFD3] px-8 py-14 text-center"
        >
          <h2 className="text-2xl font-extrabold text-[#0F3D2E] sm:text-3xl">
            Ready to join the conversation?
          </h2>
          <p className="mt-3 text-sm text-[#5c5c56]">
            Download Whispr for Mobile, Desktop, and Web. Start chatting
            securely in less than 30 seconds.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-full bg-[#0F3D2E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c3025] transition-colors"
            >
              Get Started Now
            </Link>
            <a
              href="#"
              className="rounded-full border border-[#0F3D2E] bg-white px-6 py-3 text-sm font-semibold text-[#0F3D2E] hover:bg-[#0F3D2E] hover:text-white transition-colors"
            >
              Download App
            </a>
          </div>

          <p className="mt-4 text-xs text-[#8a8a82]">
            No credit card required. Free forever for individuals.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  const columns: { title: string; links: string[] }[] = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Desktop App", "Security"],
    },
    { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
    {
      title: "Support",
      links: ["Help Center", "Privacy Policy", "Terms of Service", "Safety"],
    },
  ];

  return (
    <footer className="bg-[#EDE7DD]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Whispr Logo" className="h-7 w-7 rounded-md object-contain" />
              <span className="text-lg font-bold text-[#0F3D2E]">Whispr</span>
            </div>
            <p className="mt-3 max-w-55 text-sm text-[#6b6b64]">
              Redefining digital communication with a focus on privacy, speed,
              and beautiful design. Built for the modern world.
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#6b6b64]">
              <a href="#" aria-label="Twitter" className="hover:text-[#0F3D2E]">
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-[#0F3D2E]">
                <FaGithub className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Discord" className="hover:text-[#0F3D2E]">
                <FaDiscord className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8a82]">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#6b6b64] hover:text-[#0F3D2E] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#d8d1c3] pt-6 text-center text-xs text-[#8a8a82]">
          © 2024 Whispr Inc. Private. Fast. Secure. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
