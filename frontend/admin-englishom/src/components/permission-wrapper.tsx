import { cn } from '@/lib/utils';
import React, { cloneElement, ReactNode } from 'react';

type PermissionWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  permission: 'View' | 'Edit' | 'Hidden';
  children: ReactNode;
  allowRecursive?: boolean;
};

// Note: If a child element has props called "asChild" set to true, it does not work as expected.
const recursivelyDisableInteractions = (
  element: ReactNode,
  allowRecursive: boolean = false,
): ReactNode => {
  if (!React.isValidElement(element)) return element;

  const props: Record<string, unknown> = {
    ...element.props,
    disabled: true,
    title: 'You do not have permission to interact with this element',
    href: '#',
  };

  Object.keys(props).forEach((key) => {
    if (key.startsWith('on') && typeof props[key] === 'function') {
      props[key] = undefined;
    }
  });

  if (props.style) {
    props.style = {
      ...props.style,
      cursor: 'not-allowed',
    };
  } else {
    props.style = { cursor: 'not-allowed' };
  }

  if (props.children && allowRecursive) {
    props.children = React.Children.map(props.children as ReactNode, (child) =>
      recursivelyDisableInteractions(child, true),
    );
  }

  return cloneElement(element, props);
};

const PermissionWrapper: React.FC<PermissionWrapperProps> = ({
  permission,
  children,
  allowRecursive = false,
  className,
  ...props
}) => {
  if (permission === 'Hidden') {
    return null;
  }

  if (permission === 'View') {
    return (
      <div className={cn('contents', className)} {...props}>
        {React.Children.map(children, (child) =>
          recursivelyDisableInteractions(child, allowRecursive),
        )}
      </div>
    );
  }

  return (
    <div className={cn('contents', className)} {...props}>
      {children}
    </div>
  );
};

export default PermissionWrapper;
