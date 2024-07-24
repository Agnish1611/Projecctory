import ProjectService from "../services/projectService.js";
import TaskService from "../services/taskService.js";

const projectService = new ProjectService();
const taskService = new TaskService();

const createProject = async (req, res) => {
    try {
        const { admins, name, participants } = req.body;

        const response = await projectService.createProject({ admins, name, participants });
        return res.status(201).json({
            msg: 'Created a new project',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        let projectData = {};
        if (req.body?.addParticipant) projectData = { ...projectData, addParticipant:  req.body.addParticipant };
        else if (req.body?.removeParticipant) projectData = { ...projectData, removeParticipant: req.body.removeParticipant };
        else if (req.body?.removeTask) projectData = { ...projectData, removeTask: req.body.removeTask };
        else if (req.body?.addAdmin) projectData = { ...projectData, addAdmin: req.body.addAdmin };
        else if (req.body?.removeAdmin) projectData = { ...projectData, removeAdmin: req.body.removeAdmin };
        else {
            return res.status(400).json({
                err: 'Missing any valid user data'
            });
        }

        const response = await projectService.updateProject(projectId, projectData);
        return res.status(200).json({
            msg: 'Updated the project',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const addTask = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { description, deadline } = req.body;
        let taskData = { description, deadline };

        if (req.body?.labels.length) taskData = { ...taskData, labels: req.body.labels };
        if (req.body?.priority) taskData = { ...taskData, priority: req.body.priority };

        const response = await taskService.createTask(taskData);
        const project = await projectService.getProjects({ _id: projectId });
        project[0].tasks.push(response._id);
        project[0].save();

        return res.status(200).json({
            msg: `Added the task to project ${project[0].name}`,
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const response = await projectService.deleteProject(projectId);
        return res.status(200).json({
            msg: 'Deleted the project',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

const getProjectsByUser = async (req, res) => {
    try {
        const user = req.params.id;

        const response = await projectService.getProjectsByUser(user);
        return res.status(200).json({
            msg: 'Fetched the projects',
            data: response
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Something went wrong',
            err: error
        });
    }
}

export {
    createProject,
    updateProject,
    addTask,
    deleteProject,
    getProjectsByUser
}