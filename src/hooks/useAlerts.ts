import { useDialog } from '@/hooks/useDialog';
import { DialogVariant } from '@/components/ui/dialog/dialog.types';

export const useAlerts = () => {
  const dialog = useDialog();

  const confirm = async (options: {
    title: string;
    text?: string;
    description?: string;
    icon?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    variant?: DialogVariant;
  }) => {
    let variant: DialogVariant = options.variant || (options.danger ? 'danger' : 'info');
    if (options.icon === 'warning') variant = 'warning';
    if (options.icon === 'error') variant = 'error';
    if (options.icon === 'success') variant = 'success';
    if (options.icon === 'question') variant = 'question';

    return dialog.confirm({
      title: options.title,
      description: options.text || options.description,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      variant,
    });
  };

  const success = (title: string, text?: string) => {
    return dialog.success(title, text);
  };

  const error = (title: string, text?: string) => {
    return dialog.error(title, text);
  };

  const info = (title: string, text?: string) => {
    return dialog.info(title, text);
  };

  return {
    confirm,
    success,
    error,
    info,
  };
};
