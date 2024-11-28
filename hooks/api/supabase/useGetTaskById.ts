"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { taskAtom } from "@/stores/atoms";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";

/* supabase에서 task의 id로 조회 한 후 task 내용 가져오기 */
function useGetTaskById(taskId: number) {
  const { toast } = useToast();
  const [task, setTask] = useAtom(taskAtom);

  const getTaskById = async () => {
    try {
      const { error, data, status } = await supabase
        .from("todo")
        .select("*")
        .eq("id", taskId);

      if (data && status === 200) {
        setTask(data[0]);
      }
      if (error) {
        toast({
          variant: "destructive",
          title: "에러가 발생했습니다.",
          description: `Supabase 오류: ${error.message || "알 수 없는 오류"}`,
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

  useEffect(() => {
    if (taskId) getTaskById();
  }, [taskId]);
  /* taskId가 바뀐다? -> 페이지 이동
  화면에 보여줄 task의 내용도 바뀌어야한다 */

  return { getTaskById, task };
}

export { useGetTaskById };
