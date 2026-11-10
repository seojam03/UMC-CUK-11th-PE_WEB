"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";

import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { TextField } from "../../components/form/text-field";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import { isValidEmail, isValidNickname, isValidPassword } from "../../utils/auth/validation";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

const DUPLICATE_LABEL: Record<DuplicateCheckKey, string> = { email: "이메일", nickname: "닉네임" };

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  // 8주차: isSubmitting 상태 대신 useMutation이 요청의 진행·성공·실패를 관리해요.
  const signupMutation = useSignupMutation();

  // 입력값 유효성 검사
  const isEmailValid = isValidEmail(form.email);
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류를 보여줘요.
  const emailError = form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식이 아니에요." : null;
  const nicknameError = form.nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : null;
  const passwordError =
    form.password.length > 0 && !isPasswordValid ? "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요." : null;
  const passwordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : null;

  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  // 입력 조건과 두 중복 확인을 모두 통과해야 제출할 수 있어요.
  const canSubmit = isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: FormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 해요.
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = DUPLICATE_LABEL[key];
    setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: true, isAvailable: false } }));

    try {
      const response = key === "email" ? await checkEmail(form.email.trim()) : await checkNickname(form.nickname.trim());
      setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: false, isAvailable: response.available } }));
      alert(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침을 막아요.
    event.preventDefault();
    if (!canSubmit || signupMutation.isPending) return;

    // 성공(알림 후 /login 이동)과 실패(알림) 처리는 useSignupMutation의 onSuccess·onError에 있어요.
    signupMutation.mutate({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      password: form.password,
    });
  };

  const renderCheckButton = (key: DuplicateCheckKey, isValid: boolean) => (
    <button
      className="shrink-0 text-[9px] font-bold text-[#4c63d9] disabled:text-[#b6bcc6]"
      type="button"
      disabled={!isValid || duplicateCheck[key].isChecking}
      onClick={() => handleCheckDuplicate(key)}
    >
      {duplicateCheck[key].isChecking ? "확인 중" : duplicateCheck[key].isAvailable ? "확인 완료" : "중복 확인"}
    </button>
  );

  return (
    <main className="flex min-h-[calc(100vh-56px)] justify-center bg-[#f7f8fa] px-4 pt-[70px] pb-16 text-[#17191f]">
      {/* noValidate: 브라우저 기본 검사 대신 직접 만든 검사를 써요. */}
      <form className="flex w-full max-w-[300px] flex-col gap-[14px]" onSubmit={handleSubmit} noValidate>
        <h1 className="text-[25px] font-extrabold tracking-[-1px]">회원가입</h1>

        <TextField
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={form.email}
          onChange={(event) => handleChangeField("email", event.target.value)}
          disabled={duplicateCheck.email.isChecking}
          error={emailError}
          action={renderCheckButton("email", isEmailValid)}
        />
        <TextField
          label="닉네임"
          name="nickname"
          placeholder="2~12자"
          value={form.nickname}
          onChange={(event) => handleChangeField("nickname", event.target.value)}
          disabled={duplicateCheck.nickname.isChecking}
          error={nicknameError}
          action={renderCheckButton("nickname", isNicknameValid)}
        />
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="8자 이상"
          value={form.password}
          onChange={(event) => handleChangeField("password", event.target.value)}
          hint="영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요."
          error={passwordError}
        />
        <TextField
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="다시 입력"
          value={form.passwordConfirm}
          onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
          error={passwordConfirmError}
        />

        <button
          className="mt-1 h-[34px] rounded-[6px] bg-[#4c63d9] text-[10px] font-bold text-white disabled:opacity-40"
          type="submit"
          disabled={!canSubmit || signupMutation.isPending}
        >
          {signupMutation.isPending ? "가입 중" : "가입하기"}
        </button>

        <p className="text-center text-[9px] text-[#8e949e]">
          이미 계정이 있나요?{" "}
          <Link className="font-bold text-[#4c63d9] no-underline" href="/login">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
