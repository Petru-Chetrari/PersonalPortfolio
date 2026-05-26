import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import { ProjectEntity } from '../entities/Project';
import { TagEntity } from '../entities/Tag';
import type { Project, ProjectCreate, ProjectUpdate } from '../models/project.model';
import type { PaginatedResult } from './commission.service';
import { In } from 'typeorm';

export const ProjectService = {
  async list(page = 1, limit = 10): Promise<PaginatedResult<Project>> {
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const [entities, total] = await projectRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['tags'],
    });

    const totalPages = Math.ceil(total / limit) || 1;
    const data = entities.map(this.mapToModel);

    return { data, total, page, limit, totalPages };
  },

  async getById(id: string): Promise<Project | null> {
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const entity = await projectRepo.findOne({ where: { id }, relations: ['tags'] });
    return entity ? this.mapToModel(entity) : null;
  },

  async create(payload: ProjectCreate): Promise<Project> {
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const tagRepo = AppDataSource.getRepository(TagEntity);

    const tags = await Promise.all(
      (payload.tags ?? []).map(async (tagName) => {
        let tag = await tagRepo.findOneBy({ name: tagName });
        if (!tag) {
          tag = tagRepo.create({ name: tagName });
          await tagRepo.save(tag);
        }
        return tag;
      })
    );

    const id = uuidv4();
    const project = projectRepo.create({
      id,
      image: payload.image ?? '',
      imageAlt: payload.imageAlt,
      type: payload.type,
      title: payload.title,
      desc: payload.desc,
      tags,
    });

    await projectRepo.save(project);
    return this.mapToModel(project);
  },

  async update(id: string, payload: ProjectUpdate): Promise<Project | null> {
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const tagRepo = AppDataSource.getRepository(TagEntity);

    const project = await projectRepo.findOne({ where: { id }, relations: ['tags'] });
    if (!project) return null;

    if (payload.image !== undefined) project.image = payload.image;
    if (payload.imageAlt !== undefined) project.imageAlt = payload.imageAlt;
    if (payload.type !== undefined) project.type = payload.type;
    if (payload.title !== undefined) project.title = payload.title;
    if (payload.desc !== undefined) project.desc = payload.desc;

    if (payload.tags !== undefined) {
      const tags = await Promise.all(
        payload.tags.map(async (tagName) => {
          let tag = await tagRepo.findOneBy({ name: tagName });
          if (!tag) {
            tag = tagRepo.create({ name: tagName });
            await tagRepo.save(tag);
          }
          return tag;
        })
      );
      project.tags = tags;
    }

    await projectRepo.save(project);
    return this.mapToModel(project);
  },

  async remove(id: string): Promise<boolean> {
    const projectRepo = AppDataSource.getRepository(ProjectEntity);
    const result = await projectRepo.delete(id);
    return (result.affected ?? 0) > 0;
  },

  mapToModel(entity: ProjectEntity): Project {
    return {
      id: entity.id,
      image: entity.image,
      imageAlt: entity.imageAlt,
      type: entity.type,
      title: entity.title,
      desc: entity.desc,
      tags: entity.tags?.map(t => t.name) ?? [],
    };
  }
};
