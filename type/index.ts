export interface Task {
  id: number;
  title: string;
  start_date: Date;
  end_date: Date;
  boards: Boards[];
}

export interface Boards {
  id: string; //추후에 supabase의 boards 컬럼을 다른 테이블로 분리할 경우, type이 변경될 수 있음
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  content: string;
  isCompleted: boolean;
}

export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  nickname: string;
  imgUrl: string;
}
