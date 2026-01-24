// ===== BACKEND DELETE ENDPOINT FOR PROPERTIES =====
// Add this code to your backend server file (app.js, server.js, index.js, etc.)

// For Express.js with MySQL
router.delete('/api/admin/properties/:id', authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log('Deleting property:', propertyId);
    
    // Check if property exists
    const [existingProperty] = await db.query(
      'SELECT id FROM properties WHERE id = ?', 
      [propertyId]
    );
    
    if (!existingProperty || existingProperty.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Delete the property
    const result = await db.query(
      'DELETE FROM properties WHERE id = ?', 
      [propertyId]
    );
    
    console.log('Property deleted successfully:', propertyId);
    res.status(200).json({ 
      message: 'Property deleted successfully',
      deletedId: propertyId
    });
    
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For Express.js with PostgreSQL
router.delete('/api/admin/properties/:id', authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log('Deleting property:', propertyId);
    
    // Check if property exists
    const existingProperty = await db.query(
      'SELECT id FROM properties WHERE id = $1', 
      [propertyId]
    );
    
    if (!existingProperty.rows || existingProperty.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Delete the property
    const result = await db.query(
      'DELETE FROM properties WHERE id = $1 RETURNING id', 
      [propertyId]
    );
    
    console.log('Property deleted successfully:', propertyId);
    res.status(200).json({ 
      message: 'Property deleted successfully',
      deletedId: propertyId
    });
    
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// For Node.js with MongoDB
router.delete('/api/admin/properties/:id', authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log('Deleting property:', propertyId);
    
    // Check if property exists and delete it
    const result = await Property.findByIdAndDelete(propertyId);
    
    if (!result) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    console.log('Property deleted successfully:', propertyId);
    res.status(200).json({ 
      message: 'Property deleted successfully',
      deletedId: propertyId
    });
    
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== INSTALLATION INSTRUCTIONS =====
/*
1. Copy the appropriate code block above based on your database
2. Paste it in your main server file (app.js, server.js, index.js, etc.)
3. Make sure you have:
   - authenticateToken middleware (for admin authentication)
   - db connection (MySQL/PostgreSQL) or Property model (MongoDB)
4. Restart your backend server
5. Test the delete functionality

The frontend is already ready to use this endpoint!
*/