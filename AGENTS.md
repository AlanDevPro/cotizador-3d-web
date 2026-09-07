[
  {
    "tabla": "clientes",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "telefono",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "direccion",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "notas",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "nombre",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "clientes",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "clientes",
    "columna": "user_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "cotizacion_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "cotizaciones",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "impresora_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "impresoras",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "filamento_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "filamentos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "nombre_pieza",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "cantidad",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "peso_gramos",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_impresion_horas",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_preparacion_minutos",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "tiempo_postprocesado_minutos",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_material",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_energia",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_amortizacion",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_mantenimiento",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_mano_obra",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "costo_subtotal_item",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizacion_items",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "codigo_cotizacion",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_nombre",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_contacto",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_directo_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_indirecto_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_fallos_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "subtotal_costo_base",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "monto_ganancia",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "monto_impuesto",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "precio_final",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "margen_ganancia_aplicado_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "notas",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "cliente_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "clientes",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "cotizaciones",
    "columna": "token_publico",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "voucher_data",
    "tipo_dato": "jsonb",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "imagen_referencia_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "cotizaciones",
    "columna": "costo_diseno_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "user_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "rol",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresa_miembros",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "logo_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "nombre_comercial",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "nit",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "razon_social",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "direccion_fiscal",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "ciudad",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "whatsapp",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "instagram",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "facebook",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "sitio_web",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "garantia",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "es_singleton",
    "tipo_dato": "boolean",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "empresas",
    "columna": "ubicacion_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "pedido_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "pedidos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "ingresos",
    "columna": "cliente_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "clientes",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "ingresos",
    "columna": "producto_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "catalogo_productos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "ingresos",
    "columna": "concepto",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "monto",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "metodo",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "fecha",
    "tipo_dato": "date",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "ingresos",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedido_checklist_items",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_checklist_items",
    "columna": "pedido_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "pedidos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedido_checklist_items",
    "columna": "label",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_checklist_items",
    "columna": "hecho",
    "tipo_dato": "boolean",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_checklist_items",
    "columna": "orden",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_eventos",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_eventos",
    "columna": "pedido_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "pedidos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedido_eventos",
    "columna": "texto",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_eventos",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "pedido_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "pedidos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "tipo",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "monto",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "metodo",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "comprobante_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "fecha",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedido_pagos",
    "columna": "registrado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "id",
    "tipo_dato": "uuid",
    "es_pk": "SI",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "creado_por",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "profiles",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "cotizacion_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "cotizaciones",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "cliente_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "clientes",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "producto_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "catalogo_productos",
    "referencia_columna_fk": "id"
  },
  {
    "tabla": "pedidos",
    "columna": "codigo_pedido",
    "tipo_dato": "integer",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "pieza_descripcion",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "fecha_entrega",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "pago_total",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "pago_anticipo_pct",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "pago_monto_cobrado",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "pago_estado",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "envio_tipo",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "envio_costo",
    "tipo_dato": "numeric",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "envio_tracking",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "foto_final_url",
    "tipo_dato": "text",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "created_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "updated_at",
    "tipo_dato": "timestamp with time zone",
    "es_pk": "NO",
    "referencia_tabla_fk": "-",
    "referencia_columna_fk": "-"
  },
  {
    "tabla": "pedidos",
    "columna": "empresa_id",
    "tipo_dato": "uuid",
    "es_pk": "NO",
    "referencia_tabla_fk": "empresas",
    "referencia_columna_fk": "id"
  }
]
ya que conoces los datos de mis tablas y tengo estos codigos:
// src/features/voucher/hooks/useVoucherCotizacion.ts
"use client";

import { useMemo } from "react";
import type {
  CotizacionPublica,
  FilaVoucher,
  PiezaDetalle,
  TabId,
  TipoEntrega,
} from "../types/voucher.types";
import {
  DEFAULT_GARANTIA_DIAS,
  DEFAULT_UBICACION,
} from "../constants/voucherConstants";
import { detalleTecnicoPieza } from "../utils/voucherFormatters";
import { calcularTotalesPedido } from "../utils/calcularTotalesPedido";

interface UseVoucherCotizacionParams {
  cotizacion: CotizacionPublica;
  tabActivo: TabId;
  tipoEntrega: TipoEntrega | null;
  numeroPedido?: string;
  clienteNombre?: string;
  ubicacionLocal?: string;
  ubicacionMapsUrl?: string;
  qrPagoUri?: string;
  fechaEmision: Date;
}

function construirFila(
  p: PiezaDetalle,
  voucherData?: CotizacionPublica["voucher_data"]
): FilaVoucher {
  const material = p.filamento?.material ?? voucherData?.documentTitle ?? "PLA";
  const color = p.filamento?.color ?? "A definir";
  const colorHex = p.filamento?.color_hex ?? null;
  const materialColor = [material, color].filter(Boolean).join(" ");

  return {
    pieza: p,
    descripcion: p.nombre_pieza,
    cantidad: p.cantidad,
    precioUnitario: p.cantidad > 0 ? p.precio_total_pieza / p.cantidad : p.precio_total_pieza,
    total: p.precio_total_pieza,
    material,
    color,
    colorHex,
    materialColor,
    detalleTecnico: detalleTecnicoPieza(p),
  };
}

