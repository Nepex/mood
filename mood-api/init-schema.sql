-- Load extensions
create extension if not exists "uuid-ossp";

-- Create functions
create function public.uid() returns text AS $body$
select
	lower(replace(uuid_generate_v4() :: text, '-', ''));
$body$ language sql;

-- Create types
create type public.roles_enum as enum ('user', 'moderator', 'admin');
-- Other enums don't seem necessary if we're validating at endpoint level

-- Create users
create table public.user(
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	email varchar(60) not null,
	password varchar(255) not null,
	created_at timestamptz not null default CURRENT_TIMESTAMP,
	updated_at timestamptz not null default CURRENT_TIMESTAMP,

	constraint "uq_users_uid" unique (uid),
	constraint "uq_users_email" unique (email)
);

-- Create user roles
create table public.user_roles (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer not null,
	roles roles_enum[] not null default '{user}'::roles_enum[],
	created_at timestamptz not null default CURRENT_TIMESTAMP,
	updated_at timestamptz not null default CURRENT_TIMESTAMP,

	constraint "uq_user_roles_uid" unique (uid),
	constraint "uq_user_roles_user_id" unique (user_id),
	constraint "fk_user_roles_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_user_roles_user_id on public.user_roles (user_id);

-- Create user settings
create table public.user_settings (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer not null,
	created_at timestamptz not null default CURRENT_TIMESTAMP,
	updated_at timestamptz not null default CURRENT_TIMESTAMP,

	constraint "uq_user_settings_uid" unique (uid),
	constraint "uq_user_settings_user_id" unique (user_id),
	constraint "fk_user_settings_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_user_settings_user_id on public.user_settings (user_id);


-- Create journal entries
create table public.journal_entry (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer not null,
	score numeric(10) not null,
	mood varchar(30) not null,
	emoji varchar(30) default null,
	entry varchar(1500) default null,
	entry_at timestamptz not null,
	created_at timestamptz not null default CURRENT_TIMESTAMP,
	updated_at timestamptz not null default CURRENT_TIMESTAMP,

	constraint "uq_journal_entry_uid" unique (uid),
	constraint "fk_journal_entry_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_journal_entry_user_id on public.journal_entry (user_id);


-- Create journal day settings
create table public.journal_day_settings (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer not null,
	notes varchar(1500) default null,
	color varchar(7) not null,
	day varchar(10) not null,
	created_at timestamptz not null default CURRENT_TIMESTAMP,
	updated_at timestamptz not null default CURRENT_TIMESTAMP,

	constraint "uq_journal_day_settings_uid" unique (uid),
	constraint "uq_journal_day_settings_user_id_day" unique (user_id, day),
	constraint "fk_journal_day_settings_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_journal_day_settings_user_id on public.journal_day_settings (user_id);