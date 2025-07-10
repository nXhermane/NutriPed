import { ExceptionBase, INTERNAL_REPO_ERROR, NOT_FOUND } from "../exceptions";

export class RepositoryNotFoundException extends ExceptionBase {
  code: string = NOT_FOUND;
}

export class RepositoryInternalError extends ExceptionBase {
  code: string = INTERNAL_REPO_ERROR;
}
