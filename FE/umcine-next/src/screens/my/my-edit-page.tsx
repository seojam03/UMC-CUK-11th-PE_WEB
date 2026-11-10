"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

import { checkNickname } from "../../api/members/check-nickname";
import type { MemberInfo } from "../../api/members/models";
import { TextField } from "../../components/form/text-field";
import { ProfileAvatar } from "../../components/profile-avatar";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useProfileImageStore } from "../../stores/profile-image-store";
import { isValidNickname } from "../../utils/auth/validation";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// 8주차: 내 정보는 query 캐시(GET /members/me)에서 읽고, 저장은 PATCH /members/me로 보내요.
export function MyEditPage() {
  const meQuery = useMeQuery();

  if (meQuery.isPending) {
    return <EditPageMessage message="내 정보를 불러오는 중입니다..." />;
  }
  if (meQuery.isError) {
    return <EditPageMessage message="내 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />;
  }

  // 불러온 내 정보를 폼의 처음 값으로 써요.
  return <MyEditForm me={meQuery.data} />;
}

function EditPageMessage({ message }: { message: string }) {
  return (
    <main className="grid min-h-[calc(100vh-56px)] place-items-center bg-[#f6f7f9] text-[11px] text-[#8e949e]">
      {message}
    </main>
  );
}

