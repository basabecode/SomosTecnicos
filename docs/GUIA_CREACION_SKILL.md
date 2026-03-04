# Guía de Validación de Skills para Claude

> Documento de referencia para agentes que revisan, corrigen o validan skills antes de su publicación.

---

## ¿Qué es un skill?

Un skill es una carpeta de instrucciones que enseña a Claude cómo manejar tareas o flujos de trabajo específicos. Está compuesto por:

| Archivo/Carpeta | Obligatorio | Propósito                                       |
| --------------- | ----------- | ----------------------------------------------- |
| `SKILL.md`      | ✅ Sí       | Instrucciones principales con frontmatter YAML  |
| `scripts/`      | ❌ No       | Código ejecutable (Python, Bash, etc.)          |
| `references/`   | ❌ No       | Documentación adicional cargada según necesidad |
| `assets/`       | ❌ No       | Plantillas, fuentes, íconos usados en el output |

---

## REGLAS CRÍTICAS — Violaciones que bloquean el skill

### 🔴 ERROR 1: Nombre de carpeta incorrecto

El nombre de la carpeta del skill **debe** estar en `kebab-case`.

```
✅ CORRECTO:        mi-skill-de-analisis
❌ INCORRECTO:      Mi Skill De Analisis    ← espacios y mayúsculas
❌ INCORRECTO:      mi_skill_de_analisis    ← guiones bajos
❌ INCORRECTO:      MiSkillDeAnalisis       ← PascalCase
❌ INCORRECTO:      claude-mi-skill         ← prefijo reservado
❌ INCORRECTO:      anthropic-skill         ← prefijo reservado
```

**Aviso al agente:** Si el nombre de la carpeta no cumple, renombrar antes de continuar con cualquier otra validación.

---

### 🔴 ERROR 2: Archivo principal mal nombrado

El archivo de instrucciones **debe** llamarse exactamente `SKILL.md`.

```
✅ CORRECTO:   SKILL.md
❌ INCORRECTO: skill.md       ← minúsculas
❌ INCORRECTO: SKILL.MD       ← extensión en mayúsculas
❌ INCORRECTO: Skill.md       ← primera letra mayúscula
❌ INCORRECTO: README.md      ← nombre incorrecto
```

**Aviso al agente:** Si el archivo no se llama exactamente `SKILL.md`, Claude no lo reconocerá. Renombrar es obligatorio.

---

### 🔴 ERROR 3: README.md dentro de la carpeta del skill

**No debe existir** un archivo `README.md` dentro de la carpeta del skill.

```
✅ CORRECTO:
  mi-skill/
  └── SKILL.md

❌ INCORRECTO:
  mi-skill/
  ├── SKILL.md
  └── README.md   ← NO debe estar aquí
```

> Nota: Si el skill se distribuye en GitHub, el `README.md` va en el repositorio raíz, **fuera** de la carpeta del skill.

---

## FRONTMATTER YAML — Validación detallada

El frontmatter es la sección más crítica. Determina si Claude carga o no el skill automáticamente.

### Formato mínimo requerido

```yaml
---
name: nombre-en-kebab-case
description: Qué hace el skill. Úsalo cuando el usuario diga [frases específicas].
---
```

---

### Campo `name` — Reglas

| Regla                                      | Ejemplo correcto     | Ejemplo incorrecto                  |
| ------------------------------------------ | -------------------- | ----------------------------------- |
| Solo kebab-case                            | `analisis-datos`     | `Analisis Datos`                    |
| Sin mayúsculas                             | `mi-skill`           | `Mi-Skill`                          |
| Sin espacios                               | `generador-reportes` | `generador reportes`                |
| Sin prefijos reservados                    | `gestor-proyectos`   | `claude-gestor` / `anthropic-skill` |
| Debe coincidir con el nombre de la carpeta | ✅                   | ❌                                  |

**Aviso al agente:** Si `name` no coincide con el nombre de la carpeta, registrar advertencia de inconsistencia.

---

### Campo `description` — Reglas

Este campo controla **cuándo** Claude decide cargar el skill. Es el más importante para que funcione correctamente.

**Estructura obligatoria:**

```
[QUÉ hace el skill] + [CUÁNDO usarlo — frases de disparo concretas]
```

**Límites técnicos:**

- Máximo: **1024 caracteres**
- Sin etiquetas XML (`<` o `>`)
- Sin comillas sin cerrar

#### Ejemplos de descripciones CORRECTAS ✅

