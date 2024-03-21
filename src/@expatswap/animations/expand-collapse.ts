import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExpatswapAnimationCurves, ExpatswapAnimationDurations } from '@expatswap/animations/defaults';

// -----------------------------------------------------------------------------------------------------
// @ Expand / collapse
// -----------------------------------------------------------------------------------------------------
const expandCollapse = trigger('expandCollapse',
    [
        state('void, collapsed',
            style({
                height: '0',
            }),
        ),

        state('*, expanded',
            style('*'),
        ),

        // Prevent the transition if the state is false
        transition('void <=> false, collapsed <=> false, expanded <=> false', []),

        // Transition
        transition('void <=> *, collapsed <=> expanded',
            animate('{{timings}}'),
            {
                params: {
                    timings: `${ExpatswapAnimationDurations.entering} ${ExpatswapAnimationCurves.deceleration}`,
                },
            },
        ),
    ],
);

export { expandCollapse };
