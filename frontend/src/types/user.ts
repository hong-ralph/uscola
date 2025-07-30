// Frontend User types - self-contained, no shared dependencies
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Keep legacy names for backward compatibility
export type CreateUserData = CreateUserRequest;
export type UpdateUserData = UpdateUserRequest;

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}