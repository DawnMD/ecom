"use client";

import { SearchIcon } from "lucide-react";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type HeaderSearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
};

export const HeaderSearchInput = ({
  value,
  onValueChange,
  onSubmit,
}: HeaderSearchInputProps) => (
  <Field className="flex-1 md:mx-4 md:max-w-xl">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <InputGroup>
        <InputGroupInput
          id="input-group-search"
          placeholder="What are you looking for?"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon size={16} />
        </InputGroupAddon>
      </InputGroup>
    </form>
  </Field>
);
