import * as SQLite from 'expo-sqlite';

let dbPromise = null;

export const getDb = () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('movil.db');
  }
  return dbPromise;
};

export const initDb = async () => {
    const db = await getDb();
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS fuel_records (
            id TEXT PRIMARY KEY NOT NULL,
            kilometraje TEXT,
            cantidad TEXT,
            valor TEXT,
            fecha TEXT
        );
        CREATE TABLE IF NOT EXISTS routes_history (
            id TEXT PRIMARY KEY NOT NULL,
            origen TEXT,
            destino TEXT,
            distancia TEXT,
            motivo TEXT,
            fecha TEXT
        );
    `);
};

export const addFuelRecord = async (record) => {
    const db = await getDb();
    const statement = await db.prepareAsync('INSERT INTO fuel_records (id, kilometraje, cantidad, valor, fecha) VALUES ($id, $kilometraje, $cantidad, $valor, $fecha)');
    try {
        await statement.executeAsync({
            $id: record.id,
            $kilometraje: record.kilometraje,
            $cantidad: record.cantidad,
            $valor: record.valor,
            $fecha: record.fecha
        });
    } finally {
        await statement.finalizeAsync();
    }
};

export const getFuelRecords = async () => {
    const db = await getDb();
    const result = await db.getAllAsync('SELECT * FROM fuel_records ORDER BY fecha DESC');
    return result;
};

export const addRouteRecord = async (record) => {
    const db = await getDb();
    const statement = await db.prepareAsync('INSERT INTO routes_history (id, origen, destino, distancia, motivo, fecha) VALUES ($id, $origen, $destino, $distancia, $motivo, $fecha)');
    try {
        await statement.executeAsync({
            $id: record.id,
            $origen: record.origen,
            $destino: record.destino,
            $distancia: record.distancia,
            $motivo: record.motivo,
            $fecha: record.fecha
        });
    } finally {
        await statement.finalizeAsync();
    }
};

export const getRoutesRecords = async () => {
    const db = await getDb();
    const result = await db.getAllAsync('SELECT * FROM routes_history ORDER BY fecha DESC');
    return result;
};

export const clearAllLocalData = async () => {
    const db = await getDb();
    await db.execAsync(`
        DELETE FROM fuel_records;
        DELETE FROM routes_history;
    `);
};
