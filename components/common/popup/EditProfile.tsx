"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/stores/atoms";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
/* UI 컴포넌트 */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Label,
  Input,
} from "@/components/ui";

interface Props {
  children: React.ReactNode;
}

function EditProfilePopup({ children }: Props) {
  const { toast } = useToast();
  const [user, setUser] = useAtom(userAtom);
  const supabase = createClient();
  const [nickname, setNickname] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  /* 핸드폰 번호 입력 양식 변경 정규식 */
  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value.replace(/[^0-9]/g, "");
    const formattedValue = rawValue.replace(
      /^(\d{2,3})(\d{3,4})(\d{4})$/,
      `$1-$2-$3`
    );
    setPhoneNumber(formattedValue);
  };

  const updateUserInfo = async () => {
    try {
      const user = await supabase.auth.getUser(); //로그인된 사용자의 정보 가져오기

      if (user.data) {
        const { data, error } = await supabase.auth.updateUser({
          data: { nickname: nickname, phone_number: phoneNumber },
        });
        if (error) {
          toast({
            variant: "destructive",
            title: "에러가 발생했습니다.",
            description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
          });
        } else if (data && !error) {
          toast({
            title: "프로필 수정을 완료하였습니다.",
          });
          console.log(data);
          const updatedUserData = {
            id: data.user?.id || "",
            email: data.user?.email || "",
            phoneNumber: data.user?.user_metadata.phone_number || "",
            nickname: data.user?.user_metadata.nickname || "",
            imgUrl: "/assets/images/profile.jpg",
          };
          setUser(updatedUserData);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);
  //user가 변경될 때마다 nickname,phoneNumber(상태값)을 변경시켜라

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로필</AlertDialogTitle>
          <AlertDialogDescription>
            변경된 정보가 있으신가요? <br />
            여러분의 프로필을 자유롭게 수정하세요!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" type="email" disabled />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">닉네임</Label>
          <Input
            id="email"
            type="email"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value);
            }}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">휴대폰 번호</Label>
          <Input
            id="email"
            type="email"
            placeholder="휴대폰 번호를 입력하세요"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#E79057] hover:bg-[#E79057]"
            onClick={updateUserInfo}
          >
            전송
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { EditProfilePopup };
