import EmptyChatContainer from "@/components/EmptyChatContainer";
import FriendsContainer from "@/components/FriendsContainer";

const Inbox = () => {
  return (
    <section className="w-full h-screen bg-zinc-950 flex gap-2 p-2 text-white">
      <FriendsContainer />
      <EmptyChatContainer />
    </section>
  )
}

export default Inbox;