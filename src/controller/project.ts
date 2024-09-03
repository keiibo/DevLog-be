import express from 'express';
import Project from '../model/Project';
import User from '../model/User';
import LinkIcon from '../model/detail/LinkIcons';
import { v4 as uuidv4 } from 'uuid';
import Category from '../model/ticket/Category';
import mongoose from 'mongoose';

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

    // カテゴリの初期登録
    // デフォルトカテゴリの配列
    const defaultCategories = [
      '要件定義',
      'デザイン',
      '設計',
      '実装',
      'テスト'
    ];

    // 各カテゴリを登録
    for (const categoryName of defaultCategories) {
      const newCategory = new Category({
        uuid: uuidv4(),
        name: categoryName,
        projectId: projectId
      });
      await newCategory.save();
    }
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
    const project = await Project.findOne({ projectId: projectId });
    const linkIconData = await LinkIcon.findOne({ projectId: projectId });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // レスポンスオブジェクトの構築
    const response = {
      _id: project._id.toString(),
      projectId: project.projectId,
      name: project.name,
      detail: project.detail,
      limitDate: project.limitDate.toISOString(), // 日付をISO文字列に変換
      linkIconList: linkIconData ? linkIconData.linkIconList : []
    };

    res.status(200).json(response);
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
