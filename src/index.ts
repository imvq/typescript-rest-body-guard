import { Errors } from 'typescript-rest';
import { ParamType } from 'typescript-rest/dist/server/model/metadata';
import { ServerContainer } from 'typescript-rest/dist/server/server-container';

/**
 * Body-checking decorator to be used with typescript-rest as annotation.
 * Throws error if user forgets to provide any argument in POST body data.
 *
 * @param {new (...args: any[]) => T} DTOClass DTO representation of request body data
 * @returns {(_target: Object, _key: string
 *   | symbol, descriptor: PropertyDescriptor) => void} Decorated method
 */
export function BodyGuard(
  target: Object,
  propKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  const serviceMethod = ServerContainer.get().registerServiceMethod(
    target.constructor, propKey
  );
  const dtoClass = serviceMethod.parameters.find(
    param => param.paramType === ParamType.body
  );

  if (!dtoClass) {
    throw new Errors.InternalServerError('Body data argument not provided.');
  }

  const bodyArgPosition = serviceMethod.parameters.indexOf(dtoClass);

  // eslint-disable-next-line
  descriptor.value = function (...args: any[]) {
    const bodyData = args[bodyArgPosition];

    const observableInstance = new (dtoClass.type as { new (): any })();
    Object.getOwnPropertyNames(observableInstance).forEach((key) => {
      if (!bodyData[key]) {
        throw new Errors.BadRequestError(
          `Request data is missing the '${key}' parameter.`
        );
      }
    });

    return original.apply(this, args);
  };
}

export default BodyGuard;
