import { useEffect } from "react";
import { useEmote } from "@hooks/useEmote";

import { useChatMessages } from "@context/chat";

export function EmoteDrop({
  filter = [],
  canvas = { height: 1080, width: 1920 }
}) {
  const messages = useChatMessages();
  const { emoteRef, addEmote } = useEmote();

  useEffect(() => {
    const [message] = messages.slice(-1);
    if (!message) return;

    message.emotes.forEach((emote) => {
      if (filter.length === 0 || filter.includes(emote.name)) {
        emote.locations.forEach(() => addEmote(emote.images.large));
      }
    });
  }, [messages.length]);

  return (
    <canvas
      ref={emoteRef}
      style={{
        height: canvas.height,
        left: 0,
        position: "absolute",
        top: 0,
        width: canvas.width
      }}
    />
  );
}
