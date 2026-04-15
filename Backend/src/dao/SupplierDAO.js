const { sql, connectDB } = require('../config/dbConfig');

class SupplierDAO {
    static async getAll() {
        const pool = await connectDB();
        const result = await pool.request().query("SELECT * FROM Suppliers");
        return result.recordset;
    }

    static async create(data) {
        const pool = await connectDB();
        await pool.request()
           .input('Name', sql.NVarChar, data.name)
           .input('LeadTime', sql.Int, data.leadTime)
           .input('Contact', sql.NVarChar, data.contactInfo)
           .query("INSERT INTO Suppliers (name, lead_time, contact_info) VALUES (@Name, @LeadTime, @Contact)");
    }
}
module.exports = SupplierDAO;