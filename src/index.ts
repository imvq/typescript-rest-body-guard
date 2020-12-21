import { Errors } from 'typescript-rest';

/**
 * Check if POJO argument is superimposed on given class.
 *
 * @param {any} arg Argument to check
 * @param {new (...args: any[]) => T} IntrospectedConstructor Constructor of class to compare with
 * @returns {boolean} Ok or not
 */
function isSuperimposedOn<T>(
  arg: any,
  IntrospectedConstructor: new (...args: any[]) => T
): boolean {
  const observedInstance = new IntrospectedConstructor();
  return Object.keys(arg).every((key) => key in observedInstance);
}

/**
 * Body-checking decorator to be used with typescript-rest as annotation.
 * Throws error if user forgets to provide any argument in POST body data.
 *
 * @param {new (...args: any[]) => T} DTOClass DTO representation of request body data
 * @returns {(_target: Object, _key: string | symbol, descriptor: PropertyDescriptor) => void} Decorated method
 */
export function BodyGuard<T>(DTOClass: new (...args: any[]) => T) {
  return (
    _target: Object,
    _key: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const original = descriptor.value;

    // eslint-disable-next-line
    descriptor.value = function (...args: any[]) {
      const bodyData = args.find((arg) => isSuperimposedOn(arg, DTOClass));

      if (!bodyData) {
        throw new Errors.InternalServerError('Body data argument not provided.');
      }

      const observedInstance = new DTOClass();
      Object.getOwnPropertyNames(observedInstance).forEach((key) => {
        if (!bodyData[key]) {
          throw new Errors.BadRequestError(
            `Request data is missing the '${key}' parameter.`
          );
        }
      });

      return original.apply(this, args);
    };
  };
}

export default BodyGuard;
