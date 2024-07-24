import express from "express";
import Project from "../model/Project";

/**
 * プロジェクトの新規作成
 */
const postProject = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { name, detail, limitDate } = req.body;
    const newProject = new Project({ name, detail, limitDate });
    await newProject.save();
    res.status(201).send(newProject);
  } catch (error: any) {
    console.log(error);
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
  try {
    const projects = await Project.find();
    console.log(projects);

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
    console.log(projectId);

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  postProject,
  getProject,
  getAllProject,
};