```yaml
# Específico con frases de disparo claras
description: Analiza archivos CSV y genera reportes estadísticos.
  Úsalo cuando el usuario diga "analizar datos", "generar reporte",
  "estadísticas de mi archivo" o suba un archivo .csv.

# Incluye tipo de archivo relevante
description: Crea documentación de handoff de diseño desde archivos Figma.
  Usar cuando el usuario suba archivos .fig, pida "especificaciones de diseño",
  "documentación de componentes" o "handoff diseño-desarrollo".

# Con propuesta de valor clara
description: Flujo completo de onboarding de clientes en PayFlow.
  Maneja creación de cuenta, configuración de pagos y gestión de suscripciones.
  Usar cuando el usuario diga "incorporar nuevo cliente", "configurar suscripción"
  o "crear cuenta PayFlow".
```

#### Ejemplos de descripciones INCORRECTAS ❌

```yaml
# Demasiado vaga — no incluye cuándo usarlo
description: Ayuda con proyectos.

# Sin frases de disparo
description: Crea sistemas de documentación sofisticados de múltiples páginas.

# Demasiado técnica, sin triggers del usuario
description: Implementa el modelo de entidad Proyecto con relaciones jerárquicas.
```

**Aviso al agente:**

- Si la descripción no incluye QUÉ hace → marcar como `ERROR: descripción incompleta`
- Si la descripción no incluye CUÁNDO usarlo → marcar como `ADVERTENCIA: sin frases de disparo`
- Si supera 1024 caracteres → marcar como `ERROR: descripción demasiado larga`
- Si contiene `<` o `>` → marcar como `ERROR: caracteres XML prohibidos`

---

### Campos opcionales del frontmatter

```yaml
---
name: mi-skill
description: Descripción completa con triggers.
license: MIT # Licencia open-source (ej: MIT, Apache-2.0)
allowed-tools: 'Bash(python:*)' # Restricción de herramientas disponibles
metadata:
  author: Nombre Empresa
  version: 1.0.0
  mcp-server: nombre-servidor
  category: productividad
  tags: [automatizacion, reportes]
  documentation: https://ejemplo.com/docs
  support: soporte@ejemplo.com
---
```

**Tipos permitidos en YAML:** strings, números, booleanos, listas, objetos.
**Tipos prohibidos:** ejecución de código dentro del YAML, etiquetas XML.

---

## CUERPO DEL SKILL.md — Estructura recomendada

```markdown
# Nombre del Skill

## Instrucciones

### Paso 1: [Primera acción]

Explicación clara de qué ocurre.
Comando exacto si aplica: `python scripts/proceso.py --input ARCHIVO`
Salida esperada: [describir cómo luce el éxito]

### Paso 2: [Segunda acción]

...

## Ejemplos

### Ejemplo 1: [Escenario común]

Usuario dice: "configura un nuevo proyecto"
Acciones:

1. Obtener estado actual via MCP
2. Crear estructura con parámetros dados
   Resultado: Proyecto creado con enlace de confirmación

## Troubleshooting

### Error: [Mensaje de error común]

Causa: [Por qué ocurre]
Solución: [Cómo resolverlo paso a paso]
```

---

## SISTEMA DE DIVULGACIÓN PROGRESIVA — 3 niveles

Los skills están diseñados para minimizar el uso de tokens:

| Nivel                                   | Contenido                                   | Cuándo se carga                                      |
| --------------------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| **Nivel 1** — Frontmatter YAML          | Resumen mínimo para decidir si es relevante | **Siempre** (en el system prompt)                    |
| **Nivel 2** — Cuerpo del SKILL.md       | Instrucciones completas del workflow        | Cuando Claude determina que el skill es relevante    |
| **Nivel 3** — Archivos en `references/` | Documentación técnica detallada             | Solo cuando las instrucciones principales lo indican |

**Implicación para el agente:** El cuerpo del SKILL.md debe mantenerse bajo **5,000 palabras**. Si es más largo, los detalles deben moverse a `references/` y enlazarse desde el cuerpo.

---

## CHECKLIST COMPLETA DE VALIDACIÓN

### Antes de empezar

- [ ] Se identificaron 2-3 casos de uso concretos
- [ ] Las herramientas necesarias están identificadas (built-in o MCP)
- [ ] La estructura de carpetas está planificada

### Estructura de archivos

