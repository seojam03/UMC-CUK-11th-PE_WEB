import Image from "next/image";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  // 입력창 왼쪽 아이콘 (예: /icons/movie-icons/mail.svg)
  iconSrc?: string;
  // 입력창 안 오른쪽에 붙는 요소 (예: 중복 확인 버튼)
  action?: ReactNode;
  // 입력 아래 안내 문구. error가 있으면 error를 대신 보여줘요.
  hint?: string;
  error?: string | null;
};

// 회원가입, 로그인, 내 정보 수정 화면이 함께 쓰는 입력 필드예요.
export function TextField({ label, iconSrc, action, hint, error, id, className, ...inputProps }: TextFieldProps) {
  const inputId = id ?? inputProps.name;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[10px] font-bold text-[#17191f]" htmlFor={inputId}>
        {label}
      </label>
      <div
        className={cn(
          "flex h-[34px] items-center gap-2 rounded-[6px] border bg-white px-[11px] focus-within:ring-2 focus-within:ring-[#4c63d9]/30",
          error ? "border-[#ef4444]" : "border-[#dfe2e7]",
          inputProps.disabled && "bg-[#f1f2f4]",
        )}
      >
        {iconSrc ? <Image className="h-[13px] w-[13px] opacity-50" src={iconSrc} alt="" aria-hidden="true" width={13} height={13} /> : null}
        <input
          id={inputId}
          className={cn(
            "min-w-0 flex-1 bg-transparent p-0 text-[10px] text-[#343840] outline-none placeholder:text-[#9da3ad] disabled:text-[#8e949e]",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...inputProps}
        />
        {action}
      </div>
      {message ? (
        <p className={cn("text-[8px]", error ? "text-[#ef4444]" : "text-[#8e949e]")}>{message}</p>
      ) : null}
    </div>
  );
}
