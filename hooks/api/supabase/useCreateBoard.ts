"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { useAtom } from "jotai";
import { taskAtom } from "@/stores/atoms";

/* supabase에 column 업데이트 -> task(상태값) 업데이트  */
function useCreateBoard() {
  const { toast } = useToast();
  const [, setTask] = useAtom(taskAtom);

  const createBoard = async (taskId: number, column: string, newValue: any) => {
    try {
      const { data, error, status } = await supabase
        .from("todo")
        .update({ [column]: newValue })
        .eq("id", taskId)
        .select(); //데이터 반환

      if (data !== null && status === 200) {
        toast({
          title: "새로운 TODO-BOARD를 생성했습니다",
          description: "생성한 TODO BOARD를 예쁘게 꾸며주세요!",
        });
        setTask(data[0]);
      }

      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생하였습니다.",
          description: `Supabase 오류 : ${error.message || "알 수 없는 오류"}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "에러가 발생하였습니다.",
        description: "에러가 발생하였습니다. 문의해주세요.",
      });
    }
  };
  return createBoard;
}

export { useCreateBoard };
