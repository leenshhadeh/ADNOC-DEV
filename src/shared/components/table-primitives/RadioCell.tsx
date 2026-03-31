import {useState} from 'react';
import { cn } from '@/shared/lib/utils';


 
const RadioCell=(props:any) => {
    const {value } = props;

      const [enabled, setEnabled] = useState(value)
    
    return (
        <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled((v:any) => !v)}
          className={cn(
            'focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:outline-none',
            enabled ? 'bg-primary' : 'bg-input',
          )}
        >
          <span
            className={cn(
              'bg-background pointer-events-none block h-4 w-4 rounded-full shadow-md ring-0 transition-transform',
              enabled ? 'translate-x-4' : 'translate-x-0',
            )}
          />
        </button>
        <span className="text-foreground text-sm">{enabled ? 'Yes' : 'No'}</span>
      </div>
    );
};

export default RadioCell;
