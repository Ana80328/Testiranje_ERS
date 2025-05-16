const {
  validateAmount,
  validateDescription,
  validateType,
  validateStatusChange,
  isAdmin,
  ALLOWED_TYPES
} = require('../../backend/utils/validators');

describe('Reimbursement validator', () => {
  describe('validateAmount()', () => {
    it('should pass for positive numbers', () => {
      expect(validateAmount(100)).toBe(true);
      expect(validateAmount(0.01)).toBe(true);
    });

    it('should fail for 0 or negative numbers', () => {
      expect(validateAmount(0)).toBe(false);
      expect(validateAmount(-10)).toBe(false);
    });

    it('should fail for non-number types', () => {
      expect(validateAmount('100')).toBe(false);
      expect(validateAmount(null)).toBe(false);
    });
  });

  describe('validateDescription()', () => {
    it('should pass for valid descriptions', () => {
      expect(validateDescription('Taxi to airport')).toBe(true);
      expect(validateDescription('A'.repeat(200))).toBe(true);
    });

    it('should fail for descriptions that are too short or long', () => {
      expect(validateDescription('')).toBe(false);
      expect(validateDescription('Hey')).toBe(false);
      expect(validateDescription('A'.repeat(201))).toBe(false);
    });

    it('should fail for non-string inputs', () => {
      expect(validateDescription(12345)).toBe(false);
    });
  });

  describe('validateType()', () => {
    it('should accept only allowed types', () => {
      ALLOWED_TYPES.forEach(type => {
        expect(validateType(type)).toBe(true);
      });
    });

    it('should reject invalid types', () => {
      expect(validateType('coffee')).toBe(false);
      expect(validateType('')).toBe(false);
    });
  });

  describe('validateStatusChange()', () => {
    it('should accept only Approved or Rejected', () => {
      expect(validateStatusChange('Approved')).toBe(true);
      expect(validateStatusChange('Rejected')).toBe(true);
    });

    it('should reject invalid statuses', () => {
      expect(validateStatusChange('In Review')).toBe(false);
    });
  });

  describe('isAdmin()', () => {
    it('should return true only if role is "admin"', () => {
      expect(isAdmin('admin')).toBe(true);
      expect(isAdmin('user')).toBe(false);
      expect(isAdmin('manager')).toBe(false);
    });
  });
});
