"use client";

import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type HeaderAccountMenuProps = {
  hasAuthHydrated: boolean;
  authUser: { name: string } | null;
  compact?: boolean;
  onLogout: () => void;
};

export const HeaderAccountMenu = ({
  hasAuthHydrated,
  authUser,
  compact = false,
  onLogout,
}: HeaderAccountMenuProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          compact ? (
            <Button
              variant="ghost"
              size="icon"
              className="flex size-10 items-center justify-center rounded-full border bg-background p-0"
            >
              <Avatar className="size-8">
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="lg"
              className="hidden items-center gap-2 md:flex"
            >
              <Avatar size="sm">
                <AvatarFallback>
                  {authUser?.name
                    ?.split(" ")
                    .map((value) => value[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "GU"}
                </AvatarFallback>
              </Avatar>
              <span className="flex flex-col items-start justify-start text-xs font-light">
                <span>{authUser ? "Welcome back" : "Account"}</span>
                <span className="font-bold">{authUser?.name ?? "Guest user"}</span>
              </span>
              <ChevronDownIcon className="size-4" />
            </Button>
          )
        }
      />
      <DropdownMenuContent>
        {hasAuthHydrated && authUser ? (
          <DropdownMenuItem variant="destructive" onClick={onLogout}>
            Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/login")}>
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
