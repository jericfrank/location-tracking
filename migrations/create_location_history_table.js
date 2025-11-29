exports.up = pgm => {
  pgm.createTable("location_history", {
    id: "id",
    device_id: { type: "varchar(255)", notNull: true },
    lat: { type: "double precision", notNull: true },
    lng: { type: "double precision", notNull: true },
    timestamp: { type: "bigint", notNull: true }
  });
};

exports.down = pgm => {
  pgm.dropTable("location_history");
};
