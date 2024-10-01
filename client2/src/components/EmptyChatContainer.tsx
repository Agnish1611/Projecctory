import ChatIcon from '../assets/icons/chat.png';

function EmptyChatContainer() {
  return (
    <div className="max-md:hidden flex flex-col gap-5 justify-center items-center font-quicksand w-full">
        <img className='h-28 w-28' src={ChatIcon} />
        <div className='text-4xl font-bold text-zinc-200'>Start a new conversation!</div>
        <div className='text-sm font-regular text-zinc-400'>Add people to your friend list and start talking with them.</div>
    </div>
  )
}

export default EmptyChatContainer;