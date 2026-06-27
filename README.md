# 🎓 Certificado de Asistencia · Capacitación Google

Sistema de registro de asistencia y generación de certificados para capacitaciones internas.

## 📁 Estructura del proyecto

```
certificado-capacitacion/
├── index.html          # Formulario + visor de certificado
├── css/
│   └── styles.css      # Todos los estilos (tokens de diseño al inicio)
├── js/
│   └── app.js          # Lógica: validación, generación, descarga PDF
└── README.md
```

## 🚀 Cómo usar

1. Abrí `index.html` en cualquier navegador moderno.
2. Completá el formulario con los datos del asistente.
3. Hacé clic en **Generar Certificado**.
4. Revisá la vista previa y descargá el PDF.

> No requiere servidor ni dependencias locales. Usa CDN para html2canvas y jsPDF.

## 🎨 Personalización rápida

Todos los colores, tipografías y espaciados están definidos como **CSS Custom Properties** al inicio de `css/styles.css`:

```css
:root {
  --color-primary:  #1A2F5E;  /* Azul corporativo */
  --color-gold:     #C9A84C;  /* Dorado acento */
  --color-bg:       #F0F3F9;  /* Fondo general */
  --font-display:  'Playfair Display', serif;
  --font-body:     'Inter', sans-serif;
  /* ... */
}
```

Editá estos valores para cambiar toda la apariencia de la app sin tocar el resto del CSS.

## ✏️ Modificar la lista de capacitaciones

En `index.html`, buscá el `<select id="capacitacion">` y agregá o quitá `<option>` según las capacitaciones de tu organización:

```html
<option value="Nombre de la capacitación">Nombre de la capacitación</option>
```

## 📦 Dependencias externas (CDN)

| Librería    | Versión | Uso                          |
|-------------|---------|------------------------------|
| html2canvas | 1.4.1   | Convertir el certificado a imagen |
| jsPDF       | 2.5.1   | Generar el archivo PDF        |

## 🗂️ Git — primeros pasos

```bash
git init
git add .
git commit -m "feat: sistema de registro y certificado de asistencia"
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

## 🧩 Próximas mejoras sugeridas

- [ ] Backend para guardar registros en base de datos
- [ ] Panel de admin con listado de asistentes
- [ ] Firma digital del instructor
- [ ] Envío automático del certificado por email
- [ ] Logo personalizado de la organización

---

Desarrollado para uso interno. Personalizable y sin dependencias de servidor.
