-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "customer_id" INTEGER,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "tipo_electrodomestico" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "anio" INTEGER,
    "tipo_servicio" TEXT NOT NULL,
    "descripcion_problema" TEXT,
    "urgencia" TEXT NOT NULL,
    "fecha_preferida" TIMESTAMP(3),
    "horario" TEXT,
    "comentarios" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "prioridad" INTEGER NOT NULL DEFAULT 1,
    "costo_estimado" DECIMAL(10,2),
    "costo_final" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fecha_completado" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicians" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "especialidades" JSONB NOT NULL,
    "zona_trabajo" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "ordenes_completadas" INTEGER NOT NULL DEFAULT 0,
    "calificacion_promedio" DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    "tiempo_promedio_servicio" INTEGER,
    "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_actividad" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terms_accepted_at" TIMESTAMP(3),
    "terms_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technicians_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "technician_id" INTEGER NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_programada" TIMESTAMP(3),
    "fecha_inicio" TIMESTAMP(3),
    "fecha_completada" TIMESTAMP(3),
    "notas_asignacion" TEXT,
    "notas_tecnico" TEXT,
    "tiempo_estimado" INTEGER,
    "tiempo_real" INTEGER,
    "estado" TEXT NOT NULL DEFAULT 'asignado',
    "razon_cancelacion" TEXT,
    "costo_mano_obra" DECIMAL(10,2),
    "costo_repuestos" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_history" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "estado_anterior" TEXT,
    "estado_nuevo" TEXT NOT NULL,
    "changed_by" TEXT NOT NULL,
    "changed_by_id" TEXT,
    "notas" TEXT,
    "razon" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "is_onboarded" BOOLEAN NOT NULL DEFAULT false,
    "preferencias" JSONB,
    "last_login" TIMESTAMP(3),
    "terms_accepted_at" TIMESTAMP(3),
    "terms_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT,
    "user_id" TEXT NOT NULL,
    "user_type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT NOT NULL,
    "canal" TEXT NOT NULL DEFAULT 'system',
    "destinatario" TEXT NOT NULL,
    "asunto" TEXT,
    "mensaje" TEXT NOT NULL,
    "metadata" JSONB,
    "plantilla" TEXT,
    "enviado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_envio" TIMESTAMP(3),
    "entregado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_entrega" TIMESTAMP(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "max_intentos" INTEGER NOT NULL DEFAULT 3,
    "error_mensaje" TEXT,
    "ultimo_error" TIMESTAMP(3),
    "programada_para" TIMESTAMP(3),
    "prioridad" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "telefono" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "permisos" JSONB,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "login_attempts" INTEGER NOT NULL DEFAULT 0,
    "account_locked" BOOLEAN NOT NULL DEFAULT false,
    "lock_until" TIMESTAMP(3),
    "preferencias" JSONB,
    "zona" TEXT,
    "idioma" TEXT NOT NULL DEFAULT 'es',
    "terms_accepted_at" TIMESTAMP(3),
    "terms_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "descripcion" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'string',
    "categoria" TEXT,
    "es_publico" BOOLEAN NOT NULL DEFAULT false,
    "updated_by" TEXT,
    "validation_rule" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_types" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "icono" TEXT,
    "color" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "costo_base" DECIMAL(10,2),
    "tiempo_estimado" INTEGER,
    "especialidades_requeridas" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_zones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "coordenadas" JSONB,
    "cobertura" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "costo_adicional" DECIMAL(10,2),
    "tiempo_adicional" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT NOT NULL,
    "client_address" TEXT NOT NULL,
    "client_city" TEXT NOT NULL,
    "client_document" TEXT,
    "service_type" TEXT NOT NULL,
    "service_description" TEXT NOT NULL,
    "appliance_type" TEXT NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "iva" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "labor_cost" DECIMAL(10,2),
    "parts_cost" DECIMAL(10,2),
    "transport_cost" DECIMAL(10,2),
    "payment_method" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "payment_date" TIMESTAMP(3),
    "payment_reference" TEXT,
    "pdf_url" TEXT,
    "pdf_path" TEXT,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "email_sent_at" TIMESTAMP(3),
    "whatsapp_sent" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_sent_at" TIMESTAMP(3),
    "fiscal_year" INTEGER NOT NULL,
    "fiscal_month" INTEGER NOT NULL,
    "notes" TEXT,
    "internal_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technician_applications" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "especialidades" JSONB NOT NULL,
    "zona_preferida" TEXT NOT NULL,
    "experiencia_anios" INTEGER,
    "documentos_url" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "motivo_rechazo" TEXT,
    "revisado_por" INTEGER,
    "fecha_revision" TIMESTAMP(3),
    "notas_admin" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technician_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_estado_idx" ON "orders"("estado");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "orders_email_idx" ON "orders"("email");

-- CreateIndex
CREATE INDEX "orders_tipo_electrodomestico_idx" ON "orders"("tipo_electrodomestico");

-- CreateIndex
CREATE INDEX "orders_customer_id_idx" ON "orders"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_telefono_key" ON "technicians"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_email_key" ON "technicians"("email");

-- CreateIndex
CREATE UNIQUE INDEX "technicians_cedula_key" ON "technicians"("cedula");

-- CreateIndex
CREATE INDEX "technicians_activo_idx" ON "technicians"("activo");

-- CreateIndex
CREATE INDEX "technicians_disponible_idx" ON "technicians"("disponible");

-- CreateIndex
CREATE INDEX "technicians_zona_trabajo_idx" ON "technicians"("zona_trabajo");

-- CreateIndex
CREATE INDEX "assignments_order_id_idx" ON "assignments"("order_id");

-- CreateIndex
CREATE INDEX "assignments_technician_id_idx" ON "assignments"("technician_id");

-- CreateIndex
CREATE INDEX "assignments_fecha_programada_idx" ON "assignments"("fecha_programada");

-- CreateIndex
CREATE INDEX "assignments_estado_idx" ON "assignments"("estado");

-- CreateIndex
CREATE INDEX "order_history_order_id_idx" ON "order_history"("order_id");

-- CreateIndex
CREATE INDEX "order_history_created_at_idx" ON "order_history"("created_at");

-- CreateIndex
CREATE INDEX "order_history_changed_by_idx" ON "order_history"("changed_by");

-- CreateIndex
CREATE UNIQUE INDEX "customers_username_key" ON "customers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE INDEX "notifications_user_id_user_type_idx" ON "notifications"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_order_id_idx" ON "notifications"("order_id");

-- CreateIndex
CREATE INDEX "notifications_tipo_idx" ON "notifications"("tipo");

-- CreateIndex
CREATE INDEX "notifications_enviado_idx" ON "notifications"("enviado");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_username_idx" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "admin_users_email_idx" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "admin_users_role_idx" ON "admin_users"("role");

-- CreateIndex
CREATE INDEX "admin_users_activo_idx" ON "admin_users"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_categoria_idx" ON "system_settings"("categoria");

-- CreateIndex
CREATE INDEX "system_settings_es_publico_idx" ON "system_settings"("es_publico");

-- CreateIndex
CREATE UNIQUE INDEX "service_types_nombre_key" ON "service_types"("nombre");

-- CreateIndex
CREATE INDEX "service_types_activo_idx" ON "service_types"("activo");

-- CreateIndex
CREATE INDEX "service_types_orden_idx" ON "service_types"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "work_zones_nombre_key" ON "work_zones"("nombre");

-- CreateIndex
CREATE INDEX "work_zones_activo_idx" ON "work_zones"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_order_id_idx" ON "invoices"("order_id");

-- CreateIndex
CREATE INDEX "invoices_invoice_number_idx" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_client_email_idx" ON "invoices"("client_email");

-- CreateIndex
CREATE INDEX "invoices_fiscal_year_fiscal_month_idx" ON "invoices"("fiscal_year", "fiscal_month");

-- CreateIndex
CREATE INDEX "invoices_payment_status_idx" ON "invoices"("payment_status");

-- CreateIndex
CREATE UNIQUE INDEX "technician_applications_cedula_key" ON "technician_applications"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "technician_applications_email_key" ON "technician_applications"("email");

-- CreateIndex
CREATE INDEX "technician_applications_estado_idx" ON "technician_applications"("estado");

-- CreateIndex
CREATE INDEX "technician_applications_created_at_idx" ON "technician_applications"("created_at");

-- CreateIndex
CREATE INDEX "technician_applications_email_idx" ON "technician_applications"("email");

-- CreateIndex
CREATE INDEX "technician_applications_cedula_idx" ON "technician_applications"("cedula");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technicians"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_history" ADD CONSTRAINT "order_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
