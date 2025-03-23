
import React from 'react';
import { Transaction, Note } from '@/lib/types';

interface NotesContentProps {
  notes: Note[];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const NotesContent: React.FC<NotesContentProps> = ({ notes, transaction, refreshTransaction }) => {
  if (!notes || notes.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No notes available</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Transaction Notes</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-4 bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-muted-foreground">
                {new Date(note.date).toLocaleDateString()}
              </p>
            </div>
            <p className="whitespace-pre-wrap">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesContent;
