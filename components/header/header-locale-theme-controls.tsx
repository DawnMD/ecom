"use client";

import { ChevronDownIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";

export const HeaderCompactLanguageMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger
      render={
        <Button
          variant="ghost"
          size="icon"
          className="flex items-center justify-center rounded-full border bg-background p-0"
        >
          <Avatar className="size-7">
            <AvatarImage src="https://flagcdn.com/us.svg" alt="United States" />
          </Avatar>
          <ChevronDownIcon className="ml-1 hidden size-4 md:inline-block" />
        </Button>
      }
    />
    <DropdownMenuContent>
      <DropdownMenuItem>English</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const HeaderLocaleThemeControls = () => (
  <>
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="lg"
            className="hidden items-center gap-2 md:flex"
          >
            <Avatar size="sm">
              <AvatarImage src="https://flagcdn.com/us.svg" alt="United States" />
            </Avatar>
            <span>English</span>
            <ChevronDownIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <ModeToggle />

    <Separator orientation="vertical" className="hidden md:block" />
  </>
);
