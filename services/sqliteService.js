import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('mydatabase.db');

// Dentro de este archivo iran las sentencias y queries sql

const init = () => {
}

const actualizarGasolina = () => {
    const result = db.runSync()
}

export default {
    init,
    actualizarGasolina,
}