- [ ] Carpeta nombrada en kebab-case
- [ ] Archivo llamado exactamente `SKILL.md` (case-sensitive)
- [ ] No existe `README.md` dentro de la carpeta del skill
- [ ] Scripts en `scripts/`, referencias en `references/`, recursos en `assets/`

### Frontmatter YAML

- [ ] Delimitadores `---` al inicio y al final del bloque YAML
- [ ] Campo `name` en kebab-case, sin espacios, sin mayúsculas
- [ ] Campo `name` coincide con el nombre de la carpeta
- [ ] Campo `description` presente
- [ ] `description` incluye QUÉ hace el skill
- [ ] `description` incluye CUÁNDO usarlo (frases de disparo)
- [ ] `description` tiene menos de 1024 caracteres
- [ ] No hay etiquetas XML (`<` `>`) en ningún campo
- [ ] No hay comillas sin cerrar en el YAML

### Cuerpo de instrucciones

- [ ] Instrucciones claras y accionables (no ambiguas)
- [ ] Se incluye manejo de errores comunes
- [ ] Se incluyen ejemplos de uso
- [ ] Referencias externas están enlazadas correctamente
- [ ] El archivo no supera las 5,000 palabras
- [ ] Detalles extensos están en `references/`, no en el cuerpo principal

### Pruebas de comportamiento

- [ ] El skill se dispara con consultas obvias y directas
- [ ] El skill se dispara con consultas parafraseadas
- [ ] El skill NO se dispara en temas no relacionados
- [ ] Las pruebas funcionales producen el output esperado
- [ ] El manejo de errores funciona en casos borde

---

## DIAGNÓSTICO DE PROBLEMAS COMUNES

### 🟡 El skill nunca se dispara automáticamente

**Síntoma:** Claude no carga el skill aunque la tarea es relevante.

**Causas y soluciones:**

| Causa                    | Señal                         | Solución                                    |
| ------------------------ | ----------------------------- | ------------------------------------------- |
| Descripción muy genérica | "Ayuda con tareas"            | Agregar frases exactas que diría el usuario |
| Sin keywords relevantes  | No menciona el dominio        | Incluir términos técnicos del área          |
| Triggers muy formales    | Usuarios hablan informalmente | Incluir variaciones coloquiales             |

**Técnica de diagnóstico:** Preguntarle a Claude: _"¿Cuándo usarías el skill [nombre]?"_ — Claude citará la descripción. Ajustar según lo que falte.

---

### 🟡 El skill se dispara en exceso

**Síntoma:** El skill se carga para consultas no relacionadas.

**Soluciones:**

```yaml
# Opción 1: Agregar disparadores negativos
description: Análisis avanzado de datos para archivos CSV.
  Usar para modelado estadístico, regresión, clustering.
  NO usar para exploración simple de datos ni visualizaciones básicas.

# Opción 2: Ser más específico en el dominio
# En lugar de:
description: Procesa documentos

# Usar:
description: Procesa documentos PDF legales para revisión de contratos
```

---

### 🟡 Claude carga el skill pero no sigue las instrucciones

**Causas comunes:**

| Causa                             | Solución                                                        |
| --------------------------------- | --------------------------------------------------------------- |
| Instrucciones muy verbosas        | Usar listas numeradas y bullets, mover detalles a `references/` |
| Instrucciones ambiguas            | Usar lenguaje imperativo y explícito                            |
| Instrucciones enterradas al final | Poner lo crítico al inicio, usar encabezados `## IMPORTANTE`    |
| Pasos críticos poco enfatizados   | Agregar `CRÍTICO:` antes de validaciones obligatorias           |

**Ejemplo de instrucción ambigua vs. clara:**

```markdown
❌ AMBIGUA:
Asegúrate de validar las cosas correctamente antes de continuar.

✅ CLARA:
CRÍTICO: Antes de llamar a `crear_proyecto`, verificar que:

- El nombre del proyecto no esté vacío
- Al menos un miembro del equipo esté asignado
- La fecha de inicio no sea en el pasado
  Si alguna condición falla, detener y notificar al usuario.
```

---

### 🟡 El skill es lento o degrada el rendimiento

**Causas y soluciones:**

| Causa                                       | Solución                                      |
| ------------------------------------------- | --------------------------------------------- |
| `SKILL.md` muy grande (+5,000 palabras)     | Mover documentación detallada a `references/` |
| Más de 20-50 skills activos simultáneamente | Recomendar activación selectiva               |
| Todo el contenido cargado sin progresión    | Restructurar usando el sistema de 3 niveles   |

