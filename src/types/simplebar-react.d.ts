declare module 'simplebar-react' {
    import { ComponentType, HTMLAttributes } from 'react';
    
    interface SimpleBarProps extends HTMLAttributes<HTMLDivElement> {
        scrollableNodeProps?: object;
        forceVisible?: boolean | 'x' | 'y';
    }
    
    const SimpleBar: ComponentType<SimpleBarProps>;
    export default SimpleBar;
}