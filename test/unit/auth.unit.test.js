const { validateUserCredentials, users } = require('../../backend/utils/auth');

describe('Auth utility functions', () => {
  describe('validateUserCredentials()', () => {
    it('should return the correct user object for valid credentials', () => {
      users.forEach((user) => {
        const result = validateUserCredentials(user.username, user.password);
        expect(result).toEqual(user);
      });
    });

    it('should return undefined for an invalid username', () => {
      const result = validateUserCredentials('nonexistent', 'adminPass');
      expect(result).toBeUndefined();
    });

    it('should return undefined for an invalid password', () => {
      const result = validateUserCredentials('admin', 'wrongPass');
      expect(result).toBeUndefined();
    });

    it('should return undefined when both username and password are invalid', () => {
      const result = validateUserCredentials('foo', 'bar');
      expect(result).toBeUndefined();
    });
  });
});
