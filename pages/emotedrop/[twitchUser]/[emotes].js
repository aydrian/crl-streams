import { ChatProvider } from "@context/chat";
import { EmoteDrop } from "@components/EmoteDrop";

export default function EmoteDropOverlay({ twitchUser, emotes, canvas }) {
  return (
    <ChatProvider channels={[twitchUser]}>
      <EmoteDrop canvas={canvas} filter={emotes} />
    </ChatProvider>
  );
}

export async function getServerSideProps(context) {
  const {
    twitchUser,
    emotes: strEmotes = "",
    canvas: strCanvas = ""
  } = context.query;
  const emotes = strEmotes.length > 0 ? strEmotes.split(",") : ["CorgiDerp"];
  const [width, height] =
    strCanvas.length > 0 ? strCanvas.split("x") : ["1920", "1080"];
  const canvas = { width: parseInt(width), height: parseInt(height) };

  return { props: { twitchUser, emotes, canvas } };
}
