import ProjectRepository from '../repositories/projectRepository.js';
import UserRepository from '../repositories/userRepository.js';
import TaskRepository from '../repositories/taskRepository.js';

class ProjectService {
    constructor() {
        this.projectRepo = new ProjectRepository();
        this.userRepo = new UserRepository();
        this.taskRepo = new TaskRepository();
    }

    async createProject(projectData) {
        try {
            const response = await this.projectRepo.createProject(projectData);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getProjects(filter) {
        try {
            const response = await this.projectRepo.getProjects(filter);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getProjectsByUser(user) {
        try {
            const adminFilter = { admins: { $in: [user] } };
            const participantFilter = { participants: { $in: [user] } };

            const adminProjects = await this.projectRepo.getProjects(adminFilter);
            const participantProjects = await this.projectRepo.getProjects(participantFilter);

            return [
                ...adminProjects,
                ...participantProjects
            ]
        } catch (error) {
            throw error
        }
    }

    async updateProject(projectId, updateData) {
        try {
            const project = await this.projectRepo.getProjects({ _id: projectId });

            if (updateData?.addParticipant) {
                const user = await this.userRepo.findUser({ _id: updateData.addParticipant });
                project[0].participants.push(updateData.addParticipant);
                await project[0].save();
                return {
                    msg: `Added ${user.username} to project ${project[0].name}`
                }
            }
            else if (updateData?.removeParticipant) {
                const user = await this.userRepo.findUser({ _id: updateData.removeParticipant });
                project[0].participants.splice(updateData.addParticipant, 1);
                await project[0].save();
                return {
                    msg: `${user.username} was removed from the project ${project[0].name}`
                }
            }
            else if (updateData?.removeTask) {
                project[0].tasks.splice(updateData.removeTask, 1);
                await project[0].save();
                const task = await this.taskRepo.deleteTask(updateData.removeTask);
                return {
                    msg: `The task was removed from ${project[0].name}`
                }
            }
            else if (updateData?.addAdmin) {
                const user = await this.userRepo.findUser({ _id: updateData.addAdmin });
                project[0].admins.push(updateData.addAdmin);
                await project[0].save();
                return {
                    msg: `${user.username} was added as an admin for project ${project[0].name}`
                }
            }
            else if (updateData?.removeAdmin) {
                const user = await this.userRepo.findUser({ _id: updateData.removeAdmin });
                project[0].admins.splice(updateData.removeAdmin);
                await project[0].save();
                return {
                    msg: `${user.username} was removed as an admin from project ${project[0].name}`
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProject(projectId) {
        try {
            const project = await this.projectRepo.getProjects({ _id: projectId });
            const tasks = project[0].tasks;
            tasks.forEach(async (task) => {
                await this.taskRepo.deleteTask(task);
            });

            const response = await this.projectRepo.deleteProject(projectId);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export default ProjectService;