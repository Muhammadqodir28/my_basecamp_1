import { Schema, model } from 'mongoose'

const ProjectSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true})

const Project = model('Project', ProjectSchema)
export default Project
