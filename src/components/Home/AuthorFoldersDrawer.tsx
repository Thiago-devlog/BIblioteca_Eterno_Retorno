import React from 'react';
import { AuthorProfile, BookItem } from '../../data/catalog';
import { FolderDrawer } from '../FolderDrawer';

export interface AuthorFoldersDrawerProps {
  authors: AuthorProfile[];
  books: BookItem[];
  selectedAuthorId: string;
  onSelectAuthor: (authorId: string) => void;
  onOpenBook: (book: BookItem) => void;
  readingProgress: Record<string, { progressPercent: number }>;
}

export const AuthorFoldersDrawer: React.FC<AuthorFoldersDrawerProps> = ({
  authors,
  books,
  selectedAuthorId,
  onSelectAuthor,
  onOpenBook,
  readingProgress,
}) => {
  return (
    <FolderDrawer
      authors={authors}
      books={books}
      selectedAuthorId={selectedAuthorId}
      onSelectAuthor={onSelectAuthor}
      onOpenBook={onOpenBook}
      readingProgress={readingProgress}
    />
  );
};
