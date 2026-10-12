-- =====================================================================
-- CodeZ Academy - thiết lập database (chạy trong Supabase > SQL Editor)
-- An toàn khi chạy lại nhiều lần: không ghi đè bảng/dữ liệu đã có.
-- =====================================================================

-- 1. Bảng khóa học và bảng đăng ký (bỏ qua nếu đã tồn tại)
create table if not exists public.courses (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text,
  price       numeric not null default 0,
  image_url   text
);

create table if not exists public.registrations (
  id           bigint generated always as identity primary key,
  student_name text not null,
  phone        text not null,
  course_id    bigint not null references public.courses(id) on delete cascade,
  created_at   timestamptz not null default now()
);

-- 1b. Sửa bảng registrations ĐÃ TẠO SẴN từ trước (nếu bảng mới tạo ở trên thì các khối
--     này không làm gì).

-- (a) Cột id phải tự tăng + là khóa chính. Nếu trước đây id không có giá trị mặc định
--     thì dòng mới sẽ có id = NULL (nên không sinh được Mã ID đăng ký).
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'registrations'
               and column_name = 'id' and column_default is null and is_identity = 'NO') then
    create sequence if not exists public.registrations_id_seq;
    alter sequence public.registrations_id_seq owned by public.registrations.id;
    perform setval('public.registrations_id_seq',
                   (select coalesce(max(id), 0) from public.registrations) + 1, false);
    -- Gán id cho các dòng đang bị NULL
    update public.registrations set id = nextval('public.registrations_id_seq') where id is null;
    alter table public.registrations alter column id set default nextval('public.registrations_id_seq');
    alter table public.registrations alter column id set not null;
  end if;

  if not exists (select 1 from pg_constraint
                 where conrelid = 'public.registrations'::regclass and contype = 'p') then
    alter table public.registrations add primary key (id);
  end if;
end $$;

-- (b) Số điện thoại phải là chữ (text), nếu là số thì mất số 0 ở đầu (0981660756 -> 981660756).
--     Các số đã lưu bị mất số 0 (ngắn hơn 10 chữ số) được thêm lại số 0.
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'registrations'
               and column_name = 'phone' and data_type <> 'text') then
    alter table public.registrations alter column phone type text
      using (case when length(phone::text) < 10 then lpad(phone::text, 10, '0') else phone::text end);
  end if;
end $$;

-- (c) Các cột bổ sung.
-- Thời điểm đăng ký (dùng để sắp xếp "Khóa học của tôi")
alter table public.registrations
  add column if not exists created_at timestamptz not null default now();

-- Gắn đăng ký với tài khoản đăng nhập (để có mục "Khóa học của tôi").
-- NULL = đăng ký ẩn danh (không cần tài khoản).
alter table public.registrations
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists registrations_user_id_idx on public.registrations(user_id);
create index if not exists registrations_course_id_idx on public.registrations(course_id);

-- 2. Bật Row Level Security
alter table public.courses       enable row level security;
alter table public.registrations enable row level security;

-- 3. Policy. Khách chưa đăng nhập dùng role "anon", người đã đăng nhập dùng role
--    "authenticated" -> cả hai role đều cần policy.

-- Ai cũng được xem khóa học
drop policy if exists "courses_select_anon" on public.courses;
drop policy if exists "courses_select_public" on public.courses;
create policy "courses_select_public" on public.courses
  for select to anon, authenticated using (true);

-- Đăng ký (INSERT): người đăng nhập chỉ được gắn đăng ký với CHÍNH MÌNH,
-- khách ẩn danh thì để user_id trống.
drop policy if exists "registrations_insert_anon" on public.registrations;
drop policy if exists "registrations_insert_public" on public.registrations;
create policy "registrations_insert_public" on public.registrations
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- Xem đăng ký (SELECT): cần để lấy lại ID vừa tạo và để liệt kê "Khóa học của tôi".
drop policy if exists "registrations_select_anon" on public.registrations;
drop policy if exists "registrations_select_public" on public.registrations;
create policy "registrations_select_public" on public.registrations
  for select to anon, authenticated using (true);

-- Hủy đăng ký (DELETE) theo mã ID.
drop policy if exists "registrations_delete_anon" on public.registrations;
drop policy if exists "registrations_delete_public" on public.registrations;
create policy "registrations_delete_public" on public.registrations
  for delete to anon, authenticated using (true);

-- ---------------------------------------------------------------------
-- CẢNH BÁO BẢO MẬT (bản demo): hai policy SELECT/DELETE ở trên cho phép bất kỳ ai
-- đọc toàn bộ họ tên + số điện thoại đã đăng ký, và xóa đăng ký của người khác nếu
-- biết/đoán được ID. Khi chạy thật, thay bằng phiên bản chặt chẽ dưới đây
-- (chỉ chủ tài khoản mới xem/xóa được; đăng ký ẩn danh sẽ không hủy được bằng ID):
--
--   drop policy "registrations_select_public" on public.registrations;
--   drop policy "registrations_delete_public" on public.registrations;
--   create policy "registrations_select_own" on public.registrations
--     for select to authenticated using (user_id = auth.uid());
--   create policy "registrations_delete_own" on public.registrations
--     for delete to authenticated using (user_id = auth.uid());
-- ---------------------------------------------------------------------

-- 4. Dữ liệu mẫu (chỉ thêm khi bảng courses đang trống)
insert into public.courses (title, description, price, image_url)
select * from (values
  ('HTML & CSS cơ bản cho người mới',
   'Xây dựng giao diện web đầu tiên của bạn từ con số 0: cấu trúc HTML, CSS, Flexbox, Grid và responsive.',
   0::numeric, null::text),
  ('JavaScript từ cơ bản đến nâng cao',
   'Nắm vững JavaScript hiện đại: DOM, bất đồng bộ, ES6+ và các dự án thực hành.',
   599000, null),
  ('Xây dựng REST API với Node.js',
   'Thiết kế và triển khai API với Node.js, Express và cơ sở dữ liệu, kèm xác thực người dùng.',
   799000, null)
) as v(title, description, price, image_url)
where not exists (select 1 from public.courses);
