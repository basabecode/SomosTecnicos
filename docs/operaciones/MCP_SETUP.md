# Configuración de Agentes MCP: Vercel y Neon

Este documento guía la integración de los servidores MCP (Model Context Protocol) de **Vercel** y **Neon** para potenciar las capacidades del agente AI (Cursor, Claude Desktop, etc.) con acceso directo a la infraestructura y base de datos del proyecto.

## 1. Vercel MCP Server

El servidor MCP de Vercel permite al agente gestionar despliegues, proyectos y leer logs directamente desde la plataforma Vercel.

### Prerrequisitos
- Cuenta en Vercel.
- Node.js instalado.

### Pasos de Configuración

1.  **Obtener Token de Acceso:**
    - Ve a [Vercel Tokens](https://vercel.com/account/tokens).
    - Crea un nuevo token con alcance (scope) suficiente para leer y gestionar tus proyectos.
    - **Copia el token** (no podrás verlo de nuevo).

2.  **Configuración en tu Cliente MCP (ej. Cursor/Claude Desktop):**
    - Añade la siguiente entrada a tu archivo de configuración de MCP (usualmente `claude_desktop_config.json` o similar en Cursor):

    ```json
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@vercel/mcp"
      ],
      "env": {
        "VERCEL_API_TOKEN": "TU_TOKEN_DE_VERCEL_AQUI"
      }
    }
    ```

---

## 2. Neon MCP Server

El servidor MCP de Neon permite al agente interactuar con tu base de datos Postgres serverless, ejecutar consultas SQL, ver esquemas y gestionar ramas de base de datos.

### Prerrequisitos
- Cuenta en Neon.tech.
- Proyecto Neon creado.

### Pasos de Configuración

1.  **Obtener API Key:**
    - Ve a la [Consola de Neon](https://console.neon.tech/app/settings/api-keys).
    - Genera una nueva API Key.
    - **Copia la API Key**.

2.  **Configuración en tu Cliente MCP:**
    - Añade la siguiente entrada a tu archivo de configuración:

    ```json
    "neon": {
      "command": "npx",
      "args": [
        "-y",
        "@neondatabase/mcp-server-neon"
      ],
      "env": {
        "NEON_API_KEY": "TU_API_KEY_DE_NEON_AQUI"
      }
    }
    ```

---

## 3. Archivo de Configuración Completo (Ejemplo)

Puedes copiar este bloque en tu archivo de configuración de MCP (reemplazando los tokens):

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp"],
      "env": {
        "VERCEL_API_TOKEN": "TU_TOKEN_DE_VERCEL"
      }
    },
    "neon": {
      "command": "npx",
      "args": ["-y", "@neondatabase/mcp-server-neon"],
      "env": {
        "NEON_API_KEY": "TU_API_KEY_DE_NEON"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "TU_TOKEN_SUPABASE"
      }
    }
  }
}
```

## 4. Validación

Una vez configurado y reiniciado tu agente/IDE:
1.  Pídele al agente: "Lista mis proyectos de Vercel".
2.  Pídele al agente: "Muestra las tablas de mi base de datos Neon".

Si responde correctamente, ¡la integración ha sido exitosa!
