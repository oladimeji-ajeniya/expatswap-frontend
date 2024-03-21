import { Injectable } from '@angular/core';
import { ExpatswapDrawerComponent } from '@expatswap/components/drawer/drawer.component';

@Injectable({providedIn: 'root'})
export class ExpatswapDrawerService
{
    private _componentRegistry: Map<string, ExpatswapDrawerComponent> = new Map<string, ExpatswapDrawerComponent>();

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: ExpatswapDrawerComponent): void
    {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void
    {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): ExpatswapDrawerComponent | undefined
    {
        return this._componentRegistry.get(name);
    }
}
