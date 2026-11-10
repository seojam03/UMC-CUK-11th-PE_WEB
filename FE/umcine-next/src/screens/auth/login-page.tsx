"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type SubmitEvent } from "react";

import { TextField } from "../../components/form/text-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { useAuthStore } from "../../stores/auth-store";
import { isValidEmail } from "../../utils/auth/validation";

const DEFAULT_FORM = { email: "", password: "" };

type FormKey = keyof typeof DEFAULT_FORM;

// 8주차: POST /auth/login으로 토큰을 받아 저장하고 홈으로 이동해요.
export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  // TanStack Router의 login 라우트 beforeLoad(redirect)를 옮겼어요.
  // 이미 로그인했다면 로그인 폼 대신 홈으로 보내요. 토큰은 브라우저에만 있으니 브라우저에서 확인해요.
  useEffect(() => {
    if (accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  const isEmailValid = isValidEmail(form.email);
  // 로그인에서는 비밀번호 규칙을 검사하지 않아요. 규칙이 바뀌기 전에 가입한 회원도 로그인할 수 있어야 해요.
  const canSubmit = isEmailValid && form.password.length > 0;
  const emailError = form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식이 아니에요." : null;

  const handleChangeField = (key: FormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  };

  return (
    <main className="flex min-h-[calc(100vh-56px)] justify-center bg-[#f7f8fa] px-4 pt-[110px] pb-16 text-[#17191f]">
      <form className="flex w-full max-w-[300px] flex-col gap-[14px]" onSubmit={handleSubmit} noValidate>
        <h1 className="text-[25px] font-extrabold tracking-[-1px]">로그인</h1>

        <TextField
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          iconSrc="/icons/movie-icons/mail.svg"
          value={form.email}
          onChange={(event) => handleChangeField("email", event.target.value)}
          error={emailError}
        />
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          iconSrc="/icons/movie-icons/lock.svg"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
        />

        <button
          className="mt-1 h-[34px] rounded-[6px] bg-[#4c63d9] text-[10px] font-bold text-white disabled:opacity-40"
          type="submit"
          disabled={!canSubmit || loginMutation.isPending}
        >
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>

        <p className="text-center text-[9px] text-[#8e949e]">
          계정이 없으신가요?{" "}
          <Link className="font-bold text-[#4c63d9] no-underline" href="/signup">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
