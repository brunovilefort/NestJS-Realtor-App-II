import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserInfo } from '@/user/interfaces';

export const User = createParamDecorator((data, context: ExecutionContext): UserInfo => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
