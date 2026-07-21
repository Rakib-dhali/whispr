import keystroke1 from "../assets/sounds/keystroke1.mp3";
import keystroke2 from "../assets/sounds/keystroke2.mp3";
import keystroke3 from "../assets/sounds/keystroke3.mp3";
import keystroke4 from "../assets/sounds/keystroke4.mp3";
import notificationSound from "../assets/sounds/notification.mp3";

const keystrokeSounds = [keystroke1, keystroke2, keystroke3, keystroke4];

export const playKeystrokeSound = () => {
  try {
    const randomIndex = Math.floor(Math.random() * keystrokeSounds.length);
    const audio = new Audio(keystrokeSounds[randomIndex]);
    audio.volume = 1; // set comfortable volume level
    audio.play().catch((err) => {
      // Catch errors, e.g. if browser blocks audio autoplay before user interaction
      console.log("Audio play prevented:", err);
    });
  } catch (err) {
    console.error("Failed to play keystroke sound:", err);
  }
};

export const playNotificationSound = () => {
  try {
    const audio = new Audio(notificationSound);
    audio.volume = 1; // set comfortable volume level
    audio.play().catch((err) => {
      // Catch errors, e.g. if browser blocks audio autoplay before user interaction
      console.log("Audio play prevented:", err);
    });
  } catch (err) {
    console.error("Failed to play keystroke sound:", err);
  }
};