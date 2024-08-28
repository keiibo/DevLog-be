import express from 'express';
import Project from '../model/Project';
import User from '../model/User';

/**
 * プロジェクトの新規作成
 */
const postProject = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { name, detail, limitDate, projectId, userId } = req.body;
    const user = await User.findOne({ userId });
    const newProject = new Project({
      name,
      detail,
      limitDate,
      projectId,
      userId: user?._id
    });
    await newProject.save();
    res.status(201).send(newProject);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

/**
 * すべてのプロジェクトを取得する
 */
const getAllProject = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { userId } = req.params;

  const user = await User.findOne({ userId });

  try {
    const projects = await Project.find({
      userId: user?._id
    });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * プロジェクトの詳細取得
 */
const getProject = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({projectId:projectId});
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  postProject,
  getProject,
  getAllProject
};
