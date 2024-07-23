import Project from "../models/project.js";

class ProjectRepository {
    async createProject(projectData) {
        try {
            const response = await Project.create(projectData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getProjects(filter) {
        try {
            const response = await Project.find(filter);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async deleteProject(projectId) {
        try {
            const response = await Project.findByIdAndDelete(projectId).lean();
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default ProjectRepository;