---

### 🔴 Errores de carga — Mensajes y soluciones

| Mensaje de error                               | Causa                                         | Solución                                                      |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `"Could not find SKILL.md in uploaded folder"` | El archivo no se llama exactamente `SKILL.md` | Renombrar con case-sensitive correcto                         |
| `"Invalid frontmatter"`                        | Error de formato YAML                         | Verificar delimitadores `---`, comillas cerradas, indentación |
| `"Invalid skill name"`                         | El `name` tiene espacios o mayúsculas         | Convertir a kebab-case                                        |
| `"Description too long"`                       | Más de 1024 caracteres                        | Acortar la descripción, mover detalles al cuerpo              |
| `"Forbidden characters in frontmatter"`        | Hay `<` o `>` en el frontmatter               | Eliminar todas las etiquetas XML                              |

---

## PATRONES DE SKILLS EXITOSOS

### Patrón 1: Creación de documentos y assets

Para workflows que generan outputs consistentes (documentos, presentaciones, código).

```markdown
# Elementos clave:

- Guías de estilo embebidas
- Estructuras de plantilla para output consistente
- Checklist de calidad antes de finalizar
- No requiere herramientas externas
```

### Patrón 2: Orquestación de workflow secuencial

Para procesos multi-paso que deben ejecutarse en orden específico.

```markdown
# Elementos clave:

- Pasos explícitamente ordenados y numerados
- Dependencias entre pasos documentadas
- Validación en cada etapa
- Instrucciones de rollback para fallos
```

### Patrón 3: Coordinación multi-MCP

Para workflows que abarcan múltiples servicios.

```markdown
# Elementos clave:

- Separación clara de fases por servicio
- Documentación del paso de datos entre MCPs
- Validación antes de pasar a la siguiente fase
- Manejo de errores centralizado
```

### Patrón 4: Refinamiento iterativo

Para outputs que mejoran con iteración.

```markdown
# Elementos clave:

- Criterios de calidad explícitos
- Loop de mejora con condición de salida
- Scripts de validación si es posible
- Umbral claro para "suficientemente bueno"
```

### Patrón 5: Inteligencia de dominio

Para skills que agregan conocimiento especializado más allá del acceso a herramientas.

```markdown
# Elementos clave:

- Reglas de dominio embebidas (compliance, seguridad, etc.)
- Lógica de decisión antes de ejecutar acciones
- Trail de auditoría documentado
- Gobernanza y manejo de casos de excepción
```

---

## MÉTRICAS DE ÉXITO

### Cuantitativas

- **Tasa de disparo:** El skill se activa en ≥90% de las consultas relevantes
- **Eficiencia:** Menos llamadas a herramientas que sin el skill
- **Fiabilidad:** 0 llamadas API fallidas por flujo de trabajo completado

### Cualitativas

- El usuario no necesita redirigir a Claude durante el flujo
- Los workflows se completan sin correcciones del usuario
- Resultados consistentes entre sesiones diferentes
- Un usuario nuevo puede completar la tarea en el primer intento

### Señales de alerta post-publicación

| Señal                                    | Problema probable                           |
| ---------------------------------------- | ------------------------------------------- |
| Usuarios activan el skill manualmente    | Undertriggering — mejorar description       |
| Usuarios desactivan el skill             | Overtriggering — agregar triggers negativos |
| Preguntas frecuentes sobre cómo usarlo   | Instrucciones poco claras                   |
| Resultados inconsistentes entre sesiones | Instrucciones ambiguas o falta de ejemplos  |

---

## DISTRIBUCIÓN Y PUBLICACIÓN

### Para uso individual / equipo

1. Comprimir la carpeta del skill como `.zip`
2. Subir en Claude.ai → Configuración → Capabilities → Skills
3. O colocar en el directorio de skills de Claude Code

### Para distribución en GitHub

```
repositorio-raiz/
├── README.md              ← Para visitantes humanos del repo
├── mi-skill/              ← Carpeta del skill (sin README.md adentro)
│   ├── SKILL.md
│   ├── scripts/
│   └── references/
└── docs/
    └── installation.md
```

### Para uso via API

- Usar el endpoint `/v1/skills` para gestión programática
- Agregar skills a solicitudes via parámetro `container.skills`
- Requiere el beta de Code Execution Tool

---

_Documento basado en "The Complete Guide to Building Skills for Claude" — Anthropic._
_Usar como referencia de validación para agentes que revisen skills antes de su publicación._
