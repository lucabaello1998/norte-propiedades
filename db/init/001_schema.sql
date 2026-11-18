-- Norte Propiedades — esquema base (demo)
-- Se ejecuta una sola vez, cuando el volumen de Postgres está vacío.

CREATE TABLE IF NOT EXISTS properties (
    id            SERIAL PRIMARY KEY,
    slug          TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    operation     TEXT NOT NULL CHECK (operation IN ('venta', 'alquiler')),
    type          TEXT NOT NULL CHECK (type IN ('casa', 'departamento', 'ph', 'duplex', 'terreno', 'local')),
    neighborhood  TEXT NOT NULL,
    address       TEXT,
    price         NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
    currency      TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'ARS')),
    expenses      NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (expenses >= 0),
    bedrooms      SMALLINT NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms     SMALLINT NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
    garages       SMALLINT NOT NULL DEFAULT 0 CHECK (garages >= 0),
    area_m2       SMALLINT CHECK (area_m2 > 0),
    lot_m2        SMALLINT CHECK (lot_m2 > 0),
    featured      BOOLEAN NOT NULL DEFAULT FALSE,
    status        TEXT NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'reservada', 'vendida', 'alquilada')),
    description   TEXT NOT NULL DEFAULT '',
    amenities     TEXT[] NOT NULL DEFAULT '{}',
    images        TEXT[] NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id           SERIAL PRIMARY KEY,
    property_id  INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    name         TEXT NOT NULL,
    phone        TEXT NOT NULL,
    email        TEXT,
    message      TEXT NOT NULL DEFAULT '',
    status       TEXT NOT NULL DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'contactado', 'cerrado')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS properties_updated_at ON properties;
CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS properties_operation_idx ON properties (operation);
CREATE INDEX IF NOT EXISTS properties_type_idx ON properties (type);
CREATE INDEX IF NOT EXISTS properties_neighborhood_idx ON properties (neighborhood);
CREATE INDEX IF NOT EXISTS properties_featured_idx ON properties (featured) WHERE featured;
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties (price);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
