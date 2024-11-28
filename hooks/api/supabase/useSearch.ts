"use client";

import { useAtom, useAtomValue } from "jotai";
import { userAtom, tasksAtom } from "@/stores/atoms";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

function useSearch() {
  const { toast } = useToast();
  const user = useAtomValue(userAtom);
  const [, setTasks] = useAtom(tasksAtom);
  const search = async (searchTerm: string) => {
    if (!user) return;
    else {
      try {
        const { data, error, status } = await supabase
          .from("todo")
          .select("*")
          .eq("user_id", user.id)
          .ilike("title", `%${searchTerm}%`);

        if (data && status === 200) {
          setTasks(data);
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
          title: "네트워크 오류",
          description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
        });
      }
    }
  };
  return { search };
}

export { useSearch };
