exports.up = pgm => {
  pgm.addColumn('location_history', {
    geometry: {
      type: 'geometry(Point, 4326)',
      notNull: false
    }
  });

  pgm.createIndex('location_history', 'geometry', {
    name: 'idx_location_history_geometry',
    method: 'gist'
  });
};

exports.down = pgm => {
  pgm.dropIndex('location_history', 'geometry', {
    name: 'idx_location_history_geometry'
  });

  pgm.dropColumn('location_history', 'geometry');
};
