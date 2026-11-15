import type { ComponentProps } from 'react';
import { Button as AstryxButton } from '@astryxdesign/core/Button';

/**
 * Astryx button with a stable class per variant, so the app's own look (tactile edge,
 * ink colors) can be applied from CSS. Behaviour, roles and labels stay Astryx's.
 */
export function Button({ className, variant, size, ...rest }: ComponentProps<typeof AstryxButton>) {
  const classes = `btn btn-${variant ?? 'secondary'}${size === 'lg' ? ' btn-lg' : ''}${className ? ` ${className}` : ''}`;
  return <AstryxButton {...rest} variant={variant} size={size} className={classes} />;
}
