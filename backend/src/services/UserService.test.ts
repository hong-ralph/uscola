import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = await userService.getAllUsers();
      expect(users).toHaveLength(2);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const user = await userService.getUserById('1');
      expect(user).toBeTruthy();
      expect(user?.id).toBe('1');
      expect(user?.name).toBe('John Doe');
    });

    it('should return null for non-existent user', async () => {
      const user = await userService.getUserById('999');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = { name: 'Test User', email: 'test@example.com' };
      const user = await userService.createUser(userData);
      
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.id).toBeTruthy();
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('updateUser', () => {
    it('should update existing user', async () => {
      const updateData = { name: 'Updated Name' };
      const user = await userService.updateUser('1', updateData);
      
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Updated Name');
      expect(user?.email).toBe('john@example.com'); // original email should remain
    });

    it('should return null for non-existent user', async () => {
      const user = await userService.updateUser('999', { name: 'Test' });
      expect(user).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', async () => {
      const result = await userService.deleteUser('1');
      expect(result).toBe(true);
      
      const user = await userService.getUserById('1');
      expect(user).toBeNull();
    });

    it('should return false for non-existent user', async () => {
      const result = await userService.deleteUser('999');
      expect(result).toBe(false);
    });
  });
});