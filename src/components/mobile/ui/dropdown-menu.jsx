import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

const DropdownMenuContext = React.createContext();

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        setOpen(true);
        if (children.props.onClick) children.props.onClick(e);
      },
    });
  }
  
  return (
    <button {...props} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = 'start', className, children, ...props }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext);
  
  if (!open) return null;
  
  return (
    <div
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'end' ? 'right-0' : 'left-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className, children, ...props }) {
  const { setOpen } = React.useContext(DropdownMenuContext);
  
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={(e) => {
        if (props.onClick) props.onClick(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

