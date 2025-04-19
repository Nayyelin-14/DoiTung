import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, LogOutIcon, User2Icon } from "lucide-react";
const UserMenu = ({
  user,
  avatarFallback,
  profileLink,
  watchLink,
  logout,
  my_profile,
  watch,
  log_out,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer" aria-label="User Avatar">
          <AvatarImage src={user.user_profileImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="my-3 p-3 w-[250px]">
        <div className="flex gap-3 p-3 border-2 border-black/20 rounded-lg items-center cursor-pointer hover:scale-95 transition-all duration-300 ease-in-out">
          <Avatar>
            <AvatarImage src={user.user_profileImage} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-sm">{user.user_name}</p>
            <p className="font-medium text-sm">{user.user_email}</p>
          </div>
        </div>

        <Link to={profileLink}>
          <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10">
            <User2Icon className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-blue-600 transition-all duration-300" />
            <p className="text-sm font-bold">{my_profile}</p>
          </DropdownMenuItem>
        </Link>

        {watchLink && (
          <Link to={watchLink}>
            <DropdownMenuItem className="cursor-pointer group h-12 mt-2 hover:bg-black/10">
              <Clock className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-green-600 transition-all duration-300" />
              <p className="text-sm font-bold">{watch}</p>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuItem
          className="cursor-pointer h-12 group"
          onClick={logout}
          aria-label="Logout"
        >
          <LogOutIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:text-red-600 transition-all duration-300" />
          <span className="text-sm font-medium group-hover:text-red-600">
            {log_out}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
