"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
/* UI 컴포넌트 */
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { Eye, EyeOff } from "@/public/assets/icons";
import { useToast } from "@/hooks/use-toast";

function PasswordSettingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState<string>(""); //새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState<string>(""); //비밀번호 확인
  /* 비밀번호 show toggle */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((prevState) => !prevState);

  const handleChangePW = async () => {
    /* 입력 안 하고 저장버튼 누를 경우 */
    if (!password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "기입되지 않은 데이터가 있습니다.",
        description: "변경할 비밀번호와 비밀번호 확인은 필수 값입니다!",
      });
      return;
    }
    /* 비밀번호 글자가 8글자 이하일 경우 */
    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "비밀번호는 최소 8자 이상이어야합니다",
        description: "변경할 비밀번호와 비밀번호 확인은 필수 값입니다!",
      });
      return;
    }
    /* 새 비밀번호와 비밀번호 확인이 다를 경우 */
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "입력한 비밀번호가 일치하지 않습니다.",
        description:
          "새 비밀번호와 비밀번호 확인란에 입력한 값이 일치하는지 확인하세요",
      });
      return;
    }
    try {
      /* 패스워드 변경 */
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
        });
      } else if (data && !error) {
        toast({
          title: "비밀번호 변경을 완료하였습니다.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "에러가 발생했습니다.",
        description: "에러가 발생했습니다 개발자 도구 창을 확인하세오",
      });
    }
  };

  return (
    <div className="page">
      <div className="page__container">
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
            <CardDescription>
              비밀번호 변경을 위해 변경할 비밀번호를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col gap-2 w-full">
              <div className="grid gap-2">
                <Label htmlFor="email">새 비밀번호</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="변경할 비밀번호를 입력하세요"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="relative grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호 확인</Label>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 한 번 더 입력하세요"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Button
                  size={"icon"}
                  className="absolute top-[38px] right-2 -translate-y-1/3 bg-transparent hover:bg-transparent"
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                🤓 비밀 번호가 기억나셨다면 돌아가기 버튼을 누르세요
              </span>
            </div>
          </div>
          <CardFooter className="flex flex-col mt-6">
            <div className="grid grid-cols-2 gap-6">
              <Button variant={"outline"} className="w-full">
                이전
              </Button>
              <Button
                className="w-full  bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
                onClick={handleChangePW}
              >
                비밀번호 변경
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있으신가요?
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default PasswordSettingPage;
