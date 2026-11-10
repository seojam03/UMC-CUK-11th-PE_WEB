import Image from "next/image";
import { cn } from "../utils/cn";

type ProfileAvatarProps = {
  imageUrl: string | null;
  className?: string;
};

// 프로필 이미지가 없으면 사람 아이콘을 보여줘요.
export function ProfileAvatar({ imageUrl, className }: ProfileAvatarProps) {
  return (
    <div className={cn("grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8ebf8]", className)}>
      {imageUrl ? (
        // 브라우저에서 고른 파일의 blob: 미리보기 주소라 서버(next/image)가 받아 올 수 없어서 <img>를 그대로 써요.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="h-full w-full object-cover" src={imageUrl} alt="프로필 이미지" />
      ) : (
        <Image className="h-1/2 w-1/2 opacity-60" src="/icons/movie-icons/person.svg" alt="" aria-hidden="true" width={24} height={24} />
      )}
    </div>
  );
}
