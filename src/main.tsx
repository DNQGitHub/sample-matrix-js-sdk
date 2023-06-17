import ReactDOM from 'react-dom/client';
import { App } from './app';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />
);

