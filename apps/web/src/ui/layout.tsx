import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Item } from '@astryxdesign/core/Item';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Icon } from './primitives';

/** Page header: one h1, an optional context line above and a lead paragraph below. */
export function PageHeader({
  title,
  lead,
  context,
  children,
}: {
  title: ReactNode;
  lead?: ReactNode;
  context?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <VStack gap={2} className="page-header">
      {context && <Text type="supporting">{context}</Text>}
      <Heading level={1}>{title}</Heading>
      {lead && (
        <Text as="p" type="large" weight="normal" color="secondary">
          {lead}
        </Text>
      )}
      {children}
    </VStack>
  );
}

/** A full-width navigational row. Rendered as a router link so it stays a real anchor. */
export function RowLink({
  to,
  label,
  description,
  start,
  end,
  className,
}: {
  to: string;
  label: ReactNode;
  description?: ReactNode;
  start?: ReactNode;
  end?: ReactNode;
  className?: string;
}) {
  return (
    <RouterLink to={to} className={className ? `row-link ${className}` : 'row-link'}>
      <Item
        label={<Text weight="semibold">{label}</Text>}
        description={
          description ? (
            <Text type="supporting" color="secondary">
              {description}
            </Text>
          ) : undefined
        }
        startContent={start}
        endContent={end ?? <Icon name="arrow" />}
        align="first-line"
      />
    </RouterLink>
  );
}

/** Section heading with an optional supporting line and trailing action. */
export function SectionHeader({
  title,
  description,
  action,
  level = 2,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  level?: 2 | 3;
}) {
  return (
    <HStack gap={3} hAlign="between" vAlign="end" wrap="wrap" className="section-header">
      <VStack gap={1}>
        <Heading level={level}>{title}</Heading>
        {description && (
          <Text as="p" color="secondary">
            {description}
          </Text>
        )}
      </VStack>
      {action}
    </HStack>
  );
}
