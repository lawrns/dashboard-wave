import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileX,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`admin-clients-empty ${className}`}>
      <Icon className="admin-clients-empty-icon" />
      <h3 className="admin-clients-empty-title">{title}</h3>
      {description && (
        <p className="admin-clients-empty-description">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};
