/* =============================================
   app.js — Lógica principal
   ============================================= */

/* =============================================
   CONFIGURACIÓN DE SUPABASE
   Reemplazá estos dos valores con los de TU proyecto.
   Los encontrás en:  Supabase → Project Settings → API
   - SUPABASE_URL       →  "Project URL"
   - SUPABASE_ANON_KEY  →  "Project API keys" → "anon" "public"

   NOTA: la clave "anon" es pública por diseño. No es un secreto:
   los datos están protegidos por las políticas RLS de la base
   (solo se puede INSERTAR, no leer). Por eso es seguro dejarla acá.
   ============================================= */
const SUPABASE_URL      = 'https://pthrdqthzjtcperxatvr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PAf60jpofl-BgK9-Vek5IQ_jU85c4O_';

// La librería cargada por CDN expone "supabase" como variable global.
// Creamos el cliente con otro nombre para no pisarla.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Capacitación personalizada ─────────────────
const selectCap = document.getElementById('capacitacion');
const fieldOtra  = document.getElementById('fieldOtra');

selectCap.addEventListener('change', () => {
  fieldOtra.style.display = selectCap.value === 'Otra' ? 'block' : 'none';
});

// ── Helpers ────────────────────────────────────
function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

function setError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['errorNombre', 'errorEmail', 'errorCapacitacion', 'errorFecha', 'errorConfirma']
    .forEach(id => setError(id, ''));
}

function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function formatFecha(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  const meses = ['enero','febrero','marzo','abril','mayo','junio',
                  'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CERT-';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── Guardar el registro en Supabase ─────────────
// Se llama "en segundo plano": si la base falla, el certificado
// igual se muestra. El error solo queda en la consola del navegador.
async function guardarRegistro(datos) {
  try {
    // IMPORTANTE: no encadenamos .select() — así respetamos el RLS
    // de "solo inserción" (no intentamos leer la fila de vuelta).
    const { error } = await supabaseClient
      .from('registros')
      .insert(datos);

    if (error) {
      console.error('No se pudo guardar el registro:', error.message);
    } else {
      console.log('Registro guardado correctamente.');
    }
  } catch (err) {
    console.error('Error de conexión al guardar el registro:', err);
  }
}

// ── Validación y generación del certificado ────
function generarCertificado() {
  clearErrors();
  let ok = true;

  const nombre = val('nombre');
  const email  = val('email');
  const cap    = val('capacitacion');
  const fecha  = val('fecha');
  const otra   = val('otraCapacitacion');
  const confirma = document.getElementById('confirma').checked;

  if (!nombre) {
    setError('errorNombre', 'Por favor ingresá tu nombre completo.');
    ok = false;
  }

  if (!email) {
    setError('errorEmail', 'Por favor ingresá tu correo electrónico.');
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('errorEmail', 'El correo no parece válido.');
    ok = false;
  }

  if (!cap) {
    setError('errorCapacitacion', 'Seleccioná la capacitación a la que asististe.');
    ok = false;
  }

  if (!fecha) {
    setError('errorFecha', 'Indicá la fecha de la capacitación.');
    ok = false;
  }

  if (!confirma) {
    setError('errorConfirma', 'Debés confirmar tu asistencia para continuar.');
    ok = false;
  }

  if (!ok) {
    showToast('⚠ Revisá los campos requeridos.');
    return;
  }

  // Nombre de curso final
  const cursoFinal = cap === 'Otra' ? (otra || 'Capacitación Google') : cap;

  // Datos secundarios
  const dni        = val('dni');
  const sector     = val('sector');
  const instructor = val('instructor');

  // Código único del certificado
  const codigo = generarCodigo();

  // Poblar certificado
  document.getElementById('certNombre').textContent  = nombre;
  document.getElementById('certCurso').textContent   = cursoFinal;
  document.getElementById('certFecha').textContent   = formatFecha(fecha);
  document.getElementById('certCode').textContent    = codigo;

  document.getElementById('certDni').textContent =
    dni ? `DNI / Legajo: ${dni}` : '';

  document.getElementById('certInstructor').textContent =
    instructor || 'Capacitador';

  document.getElementById('certSector').textContent =
    sector || 'Organización';

  // ── Guardar el registro en la base (sin bloquear la UI) ──
  guardarRegistro({
    nombre,
    email,
    dni:          dni || null,
    sector:       sector || null,
    capacitacion: cursoFinal,
    fecha,                       // 'YYYY-MM-DD' → compatible con columna tipo date
    instructor:   instructor || null,
    codigo,
  });

  // Mostrar / ocultar paneles
  document.getElementById('formPanel').style.display  = 'none';
  document.getElementById('certPanel').style.display  = 'block';

  // Animación del sello
  const seal = document.getElementById('certSeal');
  seal.classList.remove('animate');
  void seal.offsetWidth; // forzar reflow
  seal.classList.add('animate');

  // Scroll al certificado
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('✓ Certificado generado correctamente.');
}

// ── Volver al formulario ────────────────────────
function volverFormulario() {
  document.getElementById('certPanel').style.display = 'none';
  document.getElementById('formPanel').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Descargar PDF ──────────────────────────────
async function descargarPDF() {
  const btn = document.querySelector('.cert-actions .btn--primary');
  btn.textContent = 'Generando…';
  btn.disabled = true;

  try {
    const cert = document.getElementById('certificate');

    const canvas = await html2canvas(cert, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    // Calcular proporciones
    const ratio  = canvas.width / canvas.height;
    let imgW = pdfW - 20;
    let imgH = imgW / ratio;

    if (imgH > pdfH - 20) {
      imgH = pdfH - 20;
      imgW = imgH * ratio;
    }

    const x = (pdfW - imgW) / 2;
    const y = (pdfH - imgH) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgW, imgH);

    const nombre = val('nombre').replace(/\s+/g, '_') || 'certificado';
    pdf.save(`Certificado_${nombre}.pdf`);

    showToast('✓ PDF descargado.');
  } catch (err) {
    console.error(err);
    showToast('⚠ Error al generar el PDF. Intentá de nuevo.');
  } finally {
    btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v13M5 14l7 7 7-7M3 21h18"/></svg> Descargar PDF`;
    btn.disabled = false;
  }
}
