# Guía de Configuración de Correos Corporativos (SomosTécnicos)

Esta guía explica cómo configurar correos electrónicos con tu dominio (`@somostecnicos.com`) y cómo acceder a ellos. Actualmente, el proyecto usa **Brevo** para enviar correos transaccionales (notificaciones automáticas), pero Brevo no es un proveedor de buzones de correo (Inbox) tradicional.

Para tener cuentas como `info@somostecnicos.com` donde puedas **recibir y leer correos**, necesitas un proveedor de correo externo integrado con tu dominio en Cloudflare.

---

## Estado Actual de Proveedores Gratuitos (2026)
Tras validar las opciones disponibles en el mercado:
- **Zoho Mail**: Mantiene un plan gratuito ("Forever Free") para 5 usuarios, pero es *extremadamente limitado* (solo acceso web/app, sin POP/IMAP, y la opción está muy escondida).
- **Yandex Mail**: **Ya no es gratuito** para dominios personalizados. Desde abril de 2023, forzaron la migración a planes de pago ("Yandex 360 for Business"). No se recomienda.
- **Gmail/Outlook**: De pago (Google Workspace / Microsoft 365).

---

## Opción Recomendada: Cloudflare Email Routing (100% Gratis)
Dado que ya usas Cloudflare para tus DNS, esta es la opción más robusta y totalmente gratuita.

**¿Cómo funciona?**
Tú creas direcciones como `soporte@somostecnicos.com`, y Cloudflare redirige los correos a tu bandeja personal (Gmail, Outlook, etc.).

### Paso 1: Activar Email Routing en Cloudflare
1. Entra a tu panel de **Cloudflare** > Selecciona tu dominio.
2. En el menú lateral, ve a **Email** > **Email Routing**.
3. Haz clic en **Get Started** (o Enable).
4. Cloudflare te pedirá añadir registros DNS automáticamente. Acepta.

### Paso 2: Crear Direcciones (Alias)
1. En la pestaña **Routes**, crea tus direcciones:
   - **Custom Address**: `soporte@somostecnicos.com`
   - **Destination**: `tu_email_personal@gmail.com`
2. Repite para `info`, `admin`, etc.
3. Te llegará un correo de verificación a tu Gmail. Confírmalo.

### Paso 3: Responder correos como "@somostecnicos.com" (Configuración de Envío)

Dado que Cloudflare solo *recibe*, necesitas un servidor externo para *enviar*. Usaremos **Brevo** (que ya tienes configurado) o **Gmail**.

#### Opción A: Usando Gmail (Web)
1. Ve a **Google Account** > Seguridad > Verificación en 2 pasos > **Contraseñas de aplicaciones**. nzyz bfba fzaw yosx
2. Crea una para "Correo" y copia la contraseña de 16 letras.
3. En Gmail: **Configuración** > **Cuentas e importación** > **Enviar mensaje como** > **Añadir otra dirección**.
4. Datos SMTP:
   - **SMTP Server**: `smtp.gmail.com`
   - **Usuario**: `tu_email_personal@gmail.com`
   - **Contraseña**: La contraseña de aplicación.
   - **Puerto**: 587 (TLS).
5. Escribe tu alias (`soporte@somostecnicos.com`) y desmarca "Tratarlo como un alias".
6. Verifica con el código que te llegará.

#### Opción B: Usando Outlook (Web / Desktop) con Brevo SMTP
Outlook.com (Web) ha eliminado la opción de añadir cuentas SMTP externas en cuentas gratuitas. **Solo funciona en Outlook Desktop app** (PC/Mac) o si tienes Microsoft 365 Personal.

**Para Outlook Desktop (App de PC):**
1. Ve a tu cuenta de **Brevo** > **Transactional** > **Settings** > **SMTP Relay**.
2. Obtén tus credenciales:
   - **Servidor**: `smtp-relay.brevo.com`
   - **Puerto**: 587
   - **Login**: Tu email de login de Brevo.
   - **Clave**: Crea una **Clave SMTP** nueva (no es la API Key).
3. En Outlook Desktop:
   - Agrega una nueva cuenta manual (POP/IMAP).
   - **Incoming (Recepción)**: No configures nada o usa los datos de tu correo personal (ya que Cloudflare redirige allí). *Truco: Configúralo como una cuenta "Send Only" si tu versión lo permite, o configura el incoming a un servidor dummy y solo usa el SMTP.*
   - **Outgoing (Envío/SMTP)**: Usa los datos de Brevo anteriores.
   - **More Settings** > **Outgoing Server**: "My outgoing server requires authentication" (Usa los mismos datos).
   - En la pestaña **Advanced**, pon puerto 587 y cifrado STARTTLS.

**Nota Importante**: Para enviar correos desde Brevo SMTP, debes haber autorizado el remitente (`soporte@somostecnicos.com`) en **Brevo > Senders & IPs**. Te llegará un email de validación que debes confirmar.

---

## Opción Alternativa: Zoho Mail (Si necesitas bandeja separada)
Si prefieres tener una bandeja separada y no mezclar con tu Gmail, el plan gratuito de Zoho aun existe pero con condiciones:
1. Ve a [Zoho Mail Pricing](https://www.zoho.com/mail/zohomail-pricing.html).
2. **IMPORTANTE**: Desliza hasta el final (Footer) de la página. Busca un recuadro o enlace pequeño que dice **"Forever Free Plan"**.
3. **Limitación Principal**: No podrás configurar este correo en la app de Correo de Windows o apps de terceros. **Solo** funciona entrando a zoho.com o usando la app oficial de Zoho Mail.

---

## Validación de Yandex Mail (Solicitado)
Se investigó la opción de **Yandex Mail para Dominios**:
- **Estatus**: Actualmente **NO es gratuito** para nuevas cuentas.
- **Cambio**: Pasó a ser parte de "Yandex 360", con un costo aproximado de $3-5 USD/usuario/mes.
- **Conclusión**: No es una alternativa viable si buscas coste cero.