function MyEditForm({ me }: { me: MemberInfo }) {
  const router = useRouter();
  const updateMeMutation = useUpdateMeMutation();
  const savedProfileImageUrl = useProfileImageStore((state) => state.profileImageUrl);
  const setSavedProfileImageUrl = useProfileImageStore((state) => state.setProfileImageUrl);

  const [nickname, setNickname] = useState(me.nickname);
  const [profileImageUrl, setProfileImageUrl] = useState(savedProfileImageUrl);
  const [nicknameCheck, setNicknameCheck] = useState({ isChecking: false, isAvailable: false });
  const [imageError, setImageError] = useState<string | null>(null);

  const trimmedNickname = nickname.trim();
  const isNicknameValid = isValidNickname(nickname);
  // 지금 쓰는 닉네임 그대로면 중복 확인 없이 저장할 수 있어요.
  const isNicknameUnchanged = trimmedNickname === me.nickname;
  const nicknameError = nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : null;

  const isImageChanged = profileImageUrl !== savedProfileImageUrl;
  const hasChanges = !isNicknameUnchanged || isImageChanged;
  const canSave =
    hasChanges && isNicknameValid && (isNicknameUnchanged || nicknameCheck.isAvailable) && !updateMeMutation.isPending;

  const handleChangeNickname = (value: string) => {
    if (nicknameCheck.isChecking) return;
    setNickname(value);
    setNicknameCheck({ isChecking: false, isAvailable: false });
  };

  const handleCheckNickname = async () => {
    if (!isNicknameValid || isNicknameUnchanged || nicknameCheck.isChecking) return;

    setNicknameCheck({ isChecking: true, isAvailable: false });
    try {
      const response = await checkNickname(trimmedNickname);
      setNicknameCheck({ isChecking: false, isAvailable: response.available });
      alert(response.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch {
      setNicknameCheck({ isChecking: false, isAvailable: false });
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // 같은 파일을 다시 골라도 change 이벤트가 일어나도록 값을 비워요.
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 선택할 수 있어요.");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지만 선택할 수 있어요.");
      return;
    }

    setImageError(null);
    // 이미지 업로드 API가 없어서 브라우저 안에서만 쓰는 미리보기 주소를 만들어요.
    setProfileImageUrl(URL.createObjectURL(file));
  };

  const finishEdit = () => {
    alert("회원 정보를 수정했어요.");
    router.push("/my");
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;

    // 프로필 이미지는 클라이언트 상태라 store에만 저장해요.
    if (isImageChanged) {
      setSavedProfileImageUrl(profileImageUrl);
    }

    // 닉네임이 그대로면 서버에 보낼 필요가 없어요.
    if (isNicknameUnchanged) {
      finishEdit();
      return;
    }

    // 성공하면 hook에서 ["members", "me"] 캐시를 응답 값으로 바꿔서, 헤더와 마이페이지에 새 닉네임이 바로 보여요.
    updateMeMutation.mutate({ nickname: trimmedNickname }, { onSuccess: finishEdit });
  };

  const handleWithdraw = () => {
    if (!confirm("정말 탈퇴할까요? 작성한 평점, 후기와 즐겨찾기가 모두 삭제돼요.")) return;
    alert("회원 탈퇴 API는 아직 제공되지 않아요.");
  };

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#f6f7f9] text-[#17191f]">
      <form
        className="mx-auto w-[min(calc(100%-76px),900px)] pt-[22px] pb-[30px] max-[700px]:w-[calc(100%-32px)]"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="mb-[14px] flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[25px] font-extrabold tracking-[-1px]">내 정보 수정</h1>
            <p className="mt-1 text-[10px] text-[#8e949e]">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button
            className="h-[28px] shrink-0 rounded-[6px] bg-[#4c63d9] px-3 text-[10px] font-bold text-white disabled:opacity-40"
            type="submit"
            disabled={!canSave}
          >
            {updateMeMutation.isPending ? "저장 중" : "변경사항 저장"}
          </button>
        </div>

        <article className="flex gap-8 rounded-[8px] border border-[#e4e6ea] bg-white p-[20px] max-[700px]:flex-col max-[700px]:gap-5">
          <div className="flex w-[140px] flex-col items-center gap-2 text-center max-[700px]:w-full">
            <label className="relative cursor-pointer" aria-label="프로필 이미지 선택">
              <ProfileAvatar className="h-[84px] w-[84px]" imageUrl={profileImageUrl} />
              <span className="absolute right-0 bottom-0 grid h-[24px] w-[24px] place-items-center rounded-full border-2 border-white bg-[#4c63d9]">
                <Image className="h-[11px] w-[11px] invert" src="/icons/movie-icons/edit.svg" alt="" aria-hidden="true" width={11} height={11} />
              </span>
              <input className="sr-only" type="file" accept="image/*" onChange={handleChangeImage} />
            </label>
            <p className="text-[10px] font-bold">프로필 이미지</p>
            <p className="text-[8px] text-[#8e949e]">선택 사항 · 최대 5MB</p>
            {imageError ? <p className="text-[8px] text-[#ef4444]">{imageError}</p> : null}
          </div>

          <div className="flex flex-1 flex-col gap-[14px]">
            <TextField
              label="닉네임"
              name="nickname"
              placeholder="2~12자"
              value={nickname}
              onChange={(event) => handleChangeNickname(event.target.value)}
              disabled={nicknameCheck.isChecking || updateMeMutation.isPending}
              error={nicknameError}
              action={
                <button
                  className="shrink-0 text-[9px] font-bold text-[#4c63d9] disabled:text-[#b6bcc6]"
                  type="button"
                  disabled={!isNicknameValid || isNicknameUnchanged || nicknameCheck.isChecking}
                  onClick={handleCheckNickname}
                >
                  {nicknameCheck.isChecking ? "확인 중" : nicknameCheck.isAvailable ? "확인 완료" : "중복 확인"}
                </button>
              }
            />
            <TextField
              label="이메일"
              name="email"
              type="email"
              value={me.email}
              readOnly
              disabled
              hint="이메일은 변경할 수 없어요."
            />
          </div>
        </article>

        <article className="mt-[14px] flex items-center justify-between gap-3 rounded-[8px] border border-[#f5c2c2] bg-[#fff5f5] p-[16px] max-[700px]:flex-col max-[700px]:items-start">
          <div>
            <h2 className="text-[11px] font-bold text-[#d93636]">회원 탈퇴</h2>
            <p className="mt-1 text-[9px] text-[#a05252]">
              탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
            </p>
          </div>
          <button
            className="h-[28px] shrink-0 rounded-[6px] border border-[#ef4444] bg-white px-3 text-[10px] font-bold text-[#ef4444]"
            type="button"
            onClick={handleWithdraw}
          >
            회원 탈퇴
          </button>
        </article>
      </form>
    </main>
  );
}
