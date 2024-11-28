"use client";

/** UI 컴포넌트 */
import { MarkdownDialog } from "@/components/common";
import {
  Button,
  Card,
  Checkbox,
  LabelDatePicker,
  Separator,
} from "@/components/ui";
import { useDeleteBoards } from "@/hooks/api";
import { ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import { Boards } from "@/type";

interface Props {
  board: Boards;
}

function BoardCard({ board }: Props) {
  const { id } = useParams();
  const handleDeleteBoard = useDeleteBoards(Number(id), board.id);
  return (
    <Card className="w-full flex flex-col items-center p-5">
      {/* 게시물 카드 제목 영역*/}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center justify-start gap-2">
          <Checkbox className="h-5 w-5" checked={board.isCompleted} />
          <input
            type="text"
            placeholder="등록된 제목이 없습니다."
            className="text-xl outline-none bg-transparent"
            disabled={true}
            value={board.title}
          />
        </div>
        <Button variant={"ghost"} size={"icon"}>
          <ChevronUp className="text-[#6d6d6d]" />
        </Button>
      </div>
      {/* 캘린더 및 버튼 박스 영역 */}
      <div className="w-full flex items-center justify-between">
        {/* 캘린더 박스 */}
        <div className="flex items-center gap-5">
          <LabelDatePicker
            label={"From"}
            value={board.startDate}
            isReadOnly={true}
          />
          <LabelDatePicker
            label={"To"}
            value={board.endDate}
            isReadOnly={true}
          />
        </div>
        {/* 버튼 박스 */}
        <div className="flex items-center">
          <Button variant={"ghost"} className="font-normal text-[#6D6D6D]">
            Duplicate
          </Button>
          <Button
            variant={"ghost"}
            className="font-normal text-rose-600 hover:text-rose-600 hover:bg-red-50"
            onClick={handleDeleteBoard}
          >
            Delete
          </Button>
        </div>
      </div>
      <Separator className="my-3" />
      {/* Add Contents 버튼 영역 */}
      <MarkdownDialog board={board}>
        <Button variant={"ghost"} className="font-normal text-[#6D6D6D]">
          {board.title ? "Update Contents" : "Add Contents"}
        </Button>
      </MarkdownDialog>
    </Card>
  );
}

export { BoardCard };
