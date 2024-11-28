"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { userAtom } from "@/stores/atoms";
import { useAtom } from "jotai";
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
import { Eye, EyeOff } from "lucide-react";
import { FindPasswordPopup } from "@/components/common";

function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { checkEmail } = useEmailCheck();
  /* 회원가입에 필요한 상태 값 */
  const [, setUser] = useAtom(userAtom);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  /* 비밀번호 show toggle */
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePassword = () => setShowPassword((prevState) => !prevState);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "기입되지 않은 데이터가 있습니다.",
        description: "이메일과 비밀번호를 입력해주세요",
      });
      return; //필수 값이 입력되지 않은 경우, 추가 작업 없이 종료
    }
    if (!checkEmail(email)) {
      toast({
        variant: "destructive",
        title: "올바르지 않은 이메일 양식입니다.",
        description: "올바른 이메일 양식을 작성해주세요!",
      });
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
        });
      }
      //console.log(data);
      else if (data) {
        toast({
          title: "로그인 완료!",
          description: "로그인이 완료되었습니다. 자유롭게 TASK 관리를 해주세요",
        });

        /* 쿠키에 저장할 user 데이터 */
        const userData = {
          id: data.user?.id || "",
          email: data.user?.email || "",
          phoneNumber: data.user?.user_metadata.phoneNumber || "",
          nickname: data.user?.user_metadata.nickname || "",
          //닉네임이랑 핸드폰 번호 추가
          imgUrl: "/assets/images/profile.jpg",
        };
        document.cookie = `user=${JSON.stringify(
          userData
        )}; path=/; max-age=3600`; //1시간 동안 유효

        /* jotai의 user에 관련된 상태 업데이트 */
        setUser(userData);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "에러가 발생했습니다.",
        description: "에러가 발생했습니다 개발자 도구 창을 확인하세오",
      });
    }
    router.push("/board"); //TODO BOARD 페이지로 이동
  };

  /* 로컬스토리지에 user 데이터 유무 체크 후 리다이렉션 */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) router.push("/board");
  }, [router]);

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
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription>
              로그인을 위한 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요."
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="relative grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <FindPasswordPopup>
                  <p className="ml-auto inline-block text-sm underline cursor-pointer">
                    비밀번호를 잊으셨나요?
                  </p>
                </FindPasswordPopup>
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
                className="absolute top-[38px] right-2 -translate-y-1/4 bg-transparent hover:bg-transparent"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </div>
          </CardContent>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <CardFooter className="flex flex-col mt-6">
            <Button
              className="w-full text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
              onClick={handleLogin}
            >
              로그인
            </Button>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?
              <Link href={"/signup"} className="underline text-sm ml-1">
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
