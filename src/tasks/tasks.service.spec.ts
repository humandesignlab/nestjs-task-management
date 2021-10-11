import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({ getTasks: jest.fn(), findOne: jest.fn() });
const mockUser = {
	username: 'Whatevs',
	id: 'whatevs id',
	password: 'password',
	tasks: [],
};

describe('TasksService', () => {
	let tasksService: TasksService;
	let tasksRepository;
	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				TasksService,
				{ provide: TasksRepository, useFactory: mockTasksRepository },
			],
		}).compile();
		tasksService = await module.get(TasksService);
		tasksRepository = module.get(TasksRepository);
	});

	describe('getTaskById', () => {
		it('calls TeskRepository.findOne and returns the result', async () => {
			const mockTask = {
				title: 'whatevs',
				description: 'whatever description',
				id: 'whatever id',
				status: TaskStatus.OPEN,
			};
			tasksRepository.findOne.mockResolvedValue(mockTask);
			const result = await tasksService.getTaskById('someId', mockUser);
			expect(result).toEqual(mockTask);
		});
		it('calls TeskRepository.findOne and handles an error', () => {
			tasksRepository.findOne.mockResolvedValue(null);
			const result = tasksService.getTaskById('whatevs', mockUser);
			expect(result).rejects.toThrow(NotFoundException);
		});
	});

	describe('getTasks', () => {
		it('calls TasksRepository.getTasks and returns the result', async () => {
			expect(tasksRepository.getTasks).not.toHaveBeenCalled();
			tasksRepository.getTasks.mockResolvedValue('whatevs');
			const result = await tasksRepository.getTasks(null, mockUser);
			expect(tasksRepository.getTasks).toHaveBeenCalled();
			expect(result).toEqual('whatevs');
		});
	});
});
