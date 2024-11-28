"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import useEmailCheck from "@/hooks/use-email";
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

function SignUpPage() {
  const router = useRouter();
  const { checkEmail } = useEmailCheck();
  const { toast } = useToast();
  /* 회원가입에 필요한 상태 값 */
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  /* 비밀번호 show toggle */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((prevState) => !prevState);

  const signUpNewUser = async () => {
    /* 이메일과 비밀번호가 입력 안 되었을 경우 */
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "기입되지 않은 데이터가 있습니다.",
        description: "이메일과 비밀번호는 필수 값입니다!",
      });
      return; //필수 값이 입력되지 않은 경우라면, 추가 작업은 하지 않고 리턴
    }

    /* 정규식 확인 후 이메일이 올바른 양식으로 작성되지 않은 경우 */
    if (!checkEmail(email)) {
      toast({
        variant: "destructive",
        title: "올바르지 않은 이메일 양식입니다.",
        description: "올바른 이메일 양식을 작성해주세요",
      });
      return;
    }

    /* 비밀번호가 8글자가 안 되는 경우*/
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "비밀번호는 최소 8글자 이상이어야 합니다",
        description: "우리의 정보는 소중하니까요!",
      });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      //console.log(data);
      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
        });
        /* 데이터 잘 있고 에러가 없을 경우 */
      } else if (data && !error) {
        toast({
          title: "회원가입 완료!",
          description: "회원가입이 완료되었습니다. 로그인을 진행해주세요",
        });
        router.push("/"); //로그인 페이지로 이동
      }
    } catch (error) {
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
        {/* 소개 문구 */}
        <div className="flex flex-col items-center mt-10">
          <h4 className="text-lg font-semibold">안녕하세요 👋🏻</h4>
          <div className="flex flex-col items-center justify-center mt-2 mb-4">
            <div className="text-sm text-muted-foreground">
              <small className="text-sm text-[#e79057] font-medium leading-none">
                TASK 관리 앱
              </small>
              에 방문해주셔서 감사합니다.
            </div>
            <p className="text-sm text-muted-foreground">
              서비스를 이용하려면 로그인을 진행해주세요.
            </p>
          </div>
        </div>
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              계정을 생성하기 위해 아래 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-col gap-2 w-full">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요."
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="relative grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요."
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
                간편 회원가입을 원하시면 이전 버튼을 누르세요
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
                onClick={signUpNewUser}
              >
                회원가입
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              이미 계정이 있으신가요?
              <Link href={"/"} className="underline text-sm ml-1">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SignUpPage;
