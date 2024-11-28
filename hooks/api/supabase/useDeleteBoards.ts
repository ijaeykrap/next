import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAtom } from "jotai";
import { taskAtom } from "@/stores/atoms";
import { useGetTaskById } from "./useGetTaskById";
import { Boards } from "@/type";

function useDeleteBoards(taskId: number, boardId: string) {
  const { getTaskById } = useGetTaskById(taskId);
  const { toast } = useToast();
  const [task, setTask] = useAtom(taskAtom);

  const deleteBoards = async () => {
    try {
      const { data, status, error } = await supabase
        .from("todo")
        .update({
          boards: task?.boards.filter((board: Boards) => board.id !== boardId),
        })
        .eq("id", taskId);

      if (status === 204) {
        toast({
          title: "선택한 TODO-BOARD가 삭제되었습니다.",
          description: "새로운 할 일이 생기면 TODO-BOARD를 생성해주세요!",
        });
        getTaskById();
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
  return deleteBoards;
}

export { useDeleteBoards };
