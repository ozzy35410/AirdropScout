create extension if not exists "pgcrypto" with schema public;

create table if not exists public.nft_collections (
    id uuid primary key default gen_random_uuid(),
    chain text not null,
    slug text not null,
    name text not null,
    standard text not null check (standard in ('erc721', 'erc1155')),
    contract text not null,
    image_url text,
    tags text[] not null default '{}',
    mint_url text,
    start_block numeric,
    added_at timestamptz,
    visible boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists nft_collections_chain_slug_key on public.nft_collections(chain, slug);
create index if not exists nft_collections_chain_idx on public.nft_collections(chain);

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp on public.nft_collections;
create trigger set_timestamp
before update on public.nft_collections
for each row execute function public.set_updated_at();

alter table public.nft_collections enable row level security;

do $$
begin
    if not exists (
        select 1 from pg_policies where schemaname = 'public' and tablename = 'nft_collections' and policyname = 'Allow read when visible'
    ) then
        create policy "Allow read when visible" on public.nft_collections
            for select using (visible);
    end if;
end $$;
