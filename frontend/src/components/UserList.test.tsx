import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';
import { User } from '../types/user';

const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    updatedAt: new Date('2024-01-02T00:00:00.000Z')
  }
];

describe('UserList', () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    // Mock window.confirm
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: jest.fn(() => true)
    });
  });

  it('renders user list correctly', () => {
    render(<UserList users={mockUsers} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    render(<UserList users={[]} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('등록된 사용자가 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('새 사용자를 추가해보세요!')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked and confirmed', async () => {
    render(<UserList users={mockUsers} onDelete={mockOnDelete} />);
    
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('정말로 John Doe을(를) 삭제하시겠습니까?');
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    });
  });

  it('does not call onDelete when delete is cancelled', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    
    render(<UserList users={mockUsers} onDelete={mockOnDelete} />);
    
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });
});