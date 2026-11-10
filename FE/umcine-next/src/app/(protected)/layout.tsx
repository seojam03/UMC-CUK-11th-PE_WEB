import { ProtectedLayout } from "@/components/layout/protected-layout";

// (protected)는 Route Group이에요. 괄호 폴더는 주소에 들어가지 않아서 /my, /my/edit 주소는 그대로예요.
// TanStack Router의 (protected)/route.tsx 자리이고, <Outlet /> 대신 children을 받아요.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
