-- =====================================================================
--  CONFIGURACIÓN DE SUPABASE — Sistema de Certificados
--  Pegá TODO este script en:  Supabase → SQL Editor → New query → Run
-- =====================================================================

-- 1) TABLA DE REGISTROS ------------------------------------------------
--    Guarda una fila por cada certificado generado.
create table if not exists public.registros (
  id            uuid primary key default gen_random_uuid(),
  nombre        text        not null,
  email         text        not null,
  dni           text,
  sector        text,
  capacitacion  text        not null,
  fecha         date        not null,
  instructor    text,
  codigo        text,
  creado_en     timestamptz not null default now()
);

-- 2) ACTIVAR ROW LEVEL SECURITY ---------------------------------------
--    Con RLS activado y SIN política de SELECT para el público,
--    nadie con la clave anónima puede LEER la tabla. Solo vos, desde el
--    panel de Supabase (que usa la clave de servicio), ves los datos.
alter table public.registros enable row level security;

-- 3) POLÍTICA: PERMITIR SOLO INSERTAR ---------------------------------
--    El rol "anon" (cualquier visitante del sitio) puede AGREGAR su
--    registro, pero no leer, editar ni borrar nada.
drop policy if exists "permitir_insertar_registros" on public.registros;

create policy "permitir_insertar_registros"
  on public.registros
  for insert
  to anon
  with check (true);

-- =====================================================================
--  IMPORTANTE:
--  - NO creamos política de SELECT a propósito → los datos quedan
--    privados. Si alguien intenta leer la tabla con la clave pública,
--    Supabase le devuelve vacío.
--  - Para ver / exportar los registros: entrá a
--    Supabase → Table Editor → registros  (o usá el SQL Editor).
-- =====================================================================

-- 4) CONSULTAS ÚTILES PARA LAS ESTADÍSTICAS QUE TE PIDA TU JEFE --------
--    (Ejecutalas desde el SQL Editor cuando las necesites)

-- Todos los registros, del más nuevo al más viejo:
--   select nombre, email, capacitacion, fecha, creado_en
--   from public.registros
--   order by creado_en desc;

-- Cuántas personas por cada capacitación:
--   select capacitacion, count(*) as total
--   from public.registros
--   group by capacitacion
--   order by total desc;

-- Cuántos registros por día:
--   select fecha, count(*) as asistentes
--   from public.registros
--   group by fecha
--   order by fecha desc;
