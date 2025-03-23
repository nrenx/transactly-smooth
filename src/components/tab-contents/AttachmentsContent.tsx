
import React from 'react';
import { Transaction, Attachment } from '@/lib/types';

interface AttachmentsContentProps {
  attachments: Attachment[];
  transaction: Transaction;
  refreshTransaction: () => Promise<void>;
}

const AttachmentsContent: React.FC<AttachmentsContentProps> = ({ attachments, transaction, refreshTransaction }) => {
  if (!attachments || attachments.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No attachments available</div>;
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        );
      case 'application/pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        );
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Attachments</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="border rounded-lg p-4 bg-muted/30 flex flex-col">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-background rounded-md mr-3 border">
                {getFileIcon(attachment.type)}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-medium truncate">{attachment.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(attachment.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-auto pt-2">
              <a 
                href={attachment.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                View Attachment
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsContent;
