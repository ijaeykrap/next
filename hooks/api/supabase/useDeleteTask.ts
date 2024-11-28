"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

function useDeleteTask() {
  const { toast } = useToast();
  const router = useRouter();

  const deleteTask = async (taskId: number) => {
    try {
      const { status, error } = await supabase
        .from("todo")
        .delete()
        .eq("id", taskId);

      if (status === 204) {
        toast({
          title: "선택한 TASK가 삭제되었습니다.",
          description: "새로운 TASK가 생기면 언제든 추가해주세요!",
        });
        router.push("/"); //초기 페이지로 이동
      }
      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생하였습니다.",
          description: `Supabase 오류 : ${error.message || "알 수 없는 오류"}`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
      console.error("API 호출 중 오류 발생:", error);
    }
  };
  return deleteTask;
}

export { useDeleteTask };
