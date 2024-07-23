import TaskRepo from "../repositories/task-repo.js";
import LabelRepo from '../repositories/label-repo.js';

class TaskService {
    constructor() {
        this.taskRepo = new TaskRepo();
        this.labelRepo = new LabelRepo();
    }

    async create(data) {
        try {
            const recurringType = data.recurring.recurringType;
            if (recurringType == 'Daily') {
                const date = new Date(new Date().getTime() + 330*60000).toISOString().split('T')[0];
                // for (let i=)
            }
            const task = await this.taskRepo.create(data);
            let labels = data.labels;

            let presentLabels = await this.labelRepo.findByName(labels);
            let presentLabelTitles = presentLabels.map((label) => {
                return label.title;
            });

            let newLabels = labels.filter((label) => {
                return !presentLabelTitles.includes(label);
            });

            newLabels = newLabels.map((label) => {
                return {
                    title: label,
                    tasks: [task._id]
                }
            });

            await this.labelRepo.bulkCreate(newLabels);

            presentLabels.forEach(async (label) => {
                label.tasks.push(task._id);
                await label.save();
            });

            return task;
        } catch (error) {
            console.log('error at service',error);
            throw error;
        }
    }

    async shiftTask(id) {
        try {
            const task = await this.taskRepo.getById(id);
            const date = task.date;
            const labels = task.labels;
            if (!labels.includes('shifted')) {
                labels.push('shifted');
                const isPresent = await this.labelRepo.findByName('shifted');
                if (isPresent.title == 'shifted') {
                    isPresent.tasks.push(task._id);
                    await isPresent.save();
                }
                else {
                    const newLabel = [
                        {
                            title: 'shifted',
                            tasks: [task._id]
                        }
                    ];
                    await this.labelRepo.bulkCreate(newLabel);
                }
            }
            const newDate = this.#getNextDate(date);
            const res = await this.taskRepo.update(id, {date: newDate, labels: labels, priority: 3});
            return res;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const response = await this.taskRepo.update(id, data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUpcoming(id) {
        try {
            let data = [];
            let dates = [];
            for (let i=0; i<7; i++) {
                let date = new Date(new Date().getTime() + 330*60000);
                date.setDate(date.getDate() + i);
                dates[i] = date.toISOString().split('T')[0];
            }
            data[0] = await this.taskRepo.getTasksByUser({user: id, date: dates[0]});
            data[1] = await this.taskRepo.getTasksByUser({user: id, date: dates[1]});
            data[2] = await this.taskRepo.getTasksByUser({user: id, date: dates[2]});
            data[3] = await this.taskRepo.getTasksByUser({user: id, date: dates[3]});
            data[4] = await this.taskRepo.getTasksByUser({user: id, date: dates[4]});
            data[5] = await this.taskRepo.getTasksByUser({user: id, date: dates[5]});
            data[6] = await this.taskRepo.getTasksByUser({user: id, date: dates[6]});

            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTasksByUser(id, data) {
        try {
            let filter = { user: id };
            if (data.date) filter = { ...filter, date: data.date };
            if (data.completed == true) filter = { ...filter, completed: true};
            if (data.completed == false) filter = { ...filter, completed: false};
            if (data.label) filter = { ...filter, labels: { $in: [data.label] } };
            if (data.priority) filter = { ...filter, priority: data.priority};
            const tasks = await this.taskRepo.getTasksByUser(filter);
            return tasks;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const task = await this.taskRepo.getById(id);
            const labels = await this.labelRepo.findByName(task.labels);

            labels.forEach(async (label) => {
                label.users.pull(task.user);
                label.tasks.pull(task._id);
                await label.save();
                if (label.tasks.length == 0) {
                    await this.labelRepo.destroy(label._id);
                }
            });

            const response = await this.taskRepo.delete(id);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    #getNextDate(date) {
        let day = date.substring(8, 10);
        let month = date.substring(5, 7);
        let year = date.substring(0, 4);
        const checkYear = Number(year);
        let leap = false;
        if ((0 == checkYear % 4) && (0 != checkYear % 100) || (0 == checkYear % 400)) leap = true;
        else leap = false;
        if (day == '31' && (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10')) {
            day = '01';
            if (month == '10') month = '11';
            else month = '0' + (Number(month)+1);
        }
        else if (day == '30' && (month == '04' || month == '06' || month == '09' || month == '11')) {
            day = '01';
            if (month == '11') month = '12';
            else if (month == '09') month = '10';
            else month = '0' + (Number(month) + 1);
        }
        else if ((day == '29' && leap && month == '02') || (day == '28' && !leap && month == '02')){
            day = '01';
            month = '03';
        }
        else if (day == '31' && month == '12') {
            year = (Number(year)+1)+'';
            month = '01';
            day = '01';
        }
        else {
            if (day <= '08') day = '0' + (Number(day)+1);
            else day = '' + (Number(day)+1); 
        }
    
        return (year+'-'+month+'-'+day);
    }
}

export default TaskService;