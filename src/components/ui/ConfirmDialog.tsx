'use client';

import React from 'react';
import { Dialog } from './dialog/Dialog';
import { DialogProps } from './dialog/dialog.types';

export type { DialogVariant, DialogMode, DialogOptions, DialogProps } from './dialog/dialog.types';
export { Dialog };

export function ConfirmDialog(props: DialogProps) {
  return <Dialog {...props} />;
}
