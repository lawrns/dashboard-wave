import React from 'react';
import { Button } from '@/components/ui/button';
import { Archive, Trash2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkBarProps {
  selectedCount: number;
  totalCount: number;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
  onClearSelection: () => void;
}

export const BulkBar: React.FC<BulkBarProps> = ({
  selectedCount,
  totalCount,
  onArchive,
  onDelete,
  onExport,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="admin-clients-bulk-bar"
      >
        <div className="admin-clients-bulk-bar-count">
          {selectedCount} of {totalCount} clients selected
        </div>

        <div className="admin-clients-bulk-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onArchive}
            className="flex items-center gap-2"
          >
            <Archive className="w-4 h-4" />
            Archive
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
