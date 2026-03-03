"use client";

import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useAuthStore } from "@/stores/use-auth-store";

const loginFormSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const isSafeInternalNextPath = (value: string) =>
  value.startsWith("/") && !value.startsWith("//");

export default function LoginPage() {
  const router = useRouter();
  const [loginQuery] = useQueryStates({
    next: parseAsString.withDefault("/"),
    intent: parseAsString,
    cartProductId: parseAsString,
    cartSize: parseAsString,
    cartQuantity: parseAsInteger,
  });
  const login = useAuthStore((state) => state.login);
  const authUser = useAuthStore((state) => state.user);
  const hasAuthHydrated = useAuthStore((state) => state.hasHydrated);

  const nextPath = useMemo(() => {
    const rawNext = loginQuery.next;
    if (!isSafeInternalNextPath(rawNext)) {
      return "/";
    }

    return rawNext;
  }, [loginQuery.next]);

  const redirectTargetPath = useMemo(() => {
    const redirectUrl = new URL(nextPath, "https://local.app");

    if (loginQuery.intent) {
      redirectUrl.searchParams.set("intent", loginQuery.intent);
    }
    if (loginQuery.cartProductId) {
      redirectUrl.searchParams.set("cartProductId", loginQuery.cartProductId);
    }
    if (loginQuery.cartSize) {
      redirectUrl.searchParams.set("cartSize", loginQuery.cartSize);
    }
    if (loginQuery.cartQuantity != null) {
      redirectUrl.searchParams.set("cartQuantity", String(loginQuery.cartQuantity));
    }

    const queryString = redirectUrl.searchParams.toString();
    return queryString
      ? `${redirectUrl.pathname}?${queryString}`
      : redirectUrl.pathname;
  }, [
    loginQuery.cartProductId,
    loginQuery.cartQuantity,
    loginQuery.cartSize,
    loginQuery.intent,
    nextPath,
  ]);

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: authUser?.email ?? "",
      password: "",
    },
    mode: "onSubmit",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      await new Promise((resolve) => setTimeout(resolve, 350));
      login(data);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    clearErrors();
    const validationResult = loginFormSchema.safeParse(data);
    if (!validationResult.success) {
      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];
        if (fieldName === "email" || fieldName === "password") {
          setError(fieldName, {
            type: "validate",
            message: issue.message,
          });
        }
      }
      return;
    }

    await loginMutation.mutateAsync(data);
    router.replace(redirectTargetPath);
  });

  useEffect(() => {
    if (hasAuthHydrated && authUser) {
      router.replace(redirectTargetPath);
    }
  }, [authUser, hasAuthHydrated, redirectTargetPath, router]);

  if (!hasAuthHydrated) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md items-center justify-center px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-2 h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-11 w-full" />
          </CardContent>
        </Card>
      </main>
    );
  }

  if (hasAuthHydrated && authUser) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-md items-center justify-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            Log in before adding products to cart.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email ? <FieldError errors={[errors.email]} /> : null}
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                {errors.password ? (
                  <FieldError errors={[errors.password]} />
                ) : null}
              </Field>

              <Button
                type="submit"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
