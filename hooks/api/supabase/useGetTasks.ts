"use client";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { tasksAtom, userAtom } from "@/stores/atoms";
import { useAtom, useAtomValue } from "jotai";

/* supabase의 task를 전체조회 한 후 task(상태값)을 업데이트 시켜주는 훅 */
function useGetTasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useAtom(tasksAtom);
  const user = useAtomValue(userAtom);
  //로그인 한 user 정보 가져오기

  const getTasks = async () => {
    if (!user) return;
    else {
      try {
        const { data, status, error } = await supabase
          .from("todo")
          .select("*")
          .eq("user_id", user.id);
        //로그인 한 user 정보의 id와 task의 user_id 비교
        if (data && status === 200) setTasks(data); //tasksAtom 업데이트
        if (error) {
          toast({
            variant: "destructive",
            title: "에러가 발생하였습니다.",
            description: `Supabase 오류 : ${
              error.message || "알 수 없는 오류"
            }`,
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
    }
  };

  return { getTasks, tasks };
}

export { useGetTasks };
