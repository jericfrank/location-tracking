exports.up = pgm => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS postgis;');

  pgm.sql(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'postgis'
      ) THEN
        RAISE EXCEPTION 'PostGIS extension not available';
      END IF;
    END $$;
  `);
};

exports.down = pgm => {
  pgm.sql('DROP EXTENSION IF EXISTS postgis CASCADE;');
};
