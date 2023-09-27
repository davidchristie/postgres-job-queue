create type job_status as enum ('pending', 'complete', 'failed');

create table jobs (
  id serial primary key,
  created_at timestamptz not null default now(),
  queue varchar(255) not null,
  status job_status not null default('pending')
);

create table executions (
  id serial primary key,
  job_id int,
  timestamp timestamptz not null default now(),
  constraint fk_job foreign key(job_id) references jobs(id)
);
