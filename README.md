# BodyGuard for typescript-rest
⚠ __This codebase is no longer maintained.__ ⚠

BodyGuard is a library to use in conjunction with [typescript-rest](https://github.com/thiagobustamante/typescript-rest#readme). The library provides a decorator to check if request body data contains all arguments you need.
## Installation
Using npm:
```shell
$ npm i typescript-rest-body-guard
```
Or using yarn:
```shell
$ yarn add typescript-rest-body-guard
```
## Preconditions
You must provide a DTO class representing your POST data for the request.
```ts
// DTOs.ts

export class LoginDTO {
  public constructor(
    public username: string = '',
    public password: string = ''
  ) {}
}
```
Then you can use it with BodyGuard in your controller:
```ts
import { Path, POST } from 'typescript-rest';
import { BodyGuard } from 'typescript-rest-body-guard';

import DTOs from './DTOs';

@Path('/auth')
export default class AuthController {
  @BodyGuard
  @Path('/login')
  @POST
  public login(data: DTOs.LoginDTO) {
    // ...
  }
}
```
Now request body arguments are guaranteed not to be empty or BodyGuard automatically will return an error to user.
