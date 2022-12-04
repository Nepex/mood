-- Load extensions
create extension if not exists "uuid-ossp";

-- Create functions
create function public.uid() returns text AS $body$
select
	lower(replace(uuid_generate_v4() :: text, '-', ''));
$body$ language sql;

-- Create types
create type public.user_roles_enum as enum ('user', 'moderator', 'admin');
create type public.user_settings_color_theme as enum ('light', 'dark');

-- Create users
create table public.user(
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	email varchar(60) not null,
	password varchar(255) not null,
	created_at timestamp with time zone not null default now(),
	updated_at timestamp with time zone not null default now(),

	constraint "uq_users_uid" unique (uid),
	constraint "uq_users_email" unique (email)
);

-- Create user roles
create table public.user_roles (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer NOT NULL,
	roles user_roles_enum[] not null default '{user}'::user_roles_enum[],
	created_at timestamp with time zone not null default now(),
	updated_at timestamp with time zone not null default now(),

	constraint "uq_user_roles_uid" unique (uid),
	constraint "uq_user_roles_user_id" unique (user_id),
	constraint "fk_user_roles_users_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_user_roles_user_id on public.user_roles (user_id);

-- Create user settings
create table public.user_settings (
	id serial not null primary key,
	uid varchar(32) not null default public.uid(),
	user_id integer NOT NULL,
	roles user_settings_color_theme[] not null default '{light}'::user_settings_color_theme[],
	created_at timestamp with time zone not null default now(),
	updated_at timestamp with time zone not null default now(),

	constraint "uq_user_settings_uid" unique (uid),
	constraint "uq_user_settings_user_id" unique (user_id),
	constraint "fk_user_settings_users_user_id" foreign key (user_id) 
		references public.user (id) on delete cascade
);
create index ix_user_settings_user_id on public.user_settings (user_id);
