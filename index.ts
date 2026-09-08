import { registerRootComponent } from 'expo';

import App from './App';

const RootComponent = (typeof App === 'function') ? App : ((App as any)?.default || App);

registerRootComponent(RootComponent);

