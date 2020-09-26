//! This custom built decorator will be used to retrieve user data from request, (which was set by the jwt.strategy)

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

// export const GetUser = createParamDecorator(
//   (data: unknown, context: ExecutionContext) => {
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req.user;
//   },
// );
