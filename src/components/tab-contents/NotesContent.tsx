
import React, { useState } from 'react';
import { Transaction, Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { dbManager } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotesContentProps {
  notes: Note[];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const NotesContent: React.FC<NotesContentProps> = ({ notes, transaction, refreshTransaction }) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const addNote = async () => {
    try {
      if (!newNoteContent.trim()) {
        toast({
          title: "Error",
          description: "Note content cannot be empty",
          variant: "destructive",
        });
        return;
      }

      const newNote: Note = {
        id: generateId('note'),
        date: new Date().toISOString(),
        content: newNoteContent.trim(),
      };

      // Update transaction with new note
      const updatedTransaction = {
        ...transaction,
        notes: [...transaction.notes, newNote],
      };

      await dbManager.updateTransaction(updatedTransaction);
      
      toast({
        title: "Success",
        description: "Note added successfully",
      });
      
      setIsAddingNote(false);
      setNewNoteContent('');
      
      await refreshTransaction();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await dbManager.deleteTransaction(transaction.id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      navigate('/');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button 
          onClick={() => setIsAddingNote(true)}
          variant="default"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No notes added yet. Add your first note.
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(note.date).toLocaleDateString()} {new Date(note.date).toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Note Dialog */}
      <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="noteContent">Note Content</Label>
              <Textarea
                id="noteContent"
                placeholder="Enter note content"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>Cancel</Button>
            <Button onClick={addNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8 border-t pt-6">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <p className="py-4">This action cannot be undone. This will permanently delete this transaction and all its data.</p>
            <DialogFooter className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NotesContent;
