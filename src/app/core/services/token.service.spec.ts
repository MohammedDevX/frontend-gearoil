import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    service = new TokenService();
    // Mock localStorage and sessionStorage
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => store[key] = value,
      removeItem: (key: string) => delete store[key],
      clear: () => { for (const key in store) delete store[key]; }
    });
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    });
  });

  const createMockToken = (payload: any) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    return `${header}.${payloadEncoded}.signature`;
  };

  describe('getUserRole', () => {
    it('should extract role from "Role" key', () => {
      const token = createMockToken({ Role: 'Admin' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserRole()).toBe('Admin');
    });

    it('should extract role from lowercase "role" key', () => {
      const token = createMockToken({ role: 'Editor' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserRole()).toBe('Editor');
    });

    it('should extract role from "roles" key', () => {
      const token = createMockToken({ roles: 'User' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserRole()).toBe('User');
    });

    it('should extract role from .NET claim key', () => {
      const token = createMockToken({
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'SuperAdmin'
      });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserRole()).toBe('SuperAdmin');
    });

    it('should return null if no role is found', () => {
      const token = createMockToken({ name: 'John' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserRole()).toBeNull();
    });
  });

  describe('getUserEmail', () => {
    it('should extract email from "email" key', () => {
      const token = createMockToken({ email: 'test@example.com' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserEmail()).toBe('test@example.com');
    });

    it('should extract email from uppercase "Email" key', () => {
      const token = createMockToken({ Email: 'test2@example.com' });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserEmail()).toBe('test2@example.com');
    });

    it('should extract email from .NET claim key', () => {
      const token = createMockToken({
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'dotnet@example.com'
      });
      vi.spyOn(service, 'getAccessToken').mockReturnValue(token);
      expect(service.getUserEmail()).toBe('dotnet@example.com');
    });
  });
});
