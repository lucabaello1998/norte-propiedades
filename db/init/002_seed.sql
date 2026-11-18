-- Datos de ejemplo. Ficticios: cualquier parecido con una propiedad real es coincidencia.
INSERT INTO properties
    (slug, title, operation, type, neighborhood, address, price, currency, expenses,
     bedrooms, bathrooms, garages, area_m2, lot_m2, featured, status, description, amenities, images, created_at)
VALUES
    (
        'casa-en-el-palomar',
        'Casa de 4 ambientes con jardín y parrilla',
        'venta', 'casa', 'El Palomar', 'Los Cedros al 1200',
        285000, 'USD', 0, 3, 2, 2, 180, 300, TRUE, 'disponible',
        'Casa desarrollada en dos plantas, con living comedor luminoso, cocina integrada y salida a jardín con parrilla. A pocas cuadras de la estación y de los principales accesos. Lista para entrar a vivir.',
        ARRAY['Jardín', 'Parrilla', 'Cochera', 'Apto crédito', 'Luminoso'],
        ARRAY['/images/foto-01.jpg', '/images/foto-03.jpg', '/images/foto-05.jpg', '/images/foto-16.jpg'],
        NOW() - INTERVAL '18 days'
    ),
    (
        'casa-en-castelar',
        'Casa moderna de 5 ambientes con pileta',
        'venta', 'casa', 'Castelar', 'Av. Santa Rosa al 1700',
        320000, 'USD', 0, 4, 3, 2, 220, 400, TRUE, 'disponible',
        'Arquitectura contemporánea sobre lote propio, con gran ventanal hacia el jardín y pileta. Planta baja con living, comedor y cocina abierta; planta alta con suite principal y tres dormitorios. Cochera para dos autos.',
        ARRAY['Pileta', 'Jardín', 'Parrilla', 'Cochera', 'Terraza'],
        ARRAY['/images/foto-08.jpg', '/images/foto-07.jpg', '/images/foto-04.jpg'],
        NOW() - INTERVAL '12 days'
    ),
    (
        'ph-en-haedo',
        'PH de 3 ambientes reciclado a nuevo',
        'venta', 'ph', 'Haedo', 'Boulogne Sur Mer al 900',
        165000, 'USD', 0, 2, 2, 1, 110, 150, TRUE, 'disponible',
        'PH al frente, reciclado íntegramente en 2025: instalaciones nuevas, pisos de madera y carpintería a medida. Patio con parrilla y cochera descubierta. Ideal primera vivienda o inversión.',
        ARRAY['Patio', 'Parrilla', 'Cochera', 'Apto crédito', 'Reciclado'],
        ARRAY['/images/foto-15.jpg', '/images/foto-06.jpg', '/images/foto-05.jpg'],
        NOW() - INTERVAL '9 days'
    ),
    (
        'depto-en-ramos-mejia',
        'Departamento de 2 ambientes con balcón',
        'venta', 'departamento', 'Ramos Mejía', 'Av. Rivadavia al 13.800',
        120000, 'USD', 45000, 1, 1, 1, 55, NULL, TRUE, 'disponible',
        'Departamento luminoso en edificio con ascensor, a metros de la estación de Ramos Mejía. Living comedor con balcón corrido, cocina separada y cochera cubierta. Muy buen estado general.',
        ARRAY['Balcón', 'Ascensor', 'Cochera', 'Baulera', 'Apto crédito'],
        ARRAY['/images/foto-03.jpg', '/images/foto-04.jpg', '/images/foto-07.jpg'],
        NOW() - INTERVAL '6 days'
    ),
    (
        'casa-en-moron',
        'Casa de 4 ambientes con patio y cochera',
        'venta', 'casa', 'Morón', 'Yrigoyen al 500',
        240000, 'USD', 0, 3, 2, 2, 200, 500, FALSE, 'disponible',
        'Casa de estilo con galería, patio arbolado y parrilla. Tres dormitorios, dos baños y cochera para dos autos. Terreno de 500 m² con posibilidad de ampliación. Zona residencial y tranquila.',
        ARRAY['Patio', 'Parrilla', 'Cochera', 'Apto crédito', 'Galeria'],
        ARRAY['/images/foto-11.jpg', '/images/foto-10.jpg', '/images/foto-05.jpg'],
        NOW() - INTERVAL '21 days'
    ),
    (
        'duplex-en-ciudad-jardin',
        'Dúplex de 4 ambientes con terraza',
        'venta', 'duplex', 'Ciudad Jardín', 'El Zorzal al 300',
        195000, 'USD', 0, 3, 2, 1, 140, 200, FALSE, 'reservada',
        'Dúplex en complejo cerrado de cuatro unidades. Planta baja con living comedor y cocina; planta alta con tres dormitorios y terraza propia. Jardín compartido y cochera asignada.',
        ARRAY['Terraza', 'Jardín', 'Parrilla', 'Cochera', 'Complejo cerrado'],
        ARRAY['/images/foto-12.jpg', '/images/foto-14.jpg', '/images/foto-16.jpg'],
        NOW() - INTERVAL '30 days'
    ),
    (
        'casa-en-bella-vista',
        'Casa de 5 ambientes con pileta y jardín',
        'venta', 'casa', 'Bella Vista', 'O Higgins al 1200',
        350000, 'USD', 0, 4, 3, 3, 250, 600, FALSE, 'disponible',
        'Propiedad sobre lote de 600 m² con pileta, jardín consolidado y quincho. Living con doble altura, suite principal con vestidor y tres dormitorios. Cochera para tres autos y portón automático.',
        ARRAY['Pileta', 'Jardín', 'Parrilla', 'Cochera', 'Seguridad'],
        ARRAY['/images/foto-09.jpg', '/images/foto-02.jpg', '/images/foto-13.jpg'],
        NOW() - INTERVAL '35 days'
    ),
    (
        'casa-en-villa-tesei',
        'Casa de 3 ambientes con patio',
        'venta', 'casa', 'Villa Tesei', 'Veragua al 800',
        175000, 'USD', 0, 2, 1, 1, 95, 180, FALSE, 'disponible',
        'Casa al frente con patio y parrilla, a cinco minutos de la Universidad Nacional de Hurlingham. Dos dormitorios, living comedor y cocina con salida al patio. Muy buen estado, apta crédito.',
        ARRAY['Patio', 'Parrilla', 'Cochera', 'Apto crédito'],
        ARRAY['/images/foto-10.jpg', '/images/foto-06.jpg', '/images/foto-11.jpg'],
        NOW() - INTERVAL '40 days'
    ),
    (
        'alquiler-en-ramos-mejia',
        'Departamento de 2 ambientes amoblado',
        'alquiler', 'departamento', 'Ramos Mejía', 'Belgrano al 600',
        780000, 'ARS', 120000, 1, 1, 0, 50, NULL, FALSE, 'disponible',
        'Departamento amoblado y equipado, listo para mudarse. Living comedor con balcón, cocina completa y dormitorio con placard. Edificio con ascensor y portero. Expensas incluyen agua y calefacción.',
        ARRAY['Amoblado', 'Balcón', 'Ascensor', 'Aire acondicionado'],
        ARRAY['/images/foto-04.jpg', '/images/foto-03.jpg', '/images/foto-07.jpg'],
        NOW() - INTERVAL '4 days'
    ),
    (
        'alquiler-en-haedo',
        'PH de 3 ambientes con cochera',
        'alquiler', 'ph', 'Haedo', 'Monseñor Rasore al 100',
        950000, 'ARS', 0, 2, 1, 1, 90, 120, FALSE, 'disponible',
        'PH con entrada independiente, patio y parrilla. Dos dormitorios, living comedor y cocina separada. Cochera propia. A cuatro cuadras de la estación de Haedo y del centro comercial.',
        ARRAY['Patio', 'Parrilla', 'Cochera', 'Independiente'],
        ARRAY['/images/foto-06.jpg', '/images/foto-15.jpg', '/images/foto-05.jpg'],
        NOW() - INTERVAL '2 days'
    )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO leads (property_id, name, phone, email, message, status, created_at)
VALUES
    ((SELECT id FROM properties WHERE slug = 'casa-en-el-palomar'),
     'Martina Gómez', '+54 11 5555-1234', 'martina.gomez@example.com',
     'Hola, me interesa la casa de El Palomar. ¿Se puede visitar el sábado a la mañana?',
     'nuevo', NOW() - INTERVAL '5 hours'),
    ((SELECT id FROM properties WHERE slug = 'depto-en-ramos-mejia'),
     'Diego Fernández', '+54 11 5555-5678', 'diego.fernandez@example.com',
     'Quisiera saber si aceptan crédito hipotecario y cuánto son las expensas.',
     'contactado', NOW() - INTERVAL '2 days'),
    (NULL,
     'Sofía Rossi', '+54 11 5555-9012', 'sofia.rossi@example.com',
     'Estoy pensando en vender mi casa en Haedo. ¿Hacen tasación sin cargo?',
     'nuevo', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;