export function useVoucherCotizacion({
  cotizacion,
  tabActivo,
  tipoEntrega,
  numeroPedido,
  clienteNombre,
  ubicacionLocal,
  ubicacionMapsUrl,
  qrPagoUri,
  fechaEmision,
}: UseVoucherCotizacionParams) {
  const empresa = cotizacion.empresa;
  const empresaNombre = empresa?.nombre ?? "Taller de Impresión 3D";
  const voucherData = cotizacion.voucher_data;

  // Tabs reactivos
  const tabs = useMemo(
    () => [
      {
        id: "general" as TabId,
        label: `General (${cotizacion.piezas.length} ${
          cotizacion.piezas.length === 1 ? "pieza" : "piezas"
        })`,
      },
      ...cotizacion.piezas.map((p) => ({ id: p.id, label: p.nombre_pieza })),
    ],
    [cotizacion.piezas]
  );

  const pieza = cotizacion.piezas.find((p) => p.id === tabActivo);
  const esGeneral = tabActivo === "general" || !pieza;

  // Filas para la tabla/vista según la pestaña seleccionada
  const piezasVista = useMemo(
    () => (esGeneral ? cotizacion.piezas : [pieza!]),
    [esGeneral, cotizacion.piezas, pieza]
  );

  const filasVista = useMemo(
    () => piezasVista.map((p) => construirFila(p, voucherData)),
    [piezasVista, voucherData]
  );

  // Filas completas para el comprobante
  const filasComprobante = useMemo(
    () => cotizacion.piezas.map((p) => construirFila(p, voucherData)),
    [cotizacion.piezas, voucherData]
  );

  // Cálculos base del pedido
  const subtotalOrden = useMemo(
    () => filasComprobante.reduce((acc, f) => acc + f.total, 0),
    [filasComprobante]
  );
  
  const montoImpuestoOrden = cotizacion.monto_impuesto || 0;
  const totalOrden = subtotalOrden + montoImpuestoOrden;

  // Recalculo reactivo dinámico de totales con el tipoEntrega actual
  const { costoEnvio, totalConEnvio, montoAnticipo, montoSaldo } = useMemo(
    () => calcularTotalesPedido(totalOrden, tipoEntrega),
    [totalOrden, tipoEntrega]
  );

  // Totales ajustados a la vista actual (tab general incluye envío e impuesto, tab individual solo el monto de la pieza)
  const subtotalVista = useMemo(
    () => filasVista.reduce((acc, f) => acc + f.total, 0),
    [filasVista]
  );

  const montoImpuestoVista = esGeneral ? montoImpuestoOrden : 0;
  const totalVista = esGeneral ? totalConEnvio : subtotalVista;
  const precioMostrado = esGeneral ? totalConEnvio : pieza!.precio_total_pieza;

  // Políticas y datos adicionales
  const politicas = voucherData?.policies?.length
    ? voucherData.policies
    : empresa?.garantia
    ? [{ label: "Garantía", text: empresa.garantia }]
    : [];

  const garantiaDias = voucherData?.garantiaDias ?? DEFAULT_GARANTIA_DIAS;

  const materialNombre = cotizacion.piezas[0]?.filamento?.material || "PLA - Genérico";
  const colorNombre = cotizacion.piezas[0]?.filamento?.color || "A definir / Según catálogo";
  const imagenProducto = voucherData?.productImageUri;

  const codigoPedido =
    numeroPedido ||
    `ORD-${fechaEmision.getFullYear()}-${cotizacion.id?.slice(0, 4)?.toUpperCase() ?? "0000"}`;
  const nombreClienteMostrado = clienteNombre?.trim() || "Cliente";
  const direccionLocal = ubicacionLocal?.trim() || empresa?.direccion || DEFAULT_UBICACION;
  const direccionMapsUrl = ubicacionMapsUrl || empresa?.ubicacion_url || null;

  const notasLegales = voucherData?.notasLegales?.length
    ? voucherData.notasLegales
    : [
        "Este documento es un comprobante de pedido y no reemplaza a la factura fiscal.",
        `Garantía válida por ${garantiaDias} días tras la recepción del trabajo.`,
      ];

  // El QR se regenera reactivamente cuando cambia el anticipo por el costo de envío
  const qrImagenSrc = useMemo(
    () =>
      qrPagoUri ||
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        `Anticipo pedido ${codigoPedido} - ${empresaNombre} - Monto: ${montoAnticipo.toFixed(2)} Bs`
      )}`,
    [qrPagoUri, codigoPedido, empresaNombre, montoAnticipo]
  );

  return {
    empresa,
    empresaNombre,
    voucherData,
    tabs,
    pieza,
    esGeneral,
    precioMostrado,
    filasVista,
    subtotalVista,
    montoImpuestoVista,
    totalVista,
    filasComprobante,
    subtotalOrden,
    montoImpuestoOrden,
    costoEnvio,
    totalConEnvio,
    montoAnticipo,
    montoSaldo,
    politicas,
    garantiaDias,
    materialNombre,
    colorNombre,
    imagenProducto,
    codigoPedido,
    nombreClienteMostrado,
    direccionLocal,
    direccionMapsUrl,
    notasLegales,
    qrImagenSrc,
  };
}

export type UseVoucherCotizacionReturn = ReturnType<typeof useVoucherCotizacion>;





// src/features/voucher/hooks/useVoucherFlujo.ts
import { useState, useRef, useEffect } from "react";
import type {
  TipoEntrega,
  MetodoPago,
  CotizacionPublica,
  PiezaDetalle,
} from "../types/voucher.types";
import { calcularTotalesPedido } from "../utils/calcularTotalesPedido";
import {
  crearPedidoPendienteService,
  actualizarOpcionesPedidoService,
  registrarPagoPedidoService,
  anularUltimoPagoPedidoService,
  subirComprobantePagoService,
  getPedidoPorCotizacionIdService,
  getUltimoPagoPedidoService,
  CrearPedidoDesdeCotizacionDTO,
} from "../services/pedidos.service";

interface UseVoucherFlujoProps {
  cotizacion: CotizacionPublica;
  onAceptarPedidoSuccess?: (pedidoId: string) => void;
  onSubirComprobante?: (file: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
}

export function useVoucherFlujo({
  cotizacion,
  onAceptarPedidoSuccess,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
}: UseVoucherFlujoProps) {
  const [tema, setTema] = useState<string>("rosa");
  const [tabActivo, setTabActivo] = useState<string>("general");
  const [pedidoAceptado, setPedidoAceptado] = useState<boolean>(false);
  const [isCreatingPedido, setIsCreatingPedido] = useState<boolean>(false);
  const [isUpdatingPedido, setIsUpdatingPedido] = useState<boolean>(false);
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago | null>(null);

  const [comprobanteArchivo, setComprobanteArchivo] = useState<File | null>(null);
  const [pedidoConfirmadoEfectivo, setPedidoConfirmadoEfectivo] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fechaEmision = new Date();

  // Recuperar pedido existente al montar (evita duplicados si el cliente recarga)
  useEffect(() => {
    let activo = true;

    (async () => {
      const pedidoExistente = await getPedidoPorCotizacionIdService(cotizacion.id);
      if (!activo || !pedidoExistente) return;

      setPedidoId(pedidoExistente.id);
      setPedidoAceptado(true);

      if (pedidoExistente.envio_tipo) {
        setTipoEntrega(pedidoExistente.envio_tipo as TipoEntrega);
      }

      const ultimoPago = await getUltimoPagoPedidoService(pedidoExistente.id);
      if (ultimoPago && activo) {
        setMetodoPago(ultimoPago.metodo as MetodoPago);
        if (ultimoPago.metodo === "efectivo") setPedidoConfirmadoEfectivo(true);
      }
    })();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cotizacion.id]);

  const alternarTema = () => setTema((prev) => (prev === "rosa" ? "morado" : "rosa"));

  // 1. Creación básica del pedido
  const handleAceptarPedido = async () => {
    if (isCreatingPedido || pedidoId) return;

    try {
      setIsCreatingPedido(true);

      const descripcionPiezas = cotizacion.piezas?.length
        ? cotizacion.piezas.map((p: PiezaDetalle) => p.nombre_pieza).join(", ")
        : "Pieza 3D personalizada";

      const dto: CrearPedidoDesdeCotizacionDTO = {
        cotizacionId: cotizacion.id,
        empresaId: cotizacion.empresa?.id ?? "",
        clienteId: null,
        creadoPor: null,
        piezaDescripcion: descripcionPiezas,
        pagoTotal: cotizacion.precio_final ?? 0,
        pagoAnticipoPct: 50,
      };

      const pedidoCreado = await crearPedidoPendienteService(dto);

      setPedidoId(pedidoCreado.id);
      setPedidoAceptado(true);
      onAceptarPedidoSuccess?.(pedidoCreado.id);
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Ocurrió un error al crear tu pedido. Por favor intenta nuevamente.");
    } finally {
      setIsCreatingPedido(false);
    }
  };

  // 2. Selección de entrega → recalcula y persiste
  const handleSeleccionarEntrega = async (tipo: TipoEntrega) => {
    setTipoEntrega(tipo);
    if (!pedidoId) return;

    try {
      setIsUpdatingPedido(true);
      const { costoEnvio, totalConEnvio } = calcularTotalesPedido(
        cotizacion.precio_final ?? 0,
        tipo
      );

      await actualizarOpcionesPedidoService(pedidoId, {
        envioTipo: tipo,
        envioCosto: costoEnvio,
        pagoTotal: totalConEnvio,
      });
    } catch (error) {
      console.error("Error al guardar tipo de entrega:", error);
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 3. Selección de método de pago (solo estado local; se persiste al confirmar el pago)
  const handleSeleccionarPago = (metodo: MetodoPago) => {
    setMetodoPago(metodo);
  };

  const handleSeleccionarComprobante = () => {
    fileInputRef.current?.click();
  };

  // 4. Comprobante QR subido → sube a Storage y registra el pago
  const handleComprobanteChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setComprobanteArchivo(file);
    onSubirComprobante?.(file);

    if (!pedidoId || !tipoEntrega) return;

    try {
      setIsUpdatingPedido(true);
      const { montoAnticipo } = calcularTotalesPedido(cotizacion.precio_final ?? 0, tipoEntrega);
      const comprobanteUrl = await subirComprobantePagoService(pedidoId, file);

      await registrarPagoPedidoService(pedidoId, {
        tipo: "anticipo",
        monto: montoAnticipo,
        metodo: "qr",
        comprobanteUrl,
      });
    } catch (error) {
      console.error("Error al registrar el pago QR:", error);
      alert("No se pudo registrar tu comprobante. Intenta nuevamente.");
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 5. Confirmación de pago en efectivo → registra el pago
  const handleConfirmarEfectivo = async () => {
    if (!pedidoId || !tipoEntrega) return;

    try {
      setIsUpdatingPedido(true);
      const { montoAnticipo } = calcularTotalesPedido(cotizacion.precio_final ?? 0, tipoEntrega);

      await registrarPagoPedidoService(pedidoId, {
        tipo: "anticipo",
        monto: montoAnticipo,
        metodo: "efectivo",
      });

      setPedidoConfirmadoEfectivo(true);
      onConfirmarPedidoEfectivo?.();
    } catch (error) {
      console.error("Error al confirmar el pago en efectivo:", error);
      alert("No se pudo confirmar tu pedido. Intenta nuevamente.");
    } finally {
      setIsUpdatingPedido(false);
    }
  };

  // 6. "Cambiar opciones": anula el pago previo (si existe) y reabre la selección
  const handleCambiarOpciones = async () => {
    if (pedidoId && (pedidoConfirmadoEfectivo || comprobanteArchivo)) {
      try {
        setIsUpdatingPedido(true);
        await anularUltimoPagoPedidoService(pedidoId);
      } catch (error) {
        console.error("Error al anular el pago anterior:", error);
      } finally {
        setIsUpdatingPedido(false);
      }
    }

    setTipoEntrega(null);
    setMetodoPago(null);
    setPedidoConfirmadoEfectivo(false);
    setComprobanteArchivo(null);
  };

  const seleccionCompleta = Boolean(tipoEntrega && metodoPago);

  return {
    tema,
    alternarTema,
    tabActivo,
    setTabActivo,
    pedidoAceptado,
    pedidoId,
    isCreatingPedido,
    isUpdatingPedido,
    tipoEntrega,
    metodoPago,
    handleSeleccionarEntrega,
    handleSeleccionarPago,
    comprobanteArchivo,
    pedidoConfirmadoEfectivo,
    seleccionCompleta,
    fechaEmision,
    fileInputRef,
    handleAceptarPedido,
    handleSeleccionarComprobante,
    handleComprobanteChange,
    handleConfirmarEfectivo,
    handleCambiarOpciones,
  };
}





// src/features/voucher/services/pedidos.service.ts
import { supabase } from "@/lib/supabase";

// ==========================================
// DTOs
// ==========================================

export interface CrearPedidoDesdeCotizacionDTO {
  cotizacionId: string;
  empresaId: string;
  clienteId?: string | null;
  creadoPor?: string | null;
  piezaDescripcion: string;
  pagoTotal: number;
  pagoAnticipoPct?: number;
}

export interface ActualizarOpcionesPedidoDTO {
  envioTipo?: "recoger" | "domicilio";
  envioCosto?: number;
  pagoTotal?: number;
}

export interface RegistrarPagoPedidoDTO {
  tipo: "anticipo" | "saldo" | "total";
  monto: number;
  metodo: "efectivo" | "qr";
  comprobanteUrl?: string | null;
}

export interface PedidoExistente {
  id: string;
  estado: string;
  envio_tipo: string | null;
  envio_costo: number | null;
  pago_total: number | null;
  pago_monto_cobrado: number | null;
  pago_estado: string | null;
}

// ==========================================
// Creación
// ==========================================

export async function crearPedidoPendienteService(dto: CrearPedidoDesdeCotizacionDTO) {
  console.log("🔍 [crearPedidoPendienteService] Payload enviado:", dto);

  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      cotizacion_id: dto.cotizacionId,
      empresa_id: dto.empresaId,
      cliente_id: dto.clienteId ?? null,
      creado_por: dto.creadoPor ?? null,
      pieza_descripcion: dto.piezaDescripcion,
      estado: "pendiente",
      pago_total: dto.pagoTotal,
      pago_anticipo_pct: dto.pagoAnticipoPct ?? 50,
      pago_monto_cobrado: 0,
      pago_estado: "pendiente",
    })
    .select()
    .single();

  if (errorPedido) {
    console.error("🚨 Error al crear pedido en Supabase:", {
      mensaje: errorPedido.message,
      codigo: errorPedido.code,
      detalles: errorPedido.details,
      pista: errorPedido.hint,
    });
    throw new Error(`No se pudo registrar el pedido: ${errorPedido.message}`);
  }

  console.log("✅ Pedido creado exitosamente:", pedido);

  const { error: errorEvento } = await supabase.from("pedido_eventos").insert({
    pedido_id: pedido.id,
    texto: "Pedido aceptado por el cliente desde el comprobante/voucher web.",
  });

  if (errorEvento) {
    console.warn("⚠️ No se pudo registrar el evento de creación del pedido:", errorEvento);
  }

  const { error: errorCotizacion } = await supabase
    .from("cotizaciones")
    .update({ estado: "aceptada" })
    .eq("id", dto.cotizacionId);

  if (errorCotizacion) {
    console.warn("⚠️ No se pudo actualizar el estado de la cotización:", errorCotizacion);
  }

  return pedido;
}

// ==========================================
// Recuperar pedido existente (evita duplicados al recargar)
// ==========================================

export async function getPedidoPorCotizacionIdService(
  cotizacionId: string
): Promise<PedidoExistente | null> {
  console.log(`🔍 [getPedidoPorCotizacionIdService] Buscando pedido para cotización: ${cotizacionId}`);

  const { data, error } = await supabase
    .from("pedidos")
    .select("id, estado, envio_tipo, envio_costo, pago_total, pago_monto_cobrado, pago_estado")
    .eq("cotizacion_id", cotizacionId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("🚨 Error al buscar pedido existente:", {
      mensaje: error.message,
      codigo: error.code,
      detalles: error.details,
    });
    return null;
  }

  if (!data) {
    console.log("ℹ️ No se encontró ningún pedido previo para esta cotización.");
  } else {
    console.log("✅ Pedido recuperado:", data);
  }

  return data;
}

export async function getUltimoPagoPedidoService(pedidoId: string) {
  const { data, error } = await supabase
    .from("pedido_pagos")
    .select("metodo, tipo, monto, comprobante_url")
    .eq("pedido_id", pedidoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("🚨 Error al obtener el último pago:", error);
    return null;
  }
  return data;
}

// ==========================================
// Actualizar opciones de entrega
// ==========================================

export async function actualizarOpcionesPedidoService(
  pedidoId: string,
  dto: ActualizarOpcionesPedidoDTO
) {
  const updatePayload: Record<string, unknown> = {};
  if (dto.envioTipo !== undefined) updatePayload.envio_tipo = dto.envioTipo;
  if (dto.envioCosto !== undefined) updatePayload.envio_costo = dto.envioCosto;
  if (dto.pagoTotal !== undefined) updatePayload.pago_total = dto.pagoTotal;

  if (Object.keys(updatePayload).length === 0) return null;

  const { data: dataArray, error } = await supabase
    .from("pedidos")
    .update(updatePayload)
    .eq("id", pedidoId)
    .select("id, estado, envio_tipo, envio_costo, pago_total");

  if (error) throw new Error(`Error en base de datos: ${error.message}`);
  if (!dataArray || dataArray.length === 0) {
    throw new Error("No se pudieron guardar las opciones. RLS o el pedido no existe.");
  }

  const pedidoActualizado = dataArray[0];

  // Verificación de lectura fresca, en una consulta 100% independiente,
  // sin ningún tipo de caché del cliente/PostgREST.
  const { data: verificacion } = await supabase
    .from("pedidos")
    .select("id, envio_tipo")
    .eq("id", pedidoId)
    .single();

  console.log(
    `✅ envio_tipo confirmado en BD para pedido ${pedidoId}: "${verificacion?.envio_tipo}" ` +
    `(esperado: "${updatePayload.envio_tipo}") — ${
      verificacion?.envio_tipo === updatePayload.envio_tipo ? "COINCIDE ✔" : "⚠️ NO COINCIDE"
    }`
  );

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: `Tipo de entrega actualizado: ${JSON.stringify(updatePayload)}`,
  });

  return pedidoActualizado;
}

// ==========================================
// Registrar pago (efectivo confirmado o QR con comprobante)
// ==========================================

export async function registrarPagoPedidoService(pedidoId: string, dto: RegistrarPagoPedidoDTO) {
  console.log(`🔍 [registrarPagoPedidoService] Registrando pago para pedido (${pedidoId}):`, dto);

  const { data: pago, error } = await supabase
    .from("pedido_pagos")
    .insert({
      pedido_id: pedidoId,
      tipo: dto.tipo,
      monto: dto.monto,
      metodo: dto.metodo,
      comprobante_url: dto.comprobanteUrl ?? null,
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("🚨 Error al insertar pago en Supabase:", {
      mensaje: error.message,
      codigo: error.code,
      detalles: error.details,
    });
    throw new Error(`No se pudo registrar el pago: ${error.message}`);
  }

  console.log("✅ Pago registrado con éxito:", pago);

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: `Pago registrado: ${dto.tipo} de ${dto.monto.toFixed(2)} Bs vía ${dto.metodo}.`,
  });

  await actualizarEstadoPagoPedidoService(pedidoId);

  return pago;
}

// ==========================================
// Anular el último pago (cuando el cliente presiona "Cambiar opciones")
// ==========================================

export async function anularUltimoPagoPedidoService(pedidoId: string) {
  console.log(`🔍 [anularUltimoPagoPedidoService] Buscando último pago para anular en pedido: ${pedidoId}`);

  const { data: ultimoPago, error: errorBuscar } = await supabase
    .from("pedido_pagos")
    .select("id, monto")
    .eq("pedido_id", pedidoId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorBuscar) {
    console.error("🚨 Error al consultar pagos previos:", errorBuscar);
    throw new Error(`No se pudo verificar pagos previos: ${errorBuscar.message}`);
  }
  if (!ultimoPago) {
    console.log("ℹ️ No hay pagos previos para anular.");
    return;
  }

  const { data: eliminados, error: errorEliminar } = await supabase
    .from("pedido_pagos")
    .delete()
    .eq("id", ultimoPago.id)
    .select();

  if (errorEliminar) {
    console.error("🚨 Error al eliminar pago en Supabase:", errorEliminar);
    throw new Error(`No se pudo anular el pago anterior: ${errorEliminar.message}`);
  }

  if (!eliminados || eliminados.length === 0) {
    console.warn("🔒 [BLOQUEO RLS] No se pudo anular el pago. Falta permiso DELETE en 'pedido_pagos'.");
  } else {
    console.log("✅ Pago anulado con éxito:", eliminados);
  }

  await supabase.from("pedido_eventos").insert({
    pedido_id: pedidoId,
    texto: `Pago de ${Number(ultimoPago.monto).toFixed(2)} Bs anulado por cambio de opciones del cliente.`,
  });

  await actualizarEstadoPagoPedidoService(pedidoId);
}

// ==========================================
// Recalcular pago_estado / pago_monto_cobrado desde pedido_pagos
// ==========================================

export async function actualizarEstadoPagoPedidoService(pedidoId: string) {
  console.log(`🔍 [actualizarEstadoPagoPedidoService] Recalculando estado de pago del pedido: ${pedidoId}`);

  const { data: pagos, error: errorPagos } = await supabase
    .from("pedido_pagos")
    .select("monto")
    .eq("pedido_id", pedidoId);

  if (errorPagos) {
    console.error("🚨 Error al consultar la lista de pagos:", errorPagos);
    throw new Error(`No se pudo calcular el pago acumulado: ${errorPagos.message}`);
  }

  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .select("pago_total")
    .eq("id", pedidoId)
    .single();

  if (errorPedido) {
    console.error("🚨 Error al consultar el total del pedido:", errorPedido);
    throw new Error(`No se pudo leer el pedido: ${errorPedido.message}`);
  }

  const montoCobrado = (pagos ?? []).reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const pagoTotal = Number(pedido.pago_total) || 0;

  let pagoEstado: "pendiente" | "parcial" | "pagado" = "pendiente";
  if (montoCobrado > 0 && pagoTotal > 0) {
    pagoEstado = montoCobrado >= pagoTotal ? "pagado" : "parcial";
  }

  console.log(`📊 Recálculo de totales -> Monto Cobrado: ${montoCobrado}, Pago Total: ${pagoTotal}, Estado: ${pagoEstado}`);

  const { data: dataUpdate, error: errorUpdate } = await supabase
    .from("pedidos")
    .update({ pago_monto_cobrado: montoCobrado, pago_estado: pagoEstado })
    .eq("id", pedidoId)
    .select();

  if (errorUpdate) {
    console.error("🚨 Error al actualizar el estado de pago del pedido:", errorUpdate);
    throw new Error(`No se pudo actualizar el estado de pago: ${errorUpdate.message}`);
  }

  if (!dataUpdate || dataUpdate.length === 0) {
    console.warn("🔒 [BLOQUEO RLS] No se pudo actualizar el estado del pago en la tabla 'pedidos'.");
  } else {
    console.log("✅ Estado del pago actualizado exitosamente en el pedido.");
  }
}

// ==========================================
// Subir comprobante de pago QR a Storage
// ==========================================

export async function subirComprobantePagoService(pedidoId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `pedidos/${pedidoId}/comprobante-${Date.now()}.${extension}`;

  console.log(`🔍 [subirComprobantePagoService] Subiendo archivo a Storage (${path})...`);

  const { error: errorUpload } = await supabase.storage
    .from("comprobantes-pago")
    .upload(path, file, { upsert: true });

  if (errorUpload) {
    console.error("🚨 Error al subir comprobante a Supabase Storage:", errorUpload);
    throw new Error(`No se pudo subir el comprobante: ${errorUpload.message}`);
  }

  const { data } = supabase.storage.from("comprobantes-pago").getPublicUrl(path);
  console.log("✅ Archivo subido. URL pública obtenida:", data.publicUrl);
  return data.publicUrl;
}







import type { RefObject, ChangeEvent } from "react";

export type TipoEntrega = "recoger" | "domicilio";
export type MetodoPago = "efectivo" | "qr";
export type Tema = "rosa" | "morado";
export type TabId = "general" | string;

export interface FilamentoInfo {
  id: string;
  material: string;
  color: string;
  color_hex?: string | null;
  marca?: string | null;
}

export interface PiezaDetalle {
  id: string;
  nombre_pieza: string;
  cantidad: number;
  precio_total_pieza: number;
  imagen_url?: string | null;

  // Información de Filamento Normalizada
  filamento_id?: string | null;
  filamento?: FilamentoInfo | null;

  // Especificaciones Técnicas
  peso_gramos?: number | null;
  tiempo_impresion_horas?: number | null;
  tiempo_preparacion_minutos?: number | null;
  tiempo_postprocesado_minutos?: number | null;

  // Desglose Financiero Directo
  costo_material: number;
  costo_mano_obra: number;
  costo_depreciacion: number;
  costo_energia: number;
  costo_mantenimiento: number;
  subtotal_directo: number;
  proporcion_pct: number;
  costo_fallos_pieza: number;
  costo_base_pieza: number;
  monto_ganancia_pieza: number;
}

export interface EmpresaInfo {
  id: string;
  nombre: string;
  nombre_comercial?: string | null;
  razon_social?: string | null;
  logo_url?: string | null;
  garantia?: string | null;
  sitio_web?: string | null;
  nit?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  whatsapp_url?: string | null;
  tiktok_url?: string | null;
  instagram_url?: string | null;
  facebook_url?: string | null;
  ubicacion_url?: string | null;
}

export interface VoucherPolicy {
  label: string;
  text: string;
}

export interface VoucherData {
  documentTitle?: string | null;
  companyTagline?: string | null;
  validityLabel?: string | null;
  footerNote?: string | null;
  logoUri?: string | null;
  productImageUri?: string | null;
  policies?: VoucherPolicy[] | null;
  garantiaDias?: number | null;
  notasLegales?: string[] | null;
}

export interface CotizacionPublica {
  id: string;
  creado_en: string;
  codigo_cotizacion?: string | null;
  precio_final: number;
  monto_impuesto?: number | null;
  porcentaje_impuesto?: number | null;
  costo_diseno_total: number;
  costo_directo_total: number;
  costo_indirecto_total: number;
  costo_fallos_total: number;
  subtotal_costo_base: number;
  monto_ganancia: number;
  margen_ganancia_aplicado_pct: number;
  cliente_nombre?: string | null;
  cliente_contacto?: string | null;
  estado?: string | null;
  notas?: string | null;
  imagen_referencia_url?: string | null;
  piezas: PiezaDetalle[];
  empresa?: EmpresaInfo | null;
  voucher_data?: VoucherData | null;
}

export interface FilaVoucher {
  pieza: PiezaDetalle;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  material: string;
  color: string;
  colorHex?: string | null;
  materialColor: string;
  detalleTecnico?: string | null;
}

export interface VoucherPublicoProps {
  cotizacion: CotizacionPublica;
  onAceptarPedido?: () => void;
  onCancelarPedido?: () => void;
  clienteNombre?: string;
  clienteDocumento?: string;
  clienteTelefono?: string;
  atendidoPor?: string;
  numeroPedido?: string;
  qrPagoUri?: string;
  ubicacionLocal?: string;
  ubicacionMapsUrl?: string;
  onSubirComprobante?: (archivo: File) => void;
  onConfirmarPedidoEfectivo?: () => void;
  instagramUrl?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export interface VoucherTablaResumenProps {
  filas: FilaVoucher[];
  costoDisenoTotal?: number | null;
  subtotal: number;
  montoImpuesto: number;
  total: number;
}

export interface VoucherHeaderProps {
  empresaNombre?: string | null;
  empresa?: EmpresaInfo | null;
  voucherData?: VoucherData | null;
  creadoEn?: string;
  tema: Tema;
  onAlternarTema: () => void;
}

export interface TicketComprobanteProps {
  empresa?: EmpresaInfo | null;
  empresaNombre?: string | null;
  voucherData?: VoucherData | null;
  codigoPedido?: string | null;
  fechaEmision?: Date | string; // Permite tanto Date como string
  atendidoPor?: string;
  nombreCliente?: string | null;
  clienteDocumento?: string;
  clienteTelefono?: string;
  tipoEntrega: TipoEntrega | null; // Permite null si aún no se seleccionó
  filasComprobante: FilaVoucher[];
  subtotalOrden: number;
  montoImpuestoOrden: number;
  costoEnvio: number;
  totalConEnvio: number;
  montoAnticipo: number;
  montoSaldo: number;
  metodoPago: MetodoPago | null; // Permite null si aún no se seleccionó
  qrImagenSrc?: string | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  direccionLocal?: string | null;
  notasLegales?: string[] | null;
  fileInputRef: RefObject<HTMLInputElement>;
  onSeleccionarComprobante: () => void;
  onComprobanteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onConfirmarEfectivo: () => void;
  onCambiarOpciones: () => void;
}





y estos componentes: 
//src/features/voucher/components/VoucherPublico.tsx
"use client";

import { useMemo } from "react";
import type { VoucherPublicoProps, Tema } from "../types/voucher.types";
import { TEMAS } from "../constants/voucherConstants";
import { useVoucherFlujo } from "../hooks/useVoucherFlujo";
import { useVoucherCotizacion } from "../hooks/useVoucherCotizacion";
import { mapearPiezasAFilasVoucher } from "../utils/voucherFormatters";

import { VoucherHeader } from "./VoucherHeader";
import { VoucherTabsPiezas } from "./VoucherTabsPiezas";
import { VoucherHeroCard } from "./VoucherHeroCard";
import { VoucherTablaResumen } from "./VoucherTablaResumen";
import { VoucherPoliticas } from "./VoucherPoliticas";
import { VoucherAccionesIniciales } from "./VoucherAccionesIniciales";
import { VoucherSeleccionOpciones } from "./VoucherSeleccionOpciones";
import { TicketComprobante } from "./ticket/TicketComprobante";
import { VoucherUbicacionLocal } from "./VoucherUbicacionLocal";
import { VoucherFooter } from "./VoucherFooter";

export function VoucherPublico({
  cotizacion,
  onAceptarPedido,
  onCancelarPedido,
  clienteNombre,
  clienteDocumento,
  clienteTelefono,
  atendidoPor,
  numeroPedido,
  qrPagoUri,
  ubicacionLocal,
  ubicacionMapsUrl,
  onSubirComprobante,
  onConfirmarPedidoEfectivo,
  whatsappUrl,
  tiktokUrl,
  instagramUrl,
  facebookUrl,
}: VoucherPublicoProps) {
  const flujo = useVoucherFlujo({
    cotizacion,
    onAceptarPedidoSuccess: onAceptarPedido,
    onSubirComprobante,
    onConfirmarPedidoEfectivo,
  });

  const datos = useVoucherCotizacion({
    cotizacion,
    tabActivo: flujo.tabActivo,
    tipoEntrega: flujo.tipoEntrega,
    numeroPedido,
    clienteNombre,
    ubicacionLocal,
    ubicacionMapsUrl,
    qrPagoUri,
    fechaEmision: flujo.fechaEmision,
  });

  const filasMapeadas = useMemo(() => {
    return mapearPiezasAFilasVoucher(cotizacion.piezas ?? []);
  }, [cotizacion.piezas]);

  const temaClave = (flujo.tema as Tema) || "rosa";
  const estiloTema = (TEMAS[temaClave] ?? TEMAS.rosa) as React.CSSProperties;
  const piezaSeleccionadaId =
    flujo.tabActivo !== "general" ? flujo.tabActivo : null;

  return (
    <div
      className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 antialiased"
      style={estiloTema}
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Cabecera del Voucher */}
        <VoucherHeader
          empresaNombre={datos.empresaNombre}
          empresa={datos.empresa ?? undefined}
          voucherData={datos.voucherData ?? undefined}
          creadoEn={cotizacion.creado_en}
          tema={temaClave}
          onAlternarTema={flujo.alternarTema}
        />

        <div className="mt-4 h-1 w-full rounded-full bg-[var(--brand)]" />

        {/* Pestañas de Piezas */}
        <VoucherTabsPiezas
          tabs={datos.tabs}
          tabActivo={flujo.tabActivo}
          onCambiarTab={flujo.setTabActivo}
          visible={(cotizacion.piezas?.length ?? 0) > 1}
        />

        {/* Tarjeta Destacada */}
        <VoucherHeroCard
          cotizacion={cotizacion}
          piezaSeleccionadaId={piezaSeleccionadaId}
        />

        {/* Tabla Desglose */}
        <VoucherTablaResumen
          filas={datos.filasVista ?? filasMapeadas}
          costoDisenoTotal={cotizacion.costo_diseno_total}
          subtotal={datos.subtotalVista}
          montoImpuesto={datos.montoImpuestoVista}
          total={datos.totalVista}
        />

        {/* Políticas y Garantía */}
        <VoucherPoliticas politicas={datos.politicas} />

        {/* Botones de Acción Inicial */}
        {!flujo.pedidoAceptado && (
          <VoucherAccionesIniciales
            onCancelar={onCancelarPedido}
            onAceptar={flujo.handleAceptarPedido}
            loading={flujo.isCreatingPedido}
          />
        )}

        {/* Flujo de Confirmación y Ticket */}
        {flujo.pedidoAceptado && (
          <div className="mt-6 space-y-4">
            <VoucherSeleccionOpciones
              visible={!flujo.seleccionCompleta}
              tipoEntrega={flujo.tipoEntrega}
              metodoPago={flujo.metodoPago}
              onSeleccionarEntrega={flujo.handleSeleccionarEntrega}
              onSeleccionarPago={flujo.handleSeleccionarPago}
            />

            {flujo.seleccionCompleta && (
              <>
                <TicketComprobante
                  empresa={datos.empresa ?? undefined}
                  empresaNombre={datos.empresaNombre}
                  voucherData={datos.voucherData ?? undefined}
                  codigoPedido={datos.codigoPedido}
                  fechaEmision={flujo.fechaEmision}
                  atendidoPor={atendidoPor}
                  nombreCliente={datos.nombreClienteMostrado}
                  clienteDocumento={clienteDocumento}
                  clienteTelefono={clienteTelefono}
                  tipoEntrega={flujo.tipoEntrega}
                  filasComprobante={datos.filasComprobante ?? filasMapeadas}
                  subtotalOrden={datos.subtotalOrden}
                  montoImpuestoOrden={datos.montoImpuestoOrden}
                  costoEnvio={datos.costoEnvio}
                  totalConEnvio={datos.totalConEnvio}
                  montoAnticipo={datos.montoAnticipo}
                  montoSaldo={datos.montoSaldo}
                  metodoPago={flujo.metodoPago}
                  qrImagenSrc={datos.qrImagenSrc}
                  comprobanteArchivo={flujo.comprobanteArchivo}
                  pedidoConfirmadoEfectivo={flujo.pedidoConfirmadoEfectivo}
                  direccionLocal={datos.direccionLocal}
                  notasLegales={datos.notasLegales}
                  fileInputRef={
                    flujo.fileInputRef as React.RefObject<HTMLInputElement>
                  }
                  onSeleccionarComprobante={flujo.handleSeleccionarComprobante}
                  onComprobanteChange={flujo.handleComprobanteChange}
                  onConfirmarEfectivo={flujo.handleConfirmarEfectivo}
                  onCambiarOpciones={flujo.handleCambiarOpciones}
                />

                {flujo.metodoPago === "efectivo" &&
                  flujo.pedidoConfirmadoEfectivo && (
                    <VoucherUbicacionLocal
                      direccion={datos.direccionLocal}
                      ubicacionUrl={datos.direccionMapsUrl ?? undefined}
                    />
                  )}
              </>
            )}
          </div>
        )}

        {/* Pie de Página */}
        <VoucherFooter
          footerNote={datos.voucherData?.footerNote}
          sitioWeb={datos.empresa?.sitio_web}
          whatsappUrl={
            whatsappUrl ?? datos.empresa?.whatsapp_url ?? datos.empresa?.telefono
          }
          tiktokUrl={tiktokUrl ?? datos.empresa?.tiktok_url}
          facebookUrl={facebookUrl ?? datos.empresa?.facebook_url}
          instagramUrl={instagramUrl ?? datos.empresa?.instagram_url}
        />
      </div>
    </div>
  );
}





// src/features/voucher/components/ticket/TicketComprobante.tsx

import { RefreshCw, Ticket } from "lucide-react";
import type { TicketComprobanteProps } from "../../types/voucher.types";
import { TicketEncabezadoEmpresa } from "./TicketEncabezadoEmpresa";
import { TicketInfoPedido } from "./TicketInfoPedido";
import { TicketClienteEntrega } from "./TicketClienteEntrega";
import { TicketDetalleTrabajo } from "./TicketDetalleTrabajo";
import { TicketTotalesAnticipo } from "./TicketTotalesAnticipo";
import { TicketPagoQR } from "./TicketPagoQR";
import { TicketPagoEfectivo } from "./TicketPagoEfectivo";
import { TicketNotasLegales } from "./TicketNotasLegales";
import { TicketCodigoBarras } from "./TicketCodigoBarras";
import { TicketAcciones } from "./TicketAcciones";

export function TicketComprobante(props: TicketComprobanteProps) {
  // Conversión segura de fecha si viene como string
  const fechaObj =
    typeof props.fechaEmision === "string"
      ? new Date(props.fechaEmision)
      : props.fechaEmision ?? new Date();

  // Nombre seguro de la empresa con fallback
  const nombreEmpresaSeguro = props.empresaNombre ?? props.empresa?.nombre ?? "EMPRESA";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
          <Ticket className="h-4 w-4 text-[var(--brand)]" />
          3. Tu comprobante de pedido
        </p>
        <button
          type="button"
          onClick={props.onCambiarOpciones}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
        >
          <RefreshCw className="h-3 w-3" />
          Cambiar opciones
        </button>
      </div>

      <div className="relative mx-auto max-w-md space-y-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
          <TicketEncabezadoEmpresa
            empresaNombre={nombreEmpresaSeguro}
            empresa={props.empresa ?? undefined}
            voucherData={props.voucherData ?? undefined}
          />

          <TicketInfoPedido
            codigoPedido={props.codigoPedido ?? "S/N"}
            fechaEmision={fechaObj}
            atendidoPor={props.atendidoPor}
          />

          <TicketClienteEntrega
            nombreCliente={props.nombreCliente ?? ""}
            clienteDocumento={props.clienteDocumento}
            clienteTelefono={props.clienteTelefono}
            tipoEntrega={props.tipoEntrega}
          />

          <TicketDetalleTrabajo filas={props.filasComprobante} />

          <TicketTotalesAnticipo
            subtotalOrden={props.subtotalOrden}
            montoImpuestoOrden={props.montoImpuestoOrden}
            costoEnvio={props.costoEnvio}
            totalConEnvio={props.totalConEnvio}
            montoAnticipo={props.montoAnticipo}
            montoSaldo={props.montoSaldo}
          />

          <TicketPagoQR
            visible={props.metodoPago === "qr"}
            qrImagenSrc={props.qrImagenSrc ?? ""}
            comprobanteArchivo={props.comprobanteArchivo}
          />

          <TicketPagoEfectivo
            visible={props.metodoPago === "efectivo"}
            pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
            montoAnticipo={props.montoAnticipo}
            empresaNombre={nombreEmpresaSeguro}
            direccionLocal={props.direccionLocal ?? ""}
          />

          <TicketNotasLegales notas={props.notasLegales ?? []} />
          <TicketCodigoBarras codigoPedido={props.codigoPedido ?? "S/N"} />
        </div>

        <TicketAcciones
          metodoPago={props.metodoPago}
          comprobanteArchivo={props.comprobanteArchivo}
          pedidoConfirmadoEfectivo={props.pedidoConfirmadoEfectivo}
          fileInputRef={props.fileInputRef}
          onComprobanteChange={props.onComprobanteChange}
          onSeleccionarComprobante={props.onSeleccionarComprobante}
          onConfirmarEfectivo={props.onConfirmarEfectivo}
        />
      </div>
    </div>
  );
}





// src/features/voucher/components/ticket/TicketAcciones.tsx

import { CheckCircle2, RefreshCw, Upload } from "lucide-react";
import type { MetodoPago } from "../../types/voucher.types";

interface TicketAccionesProps {
  metodoPago: MetodoPago | null;
  comprobanteArchivo: File | null;
  pedidoConfirmadoEfectivo: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onComprobanteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeleccionarComprobante: () => void;
  onConfirmarEfectivo: () => void;
}

export function TicketAcciones({
  metodoPago,
  comprobanteArchivo,
  pedidoConfirmadoEfectivo,
  fileInputRef,
  onComprobanteChange,
  onSeleccionarComprobante,
  onConfirmarEfectivo,
}: TicketAccionesProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onComprobanteChange}
      />

      <div className="flex justify-end gap-3 pt-2">
        {metodoPago === "qr" && (
          <button
            type="button"
            onClick={onSeleccionarComprobante}
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
          >
            {comprobanteArchivo ? (
              <>
                <RefreshCw className="h-4 w-4" />
                Reemplazar
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Subir comprobante
              </>
            )}
          </button>
        )}

        {metodoPago === "efectivo" && !pedidoConfirmadoEfectivo && (
          <button
            type="button"
            onClick={onConfirmarEfectivo}
            className="flex h-11 w-52 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition hover:bg-[var(--brand-dark)]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmar pedido
          </button>
        )}
      </div>
    </>
  );
}

ya teniendo todos mis datos de mis tablas y todos mis codigos y componente ahora quiero que se me actualice mi pedido y registren mis pedido_eventos, pedido_checklist_items y pedidos_pago(con todos que vana ser anticipo y el metodo es el metode pago selecionado por el cliente, el comprobante_url va ser la imagen que suba el cliente y quiero que esa imagen se guarde en mi bucket: empresa-assets y tenga la referencia en mi base de datos en comprobante_url y en monto que sea siempre 0 por que como todavia si es metodo efectivo el cliente tiene que venir al local para realizarme el pago que el monto sea 0, lo mismo con QR como el admin o propietario del taller todavia no vio el comprobante no puede confirma el monto asi que en ese caso tambien monto en 0 hasta que el admin verifique el comprobante en la appmovil y en todo caso que el cliente suba el comprobante que muestre un mensaje de comprobante subido correctamente en espere que se verifique el comprobante o un mensaje algo asi y cuando el comprbante ya fue verificado en la app movil le cambie el mensaje y le digas commprobante verificado correctamente o algun mensaje asi) con estas modificaciones dame mis codigos completo para que funcionen con esta flujo profesional 
