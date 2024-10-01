import { BiSearch } from "react-icons/bi";
import { Input } from "./ui/input";

function FriendsContainer() {
  return (
    <div className="md:w-[400px] md:border-r-[1px] md:border-zinc-500 w-full p-5">
        <div className="border-zinc-400 rounded-2xl flex h-fit border-[1px] justify-center items-center py-2 px-3">
            <BiSearch className="h-7 w-7 text-zinc-400" />
            <Input className="border-none rounded-2xl h-5 font-quicksand" placeholder="Search friends" />
        </div>
    </div>
  )
}

export default FriendsContainer;