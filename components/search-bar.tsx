import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  ChevronDownIcon,
  Heart,
  SearchIcon,
  ShoppingCart,
} from "lucide-react";

export const SearchBar = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4 md:justify-start md:gap-2">
          <div className="flex items-center gap-2">
            <Building size={24} />
            <span className="text-2xl font-bold">STELLA</span>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
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
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="flex size-10 items-center justify-center rounded-full border bg-background p-0"
                  >
                    <Avatar className="size-8">
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem variant={"destructive"}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:contents">
          <Field className="flex-1 md:mx-4 md:max-w-xl">
            <InputGroup>
              <InputGroupInput
                id="input-group-search"
                placeholder="What are you looking for?"
              />
              <InputGroupAddon align="inline-start">
                <SearchIcon size={16} />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant={"ghost"} size={"icon"} className="relative">
              <Badge variant={"destructive"} className="absolute -top-2 -right-2">
                <span className="md:hidden">20</span>
                <span className="hidden md:inline">0</span>
              </Badge>
              <ShoppingCart />
              <span className="sr-only">Cart</span>
            </Button>
            <Button variant={"ghost"} size={"icon"} className="relative">
              <Badge variant={"destructive"} className="absolute -top-2 -right-2">
                <span className="md:hidden">3</span>
                <span className="hidden md:inline">0</span>
              </Badge>
              <Heart />
              <span className="sr-only">Wishlist</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    className="hidden items-center gap-2 md:flex"
                  >
                    <Avatar size="sm">
                      <AvatarImage src="https://github.com/shadcn.png" />
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

            <Separator orientation="vertical" className="hidden md:block" />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    className="hidden items-center gap-2 md:flex"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col items-start justify-start text-xs font-light">
                      <span>Welcome back </span>
                      <span className="font-bold">John Doe</span>
                    </span>
                    <ChevronDownIcon className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem variant={"destructive"}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
