import * as React from 'react';

export const useIsOverflow = (ref: React.RefObject<HTMLDivElement>, callback: undefined | any = undefined) => {
    const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(undefined);

    React.useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            if (current) {
                const hasOverflow = current.scrollHeight > current.clientHeight;

                setIsOverflow(hasOverflow);

                if (callback) callback(hasOverflow);
            }
        };

        if (current) {
            trigger();
        }
    }, [callback, ref]);

    return isOverflow;
};