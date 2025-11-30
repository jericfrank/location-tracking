exports.up = pgm => {
  pgm.sql(`
    UPDATE location_history
    SET geometry = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
    WHERE geometry IS NULL 
      AND lat IS NOT NULL 
      AND lng IS NOT NULL;
  `);
};

exports.down = pgm => {
  pgm.sql(`
    UPDATE location_history
    SET geometry = NULL;
  `);
};
