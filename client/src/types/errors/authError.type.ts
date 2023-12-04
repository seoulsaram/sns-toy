import ErrorBase from '../../util/errorBase';

type ErrorName = 'AUTH_ERROR';

export default class AuthError extends ErrorBase<ErrorName> {}
