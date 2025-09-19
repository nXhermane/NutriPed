import { ExceptionBase, INTERNAL_REPO_ERROR, NotFoundException } from "@shared";
export class RepositoryNotFoundError extends ExceptionBase {
  code: string = "REPOSITORY_NOT_FOUND_ERROR";
  static readonly message: "Entity not found in repository";
}

export class RepositoryException extends ExceptionBase {
  code: string = INTERNAL_REPO_ERROR;
  static readonly message: "Repository internal error ";
}
