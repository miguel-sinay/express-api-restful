const express = require('express')

const {programacion} = require('../datos/cursos.js').infoCursos

const routerProgramacion = express.Router()

// Middleware
// Las funciones middleware se ejecutan:
//   DESPUES de recibir una solicitud
//   ANTES de enviar una respuesta
// Tienen acceso al objeto de la solicitud, al objeto de la respuesta y a next(), una
// función que se llama para ejecutar el próximo middleware.
routerProgramacion.use(express.json())

routerProgramacion.get('/', (req, res) => {
    res.send(programacion) // Innecesario JSON.stringify. Por defecto se envía en JSON.
})
routerProgramacion.get('/:lenguaje', (req, res) => {
    const lenguaje = req.params.lenguaje
    const resultados = programacion.filter(curso => curso.lenguaje === lenguaje)
    if (resultados.length === 0) return res.status(404).send(`No se encontraron cursos de ${lenguaje}`)
    if (req.query.ordenar === 'vistas') return res.status(200).send(resultados.sort((a, b) => b.vistas - a.vistas))
    res.status(200).send(resultados)
})
routerProgramacion.get('/:lenguaje/:nivel', (req, res) => {
    const lenguaje = req.params.lenguaje
    const nivel = req.params.nivel
    const resultados = programacion.filter(curso => curso.lenguaje === lenguaje && curso.nivel === nivel)
    if (resultados.length === 0) {
        return res.status(204).send(`No se encontraron cursos de ${lenguaje} de nivel ${nivel}`)
        // return res.status(404).end() // end() por si queremos enviar una respuesta vacía
    }
    res.json(resultados) // json() para asegurarnos que el argumento del tipo de dato que sea que pasemos se converta a JSON
})
routerProgramacion.post('/', (req, res) => {
    let cursoNuevo = req.body
    programacion.push(cursoNuevo)
    res.status(201).send(programacion)
})
routerProgramacion.put('/:id', (req, res) => {
    const cursoActualizado = req.body
    const id = req.params.id

    const indice = programacion.findIndex(curso => curso.id == id)

    if (indice >= 0) {
        programacion[indice] = cursoActualizado
        return res.send(programacion)
    }
    res.status(404).send('Recurso no encontrado')
})
routerProgramacion.patch('/:id', (req, res) => {
    const infoActualizada = req.body
    const id = req.params.id

    const indice = programacion.findIndex(curso => curso.id == id)
    if (indice >= 0) {
        const cursoAModificar = programacion[indice]
        Object.assign(cursoAModificar, infoActualizada)
        return res.send(programacion)
    }
    res.status(404).send('Recurso no encontrado')
})
routerProgramacion.delete('/:id', (req, res) => {
    const id = req.params.id
    const indice = programacion.findIndex(curso => curso.id == id)
    if (indice >= 0) {
        programacion.splice(indice, 1)
        res.send(programacion)
    }
    res.status(404).send('Recurso no encontrado')
})

module.exports = routerProgramacion