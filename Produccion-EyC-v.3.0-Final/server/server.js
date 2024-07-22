const { app, port } = require('./config');

// Importar rutas específicas
const exportExcelRoutes = require('./routes/exportExcel');
const getInspectionRoutes = require('./routes/getInspections');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// Usar las rutas específicas
app.use('/api/exportExcel', exportExcelRoutes);
app.use('/api/getInspections', getInspectionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Iniciar server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
