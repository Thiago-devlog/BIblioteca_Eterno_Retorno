import React, { useState } from 'react';
import { AuthorProfile, BookItem } from '../../data/catalog';
import { AuthorEditorialModal } from '../Modal/AuthorEditorialModal';

interface AuthorDossierModalProps {
  authors: AuthorProfile[];
  books: BookItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenBook: (book: BookItem) => void;
  initialAuthorId?: string;
  themeMode?: 'light' | 'dark' | 'amber';
}

export const AuthorDossierModal: React.FC<AuthorDossierModalProps> = ({
  authors,
  books,
  isOpen,
  onClose,
  onOpenBook,
  initialAuthorId,
  themeMode = 'light',
}) => {
  const [activeAuthor, setActiveAuthor] = useState<AuthorProfile>(() => {
    if (initialAuthorId) {
      const found = authors.find((a) => a.id === initialAuthorId);
      if (found) return found;
    }
    return authors[0] || null;
  });

  if (!isOpen || !activeAuthor) return null;

  return (
    <AuthorEditorialModal
      author={activeAuthor}
      authors={authors}
      books={books}
      isOpen={isOpen}
      onClose={onClose}
      onOpenBook={onOpenBook}
      onSelectAuthor={setActiveAuthor}
      themeMode={themeMode}
    />
  );
};
