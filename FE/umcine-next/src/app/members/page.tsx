import type { Metadata } from "next";
import { MemberPage } from "@/screens/members/member-page";

export const metadata: Metadata = { title: "회원 목록" };

export default function Members() {
  return <MemberPage />;
}
