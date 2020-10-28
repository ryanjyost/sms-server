"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable(
    "logs",
    {
      id: {
        type: "uuid",
        primaryKey: true
      },
      text: "text",
      phone_id: {
        type: "uuid",
        notNull: true,
        foreignKey: {
          name: "log_phone_fk",
          table: "phone",
          rules: {
            onDelete: "CASCADE",
            onUpdate: "RESTRICT"
          },
          mapping: {
            phone_id: "id"
          }
        }
      },
      created: {
        type: "timestamp",
        defaultValue: new String("current_timestamp")
      },
      updated: {
        type: "timestamp",
        defaultValue: new String("current_timestamp")
      }
    },
    callback
  );

  db.createTable(
    "phone",
    {
      id: {
        type: "uuid",
        primaryKey: true
      },
      phone_number: { type: "string", unique: true },
      created: {
        type: "timestamp",
        defaultValue: new String("current_timestamp")
      },
      updated: {
        type: "timestamp",
        defaultValue: new String("current_timestamp")
      }
    },
    callback
  );
};

exports.down = function(db) {
  db.dropTable("logs");
  db.dropTable("phone");
};

exports._meta = {
  version: 1
};
