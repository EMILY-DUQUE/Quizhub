// src/controllers/categoryController.js
const CategoryModel = require('../models/categoryModel');

const CategoryController = {
  // GET /api/categories
  // Obtener todas las categorías
  getAll: async (req, res) => {
    try {
      const categories = await CategoryModel.getAll();

      res.json({
        success: true,
        data: {
          categories,
          count: categories.length
        }
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando categorías',
        error: error.message
      });
    }
  },

  // GET /api/categories/:id
  // Obtener una categoría específica
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await CategoryModel.getById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      res.json({
        success: true,
        data: { category }
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        success: false,
        message: 'Error consultando categoría',
        error: error.message
      });
    }
  },

  // POST /api/categories
  // Crear nueva categoría
  create: async (req, res) => {
    try {
      const { name, description } = req.body;

      // Validaciones
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio'
        });
      }

      if (name.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'El nombre debe tener al menos 3 caracteres'
        });
      }

      // Verificar si la categoría ya existe
      const existingCategory = await CategoryModel.getByName(name);
      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: 'La categoría ya existe'
        });
      }

      // Crear categoría
      const newCategory = await CategoryModel.create(name, description || null);

      res.status(201).json({
        success: true,
        message: 'Categoría creada correctamente',
        data: { category: newCategory }
      });
    } catch (error) {
      console.error('Error en create:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando categoría',
        error: error.message
      });
    }
  },

  // PUT /api/categories/:id
  // Actualizar categoría
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      // Validaciones
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es obligatorio'
        });
      }

      // Verificar si la categoría existe
      const existingCategory = await CategoryModel.getById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      // Verificar si el nuevo nombre ya existe en otra categoría
      if (name !== existingCategory.name) {
        const duplicateName = await CategoryModel.getByName(name);
        if (duplicateName) {
          return res.status(409).json({
            success: false,
            message: 'El nombre de categoría ya está en uso'
          });
        }
      }

      // Actualizar
      const updatedCategory = await CategoryModel.update(id, name, description || null);

      res.json({
        success: true,
        message: ' Categoría actualizada correctamente',
        data: { category: updatedCategory }
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando categoría',
        error: error.message
      });
    }
  },

  // DELETE /api/categories/:id
  // Eliminar categoría
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar si la categoría existe
      const category = await CategoryModel.getById(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
      }

      // Eliminar
      await CategoryModel.delete(id);

      res.json({
        success: true,
        message: 'Categoría eliminada correctamente',
        data: { id }
      });
    } catch (error) {
      console.error('Error en delete:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando categoría',
        error: error.message
      });
    }
  },

  // POST /api/categories/import
  // Importar varias categorías desde JSON
  import: async (req, res) => {
    try {
      const { categories } = req.body;

      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Debe enviar un arreglo de categorías'
        });
      }

      const inserted = [];

      for (const cat of categories) {
        // Validar que tenga nombre
        if (!cat.name) continue;

        // Verificar si ya existe
        const existing = await CategoryModel.getByName(cat.name);
        if (existing) {
          inserted.push(existing); // si ya existe, lo saltamos
          continue;
        }

        // Crear la categoría
        const newCat = await CategoryModel.create(cat.name, cat.description || null);
        inserted.push(newCat);
      }

      res.json({
        success: true,
        message: ` ${inserted.length} categorías importadas correctamente`,
        data: inserted
      });
    } catch (error) {
      console.error(' Error en import:', error);
      res.status(500).json({
        success: false,
        message: 'Error importando categorías',
        error: error.message
      });
    }
  }
};

module.exports = CategoryController;
