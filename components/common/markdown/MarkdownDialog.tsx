"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { taskAtom } from "@/stores/atoms";
import { useToast } from "@/hooks/use-toast";
import { useCreateBoard } from "@/hooks/api";

import {
  Button,
  Checkbox,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Separator,
} from "@/components/ui";
import MarkdownEditor from "@uiw/react-markdown-editor";
import { LabelDatePicker } from "@/components/ui";
import { Boards } from "@/type";
interface Props {
  children: React.ReactNode;
  board: Boards;
}

function MarkdownDialog({ children, board }: Props) {
  const { toast } = useToast();
  const [task] = useAtom(taskAtom);
  const updateBoards = useCreateBoard();
  const { id } = useParams();
  /* 상태값 선언 */
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [content, setContent] = useState<string>("내용을 입력하세용");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  /* 등록 버튼 클릭 시 */
  const handleInsert = async (boardId: string) => {
    if (!title || !content) {
      toast({
        variant: "destructive",
        title: "입력되지 않은 데이터가 있습니다.",
        description: "제목과 컨텐츠는 필수값입니다.",
      });
      return;
    }

    try {
      const newBoards = task?.boards.map((board: Boards) => {
        if (board.id === boardId)
          return { ...board, isCompleted, title, startDate, endDate, content };
        return board;
      });
      updateBoards(Number(id), "boards", newBoards);
      handleCloseDialog();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "에러가 발생하였습니다.",
        description: "에러가 발생하였습니다. 문의해주세요.",
      });
    }
  };

  useEffect(() => {
    initState();
  }, [board]);

  /* 취소 버튼 클릭시 다이얼로그 창 닫기 */
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    initState();
  };

  /* 상태값 초기화 */
  const initState = () => {
    setIsCompleted(board.isCompleted || false);
    setTitle(board.title || "");
    setStartDate(board.startDate ? new Date(board.startDate) : undefined);
    setEndDate(board.endDate ? new Date(board.endDate) : undefined);
    setContent(board.content || "내용을 입력하세오");
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col">
          <DialogTitle>
            <div className="flex items-center justify-start gap-2">
              <Checkbox
                className="h-5 w-5 min-w-5"
                checked={isCompleted}
                onCheckedChange={(checked) => {
                  if (typeof checked === "boolean") setIsCompleted(checked);
                }}
              />
              <input
                type="text"
                placeholder="게시물의 제목을 입력하세요."
                className="w-full text-xl outline-none bg-transparent"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            </div>
          </DialogTitle>
          <DialogDescription>
            마크다운 에디터를 사용하여 TODO-BOARD를 예쁘게 꾸며보세요.
          </DialogDescription>
        </DialogHeader>
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label={"From"}
            onChange={setStartDate}
            value={startDate}
          />
          <LabelDatePicker label={"To"} onChange={setEndDate} value={endDate} />
        </div>
        <Separator />
        {/* 마크다운 에디터 UI 영역 */}
        <MarkdownEditor
          className="h-[320px]"
          value={content}
          onChange={setContent}
        />
        <DialogFooter>
          <Button type="submit" variant={"outline"} onClick={handleCloseDialog}>
            취소
          </Button>

          <Button
            type="submit"
            onClick={() => handleInsert(board.id)}
            className="text-white bg-[#E79057] hover:bg-[#E26F24] hover:ring-1 hover:ring-[#E26F24] hover:ring-offset-1 active:bg-[#D5753D] hover:shadow-lg"
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { MarkdownDialog };
