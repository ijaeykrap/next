# 스나이퍼 팩토리 NEXT.js 4기 교육과정

## 1. 프로젝트 설명

해당 프로젝트는 next.js와 Supabase를 활용한 나만의 일정관리(TASK 관리) 웹 어플리케이션 만들기 프로젝트입니다.

supabase를 활용하여 기본적인 `CRUD(Create, Read, Update, Delete)` 기능을 구현하고 `피그마(Figma)` 디자인 시안을 통해 필요한 데이터베이스 간단한 구조설계 연습을 해보았습니다.

해당 프로젝트는 전적으로 Shadcn UI 디자인 시스템을 사용하여 UI/UX 개발을 진행하였습니다.

## 2. 프로젝트 환경 설정

- UI 컴포넌트 설치

  - `npx shadcn@latest add alert-dialog`<br>
  - `npx shadcn@latest add button`<br>
  - `npx shadcn@latest add card`<br>
  - `npx shadcn@latest add dialog`<br>
  - `npx shadcn@latest add input`<br>
  - `npx shadcn@latest add toast`<br>
  - `npx shadcn@latest add checkbox`<br>
  - `npx shadcn@latest add popover`<br>
  - `npx shadcn@latest add skeleton`<br>

- SASS/SCSS 설치: npm i sass
- React 마크다운 에디터 설치: npm i @uiw/react-markdown-editor
- Supabase 연동을 위한 라이브러리 설치: npm install @supabasesupabase-js

## 3. 프로젝트 구조

- App Router 기반 페이지 라우팅이 이루어져 `app` 폴더 하위에는 페이지 관리된 파일이 위치합니다.

- `public` 폴더를 따로 생성하여 assets와 styles 폴더를 생성하였습니다.

  - assets : 정적 자원을 관리합니다. (예:이미지, 아이콘, 폰트 등)
  - styles : CSS 파일을 관리합니다. (해당 프로젝트는 교육과정이니 만큼 Tailwind CSS와 SCSS를 섞어 진행합니다.)

- `components` 해당 프로젝트에서 사용되는 UI를 관리하는 폴더입니다.

  - ui : Shadcn UI에서 제공되는 Base UI가 설치되어 관리됩니다.
  - common : 비교적 큰 UI 및 기능을 담당하고 있는 UI를 관리합니다.

- `hooks` 같은 기능을 여러 곳에서 사용하는 함수들을 관리하는 폴더입니다.

  - `api` : Supabase에서 제공되는 CRUD 로직을 바탕으로 해당 프로젝트에 맞게 커스텀
  - `use-email` : 이메일 양식 Validation Check
  - `use-toast` : Toast UI

- `lib` Shadcn UI를 사용하기 위한 util 함수 및 Supabase 연동을 위한 서버 생성 코드들을 관리하는 폴더입니다.

  - `stores` : Jotai를 사용해서 전역으로 사용하는 State (상태 값) 관리

- `type` 타입 관리 폴더

## 4. 기존 프로젝트

[TASK]

- `TASK 생성` : Add New Page 버튼 클릭 시, Task 생성
- `TASK 검색` : Supabase "todo" DB 테이블 내에 존재하는 TASK 필터링
- `TASK 조회` : useParam의 id값을 추출하여 DB의 Primary Key와 비교하여 TASK 조회
- `TASK 삭제` : `/board/:id` 페이지의 `삭제` 버튼 클릭 시, TASK 삭제
- `TASK 수정` : title, start_date, end_date 필수 값을 param으로 사용하여 Update

[BOARD]

- `BOARD 생성` : Add New Board 버튼을 눌렀을 때, BOARD 생성 (단, boards 칼럼을 todo 테이블에서 관리하기 때문에 insert 방식이 아닌 update 방식을 사용)
- `BOARD 조회` : `task_id`를 기준으로 Supabase의 `eq()` 함수를 사용하여 특정 task_id 값 기준으로 task만 조회하여 boards 추출
- `BOARD 삭제` : `task_id`를 기준으로 Supabase의 `eq()` 함수를 사용하여 특정 task_id 값 기준으로 task를 조회한 후 boards를 업데이트
- `BOARD 수정` : task의 title이 있을 경우, BOARD의 버튼 UI의 텍스트를 Add Contents -> Update Contents로 분기 처리한 후, `생성`과 동일하게 업데이트

## 5. Develop - Auth 추가

[회원가입]

1. 회원가입 UI 생성
2. Required Field : `Email` & `Password`
3. 회원가입 버튼을 눌렀을 떄, 각각의 `필수 입력 값`에 대해서 Validation 체크
   - 이메일 양식이 맞는지, use-email.ts 훅을 사용하여 Validation 체크
   - 비밀번호 최소 길이 혹은 최대 길이 정하기
   - 유저 중복 확인 (Supabase에서 자동으로 반환)
4. 위 상기 사항의 이슈가 없을 경우, 회원가입 진행

[로그인]

1. 로그인 UI 생성
2. Required Field : `Email` & `Password`
3. 로그인 버튼을 눌렀을 때, 각각의 `필수 입력 값`에 대해서 Validation 체크
4. 이메일 양식이 맞는지, use-email.ts 훅을 사용하여 Validation 체크
   - 이메일 양식이 맞는지, use-email.ts 훅을 사용하여 Validation 체크
   - 유저 존재 확인 (Supabase DB에 로그인을 시도한 User가 있는지 자동으로 반환)
     - 만약 있으면 비밀번호 동일여부 체크
     - 만약 없으면 '가입된 계정이 없습니다.' 에러 이셉션 반환
     - 위 이셉션 메세지는 Supabase에서 자동으로 반환
5. 로그인 성공 시, 반환 된 데이터는 Jotai Store에 저장 -> Jotai Persistence를 사용하여 `atomWithStorage` 함수

[로그인 후]

1. 로그인 후, 쿠키에 담긴 user 데이터를 기준으로 middleware.ts 파일에서 페이지 리다이렉션 관리
   - 비로그인 시, `board/:path*` 페이지(콘텐츠 페이지) 접근 불가
   - 로그인 시, 쿠키에 user 데이터가 있다면, `로그인 페이지("/") 접근 방지`
   - task 생성 및 board 생성은 해당 유저에 관련된 TASK에서만 CRUD 기능 권한 및 관리
   - 존재하지 않는 task에 접근하였을 경우, `not-found 페이지("/not-found")로 리다이렉션`
2. 유저 프로필 수정 (닉네임, 휴대폰 번호 변경) 그리고 해당 값은 `빈 값` 허용
3. 이 모든 기능은 Jotai Store에서 관리하는 userAtom 데이터를 참조
4. 비밀번호 변경 기능은 Supabase에서 제공되는 updateUser 매서드를 통해 user_metadata를 관리하여 활용
   - 이메일로 발송된 Reset Confirm 메일을 통해 `비밀번호 변경 페이지("/password-setting")` 접근하여 기능 수행
