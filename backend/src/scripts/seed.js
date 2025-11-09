// src/scripts/seed.js
// Script para cargar categorías y preguntas desde el JSON a la BD

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const CategoryModel = require('../models/categoryModel');
const QuestionModel = require('../models/questionModel');

// Ruta al archivo JSON
const jsonPath = path.join(__dirname, '../Data/questions.json');

async function seed() {
  try {
    console.log('Iniciando carga de datos desde JSON...\n');

    // 1. Leer el archivo JSON
    console.log('Leyendo archivo JSON...');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    console.log(`JSON cargado correctamente\n`);

    // 2. Verificar que el JSON tiene estructura correcta
    if (!data.categories || !data.questions) {
      throw new Error('El JSON debe tener propiedades "categories" y "questions"');
    }

    console.log(`Datos encontrados:`);
    console.log(`   - ${data.categories.length} categorías`);
    console.log(`   - ${data.questions.length} preguntas\n`);

    // 3. Limpiar datos existentes (opcional - comentar si quieres conservar datos)
    // console.log('  Limpiando datos existentes...');
    // await pool.query('DELETE FROM question_options');
    // await pool.query('DELETE FROM questions');
    // await pool.query('DELETE FROM categories');
    // console.log(' Base de datos limpiada\n');

    // 4. Insertar categorías
    console.log('Insertando categorías...');
    const insertedCategories = [];
    
    for (const category of data.categories) {
      try {
        // Verificar si ya existe
        const existing = await CategoryModel.getByName(category.name);
        
        if (existing) {
          console.log(`     ${category.name} (ya existe, ID: ${existing.id})`);
          insertedCategories.push(existing);
        } else {
          const newCategory = await CategoryModel.create(
            category.name,
            category.description
          );
          console.log(`   ${category.name} (ID: ${newCategory.id})`);
          insertedCategories.push(newCategory);
        }
      } catch (error) {
        console.error(`    Error insertando categoría ${category.name}:`, error.message);
      }
    }
    console.log(` ${insertedCategories.length} categorías procesadas\n`);

    // 5. Insertar preguntas
    console.log(' Insertando preguntas...');
    let questionsCreated = 0;
    let questionsSkipped = 0;

    for (const question of data.questions) {
      try {
        // Crear la pregunta
        const newQuestion = await QuestionModel.create(
          question.category_id,
          question.title,
          question.type,
          question.correct_answer,
          question.points || 10,
          question.created_by || null
        );

        // Si es multiple_choice, insertar opciones
        if (question.type === 'multiple_choice' && question.options && question.options.length > 0) {
          const options = await QuestionModel.createOptions(newQuestion.id, question.options);
          newQuestion.options = options;
          console.log(`    ${question.title.substring(0, 50)}...`);
        } else {
          console.log(`   ${question.title.substring(0, 50)}...`);
        }

        questionsCreated++;
      } catch (error) {
        console.error(`   Error insertando pregunta: ${error.message}`);
        questionsSkipped++;
      }
    }
    console.log(` ${questionsCreated} preguntas insertadas\n`);

    if (questionsSkipped > 0) {
      console.log(`  ${questionsSkipped} preguntas tuvieron error\n`);
    }

    // 6. Verificar datos en la BD
    console.log(' Verificando datos en la base de datos...');
    const allCategories = await CategoryModel.getAll();
    const allQuestions = await QuestionModel.getAll();
    console.log(`Categorías en BD: ${allCategories.length}`);
    console.log(`Preguntas en BD: ${allQuestions.length}\n`);

    console.log('SEED COMPLETADO CORRECTAMENTE');
    console.log('Ahora puedes usar la aplicación con los datos cargados\n');

  } catch (error) {
    console.error('Error durante el seed:', error.message);
    process.exit(1);
  } finally {
    // Cerrar conexión a la BD
    await pool.end();
    process.exit(0);
  }
}

// Ejecutar el seed
seed();

