export type PasswordChecks = {
  firstUppercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  minLength: boolean;
};

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    firstUppercase: /^[A-Z].*/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    minLength: password.length >= 6,
  };
}

export function isPasswordValid(password: string): boolean {
  const c = getPasswordChecks(password);
  // Enforce: first letter uppercase, at least one symbol, at least one number, and keep existing min length 6
  return c.firstUppercase && c.hasNumber && c.hasSymbol && c.minLength;
}
