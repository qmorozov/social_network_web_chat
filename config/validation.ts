export default abstract class Validation {
  static required(message = 'validation.required') {
    return (value: any) => (!value ? message : undefined);
  }

  static phone(
    phoneValidationCallback: (value: string) => boolean,
    message = 'validation.phone.required'
  ) {
    return (value: string) =>
      !phoneValidationCallback(value) ? message : undefined;
  }

  static fullName(message = 'validation.full-name') {
    return (value: string) => {
      const [firstName, lastName] = value.split(' ');
      return firstName && lastName ? undefined : message;
    };
  }
}
