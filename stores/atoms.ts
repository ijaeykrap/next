import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Task, User } from "@/type";

/* supabase에 저장되어있는 'todo'테이블 내 모든 데이터 조회 */
/* 전체 tasks 목록 상태 */
export const tasksAtom = atom<Task[]>([]);
/* 개별(단일) task 목록 상태 */
export const taskAtom = atom<Task | null>(null);

/* 유저 상태값 */
export const userAtom = atomWithStorage<User | null>("user", null);
/* atom으로 저장하고 localStorage에도 저장을 해줌 */
