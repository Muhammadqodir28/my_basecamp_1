import { Router } from 'express'
import authMiddleware from '../middleware/authmiddleware.js'
import userMiddleware from '../middleware/user.js'
import Project from '../models/Project.js'

const router = Router()

router.get('/', async (req, res) => {
  const projects = await Project.find().lean()

  res.render('index', {
    title: 'Basecamp',
    projects: projects.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  })
})

router.get('/projects', async (req, res) => {
  const user = req.userId ? req.userId.toString() : null
  const myProjects = await Project.find({user}).populate('user').lean()
  res.render('projects', {
    title: 'Projects',
    isProjects: true,
    myProjects: myProjects,
  })
})

router.get('/add', authMiddleware, (req, res) => {
  res.render('add', {
    title: 'Add project',
    isAdd: true,
    errorAddProject: req.flash('errorAddProject')
  })
})

router.get('/project/:id', async (req, res) => {
  const id = req.params.id
  const project = await Project.findById(id).populate('user').lean()

  res.render('project', {
    project: project,
  })
})

router.get('/edit-project/:id', async (req, res) => {
  const id = req.params.id
  const project = await Project.findById(id).populate('user').lean()

  res.render('edit-project', {
    project: project,
    errorEditProject: req.flash('errorEditProject'),
  })
})

router.post('/add-project', userMiddleware, async (req, res) => {
  const {title, description} = req.body
  if(!title || !description) {
    req.flash('errorAddProject', 'All fields is required')
    res.redirect('/add')
    return
  }

  await Project.create({...req.body, user: req.userId})
  res.redirect('/')
})

router.post('/edit-project/:id', async (req, res) => {
  const {title, description} = req.body
  const id = req.params.id
  if(!title || !description) {
    req.flash('errorEditProject', 'All fields is required')
    res.redirect(`/edit-project/${id}`)
    return
  }

  await Project.findByIdAndUpdate(id, req.body, {new: true})
  res.redirect('/projects')
})

router.post('/delete-project/:id', async (req, res) => {
  const id = req.params.id

  await Project.findByIdAndRemove(id)
  res.redirect('/')
})

export default router
