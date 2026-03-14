import { AppService } from './app.service';

describe('AppService', () => {
  it('should return health payload', () => {
    const service = new AppService();

    expect(service.getHealth()).toEqual({
      status: 'ok',
      service: '01-nest-basics',
    });
  });
});
