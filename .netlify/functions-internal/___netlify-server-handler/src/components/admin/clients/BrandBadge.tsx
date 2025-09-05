import React from 'react';
import { Badge } from '@/components/ui/badge';
import { clsx } from 'clsx';

interface BrandBadgeProps {
  brand: 'Heiwa House' | 'Freedom Routes';
  className?: string;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({ brand, className }) => {
  const isHeiwaHouse = brand === 'Heiwa House';

  return (
    <Badge
      variant="outline"
      className={clsx(
        'font-medium',
        isHeiwaHouse
          ? 'admin-clients-brand-heiwa-house'
          : 'admin-clients-brand-freedom-routes',
        className
      )}
    >
      {brand}
    </Badge>
  );
};
